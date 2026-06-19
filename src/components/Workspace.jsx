import { useEffect, useMemo, useRef, useState } from 'react';
import { PROJECTS } from './projects.js';
import { PROJECT_PREVIEWS } from './previews.jsx';

function useParisClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const fmt = (opts) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hourCycle: 'h23', ...opts }).format(now);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    hh: pad(parseInt(fmt({ hour: '2-digit' }), 10) || 0),
    mm: pad(parseInt(fmt({ minute: '2-digit' }), 10) || 0),
    ss: pad(parseInt(fmt({ second: '2-digit' }), 10) || 0),
    date: fmt({ weekday: 'short', day: '2-digit', month: 'short' }),
    tz: 'CET',
  };
}

export default function Workspace({ mamboVersion }) {
  const [focusIdx, setFocusIdx] = useState(0);
  const [filter, setFilter] = useState('');
  const filterRef = useRef(null);
  const clock = useParisClock();

  const projects = useMemo(() => {
    if (!mamboVersion) return PROJECTS;
    const v = mamboVersion.startsWith('v') ? mamboVersion : `v${mamboVersion}`;
    return PROJECTS.map((p) =>
      p.id === 'mambo' ? { ...p, tail: v, statusLabel: `flagship · ${v}` } : p
    );
  }, [mamboVersion]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.chips.some((c) => c.toLowerCase().includes(q)) ||
        p.kind.toLowerCase().includes(q)
    );
  }, [filter, projects]);

  useEffect(() => {
    if (focusIdx >= filtered.length) setFocusIdx(Math.max(0, filtered.length - 1));
  }, [filtered.length, focusIdx]);

  const current = filtered[focusIdx] || projects[0];

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target && e.target.tagName;
      const inField = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);

      if (inField) {
        if (e.key === 'Escape') e.target.blur();
        else if (e.key === 'Enter') {
          const p = filtered[focusIdx];
          if (p && p.href) window.open(p.href, '_blank', 'noopener');
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusIdx((i) => Math.min(filtered.length - 1, i + 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusIdx((i) => Math.max(0, i - 1));
        }
        return;
      }

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusIdx((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusIdx((i) => Math.max(0, i - 1));
      } else if (e.key === 'g') setFocusIdx(0);
      else if (e.key === 'G') setFocusIdx(Math.max(0, filtered.length - 1));
      else if (e.key === 'Enter' || e.key === 'o') {
        const p = filtered[focusIdx];
        if (p && p.href) window.open(p.href, '_blank', 'noopener');
      } else if (e.key === '/') {
        e.preventDefault();
        filterRef.current && filterRef.current.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, focusIdx]);

  const Preview = PROJECT_PREVIEWS[current.id] || (() => null);

  return (
    <>
      <header className="topbar">
        <div>
          <div className="name">Florent Berrez</div>
          <div className="subline">
            <span>~/fberrez</span>
            <span className="sep">·</span>
            <span>software engineer</span>
            <span className="sep">·</span>
            <span>Paris, France</span>
            <span className="sep">·</span>
            <span className="availability">shipping</span>
          </div>
        </div>
        <div className="clock" aria-live="polite">
          <div className="t">
            {clock ? (
              <>
                {clock.hh}:{clock.mm}
                <span className="sec">:{clock.ss}</span>
              </>
            ) : (
              <>&nbsp;</>
            )}
          </div>
          <div className="lbl">{clock ? `${clock.date} · ${clock.tz}` : ' '}</div>
        </div>
      </header>

      <p className="intro">
        I build small,&nbsp;<em>focused</em> products. A lot of small things rather than one big thing.
      </p>
      <p className="intro-sub">
        Desktop tools, developer ergonomics, quiet web things. Keyboard-first when it matters, boring tech, considered
        defaults. Below is everything I&apos;m currently shipping. Pick one.
      </p>

      <section className="workspace" aria-label="Projects">
        <aside className="side">
          <div className="pane-hd">
            <span className="corner">┌─</span>
            <span className="nm">shipped/</span>
            <span className="rest"></span>
            <span className="meta">{filtered.length} of {projects.length}</span>
          </div>

          <ul className="side-list" role="listbox" aria-activedescendant={`p-${current.id}`}>
            {filtered.map((p, i) => (
              <li
                key={p.id}
                id={`p-${p.id}`}
                className={'row' + (i === focusIdx ? ' focused' : '')}
                onClick={() => setFocusIdx(i)}
                onDoubleClick={() => p.href && window.open(p.href, '_blank', 'noopener')}
                role="option"
                aria-selected={i === focusIdx}
              >
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <span className={'st' + (p.status === 'beta' ? ' beta' : p.status === 'idea' ? ' idea' : p.status === 'archived' ? ' archived' : '')}></span>
                <span className="nm">{p.name}</span>
                <span className="tail">{p.tail}</span>
                <a
                  className="open"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${p.name}`}
                  onClick={(e) => e.stopPropagation()}
                >↗</a>
              </li>
            ))}
            {filtered.length === 0 && (
              <li style={{ padding: '16px 14px', color: 'var(--ink-3)', fontSize: 12 }}>
                <span style={{ color: 'var(--accent)' }}>!</span> no matches for &quot;{filter}&quot;
              </li>
            )}
          </ul>

          <div className="side-section">stats</div>
          <div className="stat-grid">
            <div>active <b>{projects.filter((p) => p.status === 'active').length}</b></div>
            <div>wip <b>{projects.filter((p) => p.status === 'wip').length}</b></div>
            <div>shipped <b>{projects.length}</b></div>
            <div>since <b>2019</b></div>
          </div>

          <div className="filter">
            <span className="caret">/</span>
            <input
              ref={filterRef}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="filter projects…"
              spellCheck={false}
              autoComplete="off"
            />
            <span className="hint"><kbd>/</kbd></span>
          </div>
        </aside>

        <section className="main" key={current.id}>
          <div className="pane-hd">
            <span className="corner">┌─</span>
            <span className="nm">./{current.id}</span>
            <span className="rest"></span>
            <span className="meta">{current.kind} · {current.statusLabel}</span>
          </div>

          <div className="main-body">
            <div className="main-head">
              <div style={{ minWidth: 0 }}>
                <h2 className="main-title">{current.name}</h2>
                <div className="main-repo">
                  ↗ <a href={current.href} target="_blank" rel="noopener noreferrer">{current.repo}</a>
                </div>
              </div>
              <div className="main-side">
                <div>
                  <b>{String(focusIdx + 1).padStart(2, '0')}</b>{' '}
                  <span style={{ color: 'var(--ink-4)' }}>/ {String(filtered.length).padStart(2, '0')}</span>
                </div>
                <a className="open-btn" href={current.href} target="_blank" rel="noopener noreferrer">open ↗</a>
              </div>
            </div>
            <div className="main-tag">
              <span style={{ color: 'var(--ink)' }}>{current.tag}</span>{' '}
              <span className="muted">{current.desc}</span>
            </div>

            <div className="preview" key={current.id}>
              <Preview />
            </div>

            <div className="stack">
              {current.chips.slice(0, 7).map((c, i) => (
                <span key={i} className={'chip' + (i === 0 ? ' solid' : '')}>{c}</span>
              ))}
              {current.chips.length > 7 && <span className="more">+{current.chips.length - 7} more</span>}
            </div>
          </div>
        </section>
      </section>

      <div className="statusbar">
        <span className="pill">FB</span>
        <span className="prompt">
          <span className="at">fberrez@desk:</span>~/<span style={{ color: 'var(--accent)' }}>{current.id}</span>${' '}
          <span className="cmd">open</span>
        </span>
        <span className="keys">
          <span><kbd>j</kbd><kbd>k</kbd> nav</span>
          <span><kbd>/</kbd> filter</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>g</kbd>/<kbd>G</kbd> top/end</span>
        </span>
      </div>
    </>
  );
}
