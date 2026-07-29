#!/usr/bin/env node
/* Google Search Console, from the command line.

     node scripts/gsc.mjs sitemaps            list what is submitted, and its status
     node scripts/gsc.mjs submit [sitemapUrl] (re)submit a sitemap so Google re-reads it
     node scripts/gsc.mjs inspect <pageUrl>   what Google knows about one URL
     node scripts/gsc.mjs perf [days]         clicks and impressions, top pages and queries

   Two ways to authenticate, tried in this order:

   1. Your own Google account, via gcloud's application default credentials.
      This is the easy one: you already own the property, so nothing has to be
      granted. Set it up with
        gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/cloud-platform
   2. A service account, if GSC_SERVICE_ACCOUNT_KEY points at a JSON key. Better
      for anything unattended (cron, CI) since it does not expire when you
      revoke a browser session, but its email has to be added as a user on the
      property first or every call returns 403.

   No dependencies. Signing a JWT is twenty lines of node:crypto, and the whole
   googleapis package is a large install to avoid writing them.

   WHAT THIS CANNOT DO: "Request indexing", the button in the URL Inspection UI,
   has no API. The Indexing API exists but Google supports it only for
   JobPosting and BroadcastEvent pages, so pointing it at an article is off
   spec. Submitting the sitemap is the supported way to say "look again", and
   for a site this size Google re-reads it quickly. */

import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const SITE = process.env.GSC_SITE ?? 'sc-domain:fberrez.co';
const DEFAULT_SITEMAP = 'https://www.fberrez.co/sitemap-index.xml';
const KEY_PATH = process.env.GSC_SERVICE_ACCOUNT_KEY ?? null;
const ADC_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ??
  resolve(homedir(), '.config/gcloud/application_default_credentials.json');

const SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/webmasters/v3';
const INSPECT_API = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

const b64url = (input) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const readJson = (path) => {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
};

/** Whichever credential is present. Service account wins if explicitly set. */
function credential() {
  if (KEY_PATH) {
    const key = readJson(KEY_PATH);
    if (!key) die(`GSC_SERVICE_ACCOUNT_KEY points at ${KEY_PATH}, which does not exist`);
    return { kind: 'service_account', key };
  }
  const adc = readJson(ADC_PATH);
  if (adc?.refresh_token) return { kind: 'user', adc };
  if (adc?.type === 'service_account') return { kind: 'service_account', key: adc };

  die(
    `no Google credentials found.\n\n` +
      `Run this once:\n` +
      `  gcloud auth application-default login \\\n` +
      `    --scopes=https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/cloud-platform\n\n` +
      `Then sign in as florent.berrez@gmail.com, the account that owns the property.\n` +
      `See the Search Console section of README.md.`,
  );
}

/** Refresh token, the path used by `gcloud auth application-default login`. */
async function userToken({ adc }) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: adc.client_id,
      client_secret: adc.client_secret,
      refresh_token: adc.refresh_token,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    die(
      `token refresh failed: ${body.error} ${body.error_description ?? ''}\n` +
        `If the grant was revoked or the scopes are wrong, run the ` +
        `application-default login again with the webmasters scope.`,
    );
  }
  return body.access_token;
}

