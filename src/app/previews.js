'use client';
import { useEffect, useState } from 'react';

export function MamboPreview() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { id: '0001', email: 'alex@parisweb.fr', created: '2026-05-12', active: true },
    { id: '0002', email: 'marin@nuage.io', created: '2026-05-12', active: true },
    { id: '0003', email: 'jules@kitchen.house', created: '2026-05-13', active: false },
    { id: '0004', email: 'ines@lavoix.co', created: '2026-05-14', active: true },
    { id: '0005', email: 'theo@studio.fm', created: '2026-05-15', active: true },
  ];

  const queries = [
    'SELECT * FROM users WHERE active LIMIT 5;',
    'SELECT count(*) FROM orders;',
    'EXPLAIN ANALYZE SELECT * FROM users;',
    '\\d+ users',
  ];
  const q = queries[tick % queries.length];

  return (
    <>
      <div className="preview-hd">
        <div className="dots"><i /><i /><i /></div>
        <span className="ttl">
          mambo<span className="sep">▸</span>production_db<span className="sep">▸</span>users
        </span>
        <span className="right">12,447 rows · 14ms</span>
      </div>
      <div className="preview-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <table className="ws-table">
          <thead>
            <tr>
              <th style={{ width: 44 }}>id</th>
              <th>email</th>
              <th style={{ width: 88 }}>created</th>
              <th style={{ width: 50, textAlign: 'center' }}>act</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ color: 'var(--ink-3)' }}>{r.id}</td>
                <td>{r.email}</td>
                <td style={{ color: 'var(--ink-3)' }}>{r.created}</td>
                <td style={{ textAlign: 'center' }}>
                  {r.active ? <span className="ok">●</span> : <span style={{ color: 'var(--ink-4)' }}>○</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 'auto', fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.5, wordBreak: 'break-word' }}>
          <div><span style={{ color: 'var(--accent)' }}>:q</span> <span style={{ color: 'var(--ink)' }}>{q}</span></div>
          <div style={{ color: 'var(--ink-4)', fontSize: 11 }}>→ 5 rows · postgres@prod · keymap: vim</div>
        </div>
      </div>
    </>
  );
}

