// The product table on the home page. Order is the order they get read in:
// shipping things first, then what is being built, then what was retired.
//
// `state` drives both the word and its mark — 'live' gets a filled square,
// 'wip' a hollow one, 'archived' neither. `version` is the right-hand column;
// for products that do not version publicly it carries the platform or the
// year instead, so the column is never empty.
export const PROJECTS = [
  {
    id: 'mambo',
    name: 'mambo',
    desc: 'Database client, native, keyboard-driven',
    state: 'live',
    stateLabel: 'Live',
    version: 'v0.7',
    href: 'https://trymambo.app',
    domain: 'trymambo.app',
  },
  {
    id: 'foyer',
    name: 'foyer',
    desc: 'Ambient sound you arrange in space',
    state: 'live',
    stateLabel: 'Live',
    version: 'macOS',
    href: 'https://usefoyer.app',
    domain: 'usefoyer.app',
  },
  {
    id: 'quietdash',
    name: 'quietdash',
    desc: 'An e-ink dashboard that reads like print',
    state: 'wip',
    stateLabel: 'Building',
    version: '—',
    href: 'https://quietdash.com',
    domain: 'quietdash.com',
  },
  {
    id: 'blurt',
    name: 'blurt.sh',
    desc: 'Markdown in, posts everywhere',
    state: 'live',
    stateLabel: 'Live',
    version: '—',
    href: 'https://blurt.sh',
    domain: 'blurt.sh',
  },
  {
    id: 'minihabits',
    name: 'minihabits',
    desc: 'Habits built on momentum, not streaks',
    state: 'archived',
    stateLabel: 'Archived',
    version: '2025',
    href: 'https://minihabits.co',
    domain: 'minihabits.co',
  },
];