/** Service account JWT, exchanged for an access token. */
async function serviceAccountToken({ key }) {
  const now = Math.floor(Date.now() / 1000);

  const claim = {
    iss: key.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const signingInput = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(
    JSON.stringify(claim),
  )}`;
  const signature = createSign('RSA-SHA256').update(signingInput).end().sign(key.private_key);
  const jwt = `${signingInput}.${signature
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const body = await res.json();
  if (!res.ok) die(`token request failed: ${body.error} ${body.error_description ?? ''}`);
  return body.access_token;
}

async function getToken() {
  const cred = credential();
  return cred.kind === 'user' ? userToken(cred) : serviceAccountToken(cred);
}

async function call(url, { method = 'GET', body } = {}) {
  const token = (call.token ??= await getToken());
  const cred = credential();

  // User credentials must name a project to bill the quota to, and the header
  // is the only way to say so: writing quota_project_id into the ADC file only
  // works for callers that read it and send this, which the client libraries do
  // and a hand-rolled fetch does not. Without it every call is a 403 whose
  // message talks about quota, not permissions.
  const quotaProject = cred.kind === 'user' ? cred.adc.quota_project_id : null;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(quotaProject ? { 'x-goog-user-project': quotaProject } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 403) {
    const detail = await res.text();
    // Two very different failures share this status, and the distinction is
    // only in the body. Guessing wrong sends you looking at the wrong thing.
    if (detail.includes('quota project')) {
      die(
        `403: no quota project on the credentials.\n` +
          `Run: gcloud auth application-default set-quota-project fberrez-seo`,
      );
    }
    die(
      `403 from Search Console on ${SITE}.\n` +
        (cred.kind === 'service_account'
          ? `The service account authenticated but is not a user on the property.\n` +
            `Add ${cred.key.client_email} under Settings > Users and permissions.`
          : `Authenticated as a user who cannot read this property. Check the\n` +
            `application-default login ran as florent.berrez@gmail.com.`) +
          `\n\n${detail.slice(0, 300)}`,
    );
  }
  const text = await res.text();
  if (!res.ok) die(`${res.status} ${res.statusText}\n${text}`);
  return text ? JSON.parse(text) : {};
}

const site = () => encodeURIComponent(SITE);

async function sitemaps() {
  const { sitemap = [] } = await call(`${API}/sites/${site()}/sitemaps`);
  if (!sitemap.length) return console.log('no sitemaps submitted');

  for (const s of sitemap) {
    const submitted = s.lastSubmitted?.slice(0, 10) ?? '-';
    const read = s.lastDownloaded?.slice(0, 10) ?? 'never';
    const urls = s.contents?.reduce((n, c) => n + Number(c.submitted ?? 0), 0) ?? 0;
    console.log(`${s.path}`);
    console.log(`  submitted ${submitted}   last read ${read}   urls ${urls}`);
    if (s.errors > 0 || s.warnings > 0) console.log(`  errors ${s.errors}  warnings ${s.warnings}`);
    if (s.isPending) console.log('  pending: Google has not read this version yet');
  }
}

async function submit(url = DEFAULT_SITEMAP) {
  await call(`${API}/sites/${site()}/sitemaps/${encodeURIComponent(url)}`, { method: 'PUT' });
  console.log(`submitted ${url}`);
  console.log('re-reading is asynchronous; run `sitemaps` in a few minutes to see it land');
}

async function inspect(url) {
  if (!url) die('usage: node scripts/gsc.mjs inspect <pageUrl>');
  const { inspectionResult } = await call(INSPECT_API, {
    method: 'POST',
    body: { inspectionUrl: url, siteUrl: SITE },
  });

  const r = inspectionResult?.indexStatusResult ?? {};
  console.log(url);
  console.log(`  verdict        ${r.verdict ?? '-'}`);
  console.log(`  coverage       ${r.coverageState ?? '-'}`);
  console.log(`  robots         ${r.robotsTxtState ?? '-'}`);
  console.log(`  indexing       ${r.indexingState ?? '-'}`);
  console.log(`  last crawled   ${r.lastCrawlTime?.slice(0, 10) ?? 'never'}`);
  console.log(`  canonical      ${r.googleCanonical ?? '-'}`);
  if (r.pageFetchState) console.log(`  fetch          ${r.pageFetchState}`);
  if (inspectionResult?.inspectionResultLink) {
    console.log(`  open           ${inspectionResult.inspectionResultLink}`);
  }
}

async function perf(days = '28') {
  const end = new Date();
  const start = new Date(end.getTime() - Number(days) * 86400000);
  const iso = (d) => d.toISOString().slice(0, 10);

  const query = (dimension) =>
    call(`${API}/sites/${site()}/searchAnalytics/query`, {
      method: 'POST',
      body: { startDate: iso(start), endDate: iso(end), dimensions: [dimension], rowLimit: 10 },
    });

  const [pages, queries] = await Promise.all([query('page'), query('query')]);
  const total = (rows = []) =>
    rows.reduce((a, r) => ({ clicks: a.clicks + r.clicks, impressions: a.impressions + r.impressions }), {
      clicks: 0,
      impressions: 0,
    });

  const t = total(pages.rows);
  console.log(`${iso(start)} to ${iso(end)}   ${t.clicks} clicks, ${t.impressions} impressions\n`);

  const table = (title, rows = [], key) => {
    console.log(title);
    if (!rows.length) return console.log('  (nothing yet)\n');
    for (const r of rows) {
      const label = key === 'page' ? r.keys[0].replace('https://www.fberrez.co', '') || '/' : r.keys[0];
      console.log(`  ${String(r.clicks).padStart(4)} clicks ${String(r.impressions).padStart(6)} impr  ${label}`);
    }
    console.log('');
  };

  table('top pages', pages.rows, 'page');
  table('top queries', queries.rows, 'query');
}

function die(message) {
  console.error(message);
  process.exit(1);
}

const [, , cmd, ...rest] = process.argv;
const commands = { sitemaps, submit, inspect, perf };

if (!commands[cmd]) {
  die('usage: node scripts/gsc.mjs <sitemaps|submit|inspect|perf> [arg]');
}
await commands[cmd](...rest);