export function BlurtPreview() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c + 1) % 3), 1800);
    return () => clearInterval(id);
  }, []);
  const channels = [
    { from: '✉  hi@blurt.sh', via: 'email', label: 'received' },
    { from: '$  blurt push notes/may.md', via: 'cli', label: 'pushed' },
    { from: '▸  /editor', via: 'web', label: 'saved' },
  ];
  const c = channels[count];

  return (
    <>
      <div className="preview-hd">
        <div className="dots"><i /><i /><i /></div>
        <span className="ttl">blurt.sh<span className="sep">/</span>flo<span className="sep">/</span>posts</span>
        <span className="right">17 posts · feed live</span>
      </div>
      <div className="preview-body" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
        <div style={{ background: 'var(--paper)', padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 11.5, lineHeight: 1.5, color: 'var(--ink-2)', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ color: 'var(--ink-4)' }}># may 2026</div>
          <div style={{ color: 'var(--ink-4)' }}>## running</div>
          <div style={{ height: 6 }} />
          <div>every morning,</div>
          <div>before the coffee</div>
          <div>i lace up &amp; run</div>
          <div>the same loop.</div>
          <div style={{ height: 6 }} />
          <div style={{ color: 'var(--ink-4)' }}>- no watch</div>
          <div style={{ color: 'var(--ink-4)' }}>- no apps</div>
          <div style={{ height: 6 }} />
          <div>it works.<span style={{ color: 'var(--accent)' }}>▍</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>inbox</div>
          <div style={{ border: '1px solid var(--rule)', borderRadius: 4, padding: '8px 10px', background: 'var(--paper)', overflow: 'hidden' }}>
            <div style={{ fontSize: 11, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.from}</div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>
              via <span style={{ color: 'var(--ink-2)' }}>{c.via}</span> · {c.label}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, lineHeight: 1.7, color: 'var(--ink-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>parse md</span><span style={{ color: 'var(--ok)' }}>ok</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>build feed</span><span style={{ color: 'var(--ok)' }}>ok</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>push cdn</span><span style={{ color: 'var(--ok)' }}>ok</span></div>
            <div style={{ borderTop: '1px dashed var(--rule)', marginTop: 4, paddingTop: 4, display: 'flex', justifyContent: 'space-between', color: 'var(--ink)' }}>
              <span style={{ fontWeight: 500 }}>live</span><span style={{ color: 'var(--accent)' }}>0.4s ↗</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, delta, bad, accent }) {
  return (
    <div style={{ borderBottom: '1px dashed var(--rule)', paddingBottom: 6, minWidth: 0 }}>
      <div style={{ fontSize: 9, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ fontSize: 17, fontFamily: 'var(--serif)', color: accent ? 'var(--accent)' : 'var(--ink)', lineHeight: 1.1, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      <div style={{ fontSize: 10, color: bad ? 'var(--ok)' : 'var(--ink-3)', fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>{delta}</div>
    </div>
  );
}

export function FourDaysPreview() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const weeks = Array.from({ length: 6 }, () => days.map((_, i) => (i < 4 ? 'on' : 'off')));

  return (
    <>
      <div className="preview-hd">
        <div className="dots"><i /><i /><i /></div>
        <span className="ttl">4-days-workweek<span className="sep">/</span>findings</span>
        <span className="right">61 trials · peer-reviewed</span>
      </div>
      <div className="preview-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: 4, marginBottom: 6 }}>
            {days.map((d) => (
              <div key={d} style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: '0.06em', textAlign: 'center', overflow: 'hidden' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {weeks.map((w, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0,1fr))', gap: 4 }}>
                {w.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      height: 14,
                      borderRadius: 2,
                      background: c === 'on' ? 'var(--ink-2)' : 'var(--paper-3)',
                      border: c === 'on' ? 'none' : '1px dashed var(--rule)',
                      transition: 'background 200ms ease',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 10, color: 'var(--ink-3)', display: 'flex', gap: 12 }}>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--ink-2)', borderRadius: 1, marginRight: 4, transform: 'translateY(1px)' }} />worked (4)</span>
            <span><span style={{ display: 'inline-block', width: 8, height: 8, border: '1px dashed var(--rule)', borderRadius: 1, marginRight: 4, transform: 'translateY(1px)' }} />off (3)</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10, marginTop: 4 }}>
          <Stat label="productivity" delta="+4%" value="↑ 102%" />
          <Stat label="burnout" delta="−71%" value="↓ 29%" bad />
          <Stat label="revenue" delta="+1.4%" value="stable" />
          <Stat label="retention" delta="+18%" value="↑ 91%" accent />
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'var(--mono)' }}>
          source: 61 organizations, 2,900+ workers, 2020–2025.
        </div>
      </div>
    </>
  );
}

function Sparkline({ data, height = 32 }) {
  const w = 200;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pad = 2;
  const step = (w - pad * 2) / (data.length - 1);
  const norm = (v) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const pts = data.map((v, i) => `${pad + i * step},${norm(v)}`).join(' ');
  const last = data[data.length - 1];
  return (
    <svg width="100%" height={height} style={{ display: 'block' }} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="var(--ink-2)" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={pad + (data.length - 1) * step} cy={norm(last)} r="2.5" fill="var(--accent)" />
    </svg>
  );
}

export function QuietdashPreview() {
  const rows = [
    { lbl: 'revenue', v: '€4,210', d: '+8.2%', data: [12, 14, 13, 16, 18, 17, 22, 24, 26, 28] },
    { lbl: 'mrr', v: '€1,840', d: '+3.1%', data: [20, 21, 21, 22, 22, 23, 24, 24, 25, 25] },
    { lbl: 'active', v: '318', d: '+12', data: [14, 18, 16, 20, 22, 24, 21, 26, 28, 30] },
    { lbl: 'churn', v: '1.2%', d: '−0.3%', data: [22, 20, 18, 19, 16, 14, 15, 13, 12, 11] },
    { lbl: 'latency', v: '94ms', d: '−6ms', data: [30, 28, 26, 24, 22, 20, 19, 18, 17, 16] },
  ];
  return (
    <>
      <div className="preview-hd">
        <div className="dots"><i /><i /><i /></div>
        <span className="ttl">quietdash<span className="sep">/</span>fberrez.co</span>
        <span className="right">↻ 30s · 5 of 5</span>
      </div>
      <div className="preview-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((r) => (
          <div key={r.lbl} style={{ display: 'grid', gridTemplateColumns: '82px minmax(0,1fr) 84px 52px', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px dashed var(--rule)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{r.lbl}</div>
            <div style={{ minWidth: 0 }}><Sparkline data={r.data} /></div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink)', lineHeight: 1, textAlign: 'right' }}>{r.v}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.d}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function MiniHabitsPreview() {
  const habits = [
    { name: 'read', pattern: [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1] },
    { name: 'walk', pattern: [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1] },
    { name: 'write', pattern: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { name: 'run', pattern: [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1] },
  ];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <>
      <div className="preview-hd">
        <div className="dots"><i /><i /><i /></div>
        <span className="ttl">minihabits<span className="sep">/</span>flo</span>
        <span className="right">streak · 12 days</span>
      </div>
      <div className="preview-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(21, minmax(0,1fr)) 56px', gap: 3, alignItems: 'center' }}>
          <div />
          {Array.from({ length: 21 }).map((_, i) => (
            <div key={i} style={{ fontSize: 9, color: 'var(--ink-4)', textAlign: 'center' }}>{days[i % 7]}</div>
          ))}
          <div style={{ fontSize: 9, color: 'var(--ink-4)', textAlign: 'right', letterSpacing: '0.06em' }}>STREAK</div>
        </div>
        {habits.map((h) => {
          let streak = 0;
          for (let i = h.pattern.length - 1; i >= 0; i--) {
            if (h.pattern[i]) streak++;
            else break;
          }
          return (
            <div key={h.name} style={{ display: 'grid', gridTemplateColumns: '72px repeat(21, minmax(0,1fr)) 56px', gap: 3, alignItems: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', letterSpacing: '-0.005em' }}>{h.name}</div>
              {h.pattern.map((v, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 2,
                    background: v ? (i === h.pattern.length - 1 ? 'var(--accent)' : 'var(--ink-2)') : 'var(--paper-3)',
                    border: v ? 'none' : '1px dashed var(--rule)',
                  }}
                />
              ))}
              <div style={{ fontSize: 12, color: 'var(--ink)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                {streak}<span style={{ color: 'var(--ink-4)', marginLeft: 2 }}>d</span>
              </div>
            </div>
          );
        })}
        <pre className="mono-pre" style={{ marginTop: 8, color: 'var(--ink-3)', fontSize: 11 }}>
          <span className="dim">  tap, done, streak.</span>
          {'\n'}
          <span className="dim">  one screen. no settings. no notifications.</span>
        </pre>
      </div>
    </>
  );
}

export const PROJECT_PREVIEWS = {
  mambo: MamboPreview,
  blurt: BlurtPreview,
  fourdays: FourDaysPreview,
  quietdash: QuietdashPreview,
  minihabits: MiniHabitsPreview,
};
