// Each project becomes a full-viewport "act" that wears its own product's theme.
// Order is a day -> night -> day arc for cinematic contrast, not by status.
// `kicker` is the mono label, `headline` is the act's big line in the product's
// own voice, `scene` selects the CSS mini-scene, `theme` matches the .act--<id> class.
export const PROJECTS = [
  {
    id: 'mambo',
    name: 'mambo',
    status: 'live',
    statusLabel: 'Live',
    version: 'v0.7',
    act: 1,
    kicker: '01 / Database client',
    headline: 'Your data, the second you open it.',
    blurb:
      'A fast, native desktop client for PostgreSQL, MySQL and SQLite. Keyboard-driven, zero telemetry, about 38 MB. Open it, connect, and you are already looking at your data.',
    href: 'https://trymambo.app',
    domain: 'trymambo.app',
    scene: 'mambo',
    theme: 'mambo',
  },
  {
    id: 'foyer',
    name: 'foyer',
    status: 'live',
    statusLabel: 'Live',
    act: 2,
    kicker: '02 / Ambient sound',
    headline: 'Place a sound, and the room lights up around you.',
    blurb:
      'Ambient soundscapes you arrange in space. Drop a few sounds around you, set the mood, and let it play from your Mac’s notch. macOS.',
    href: 'https://usefoyer.app',
    domain: 'usefoyer.app',
    scene: 'foyer',
    theme: 'foyer',
  },
  {
    id: 'quietdash',
    name: 'quietdash',
    status: 'wip',
    statusLabel: 'In progress',
    act: 3,
    kicker: '03 / Ambient dashboard',
    headline: 'Only the numbers that matter, on calm paper.',
    blurb:
      'A calm e-ink dashboard for people who value focus. One screen, the few numbers worth watching, rendered like print rather than a glowing app.',
    href: 'https://quietdash.com',
    domain: 'quietdash.com',
    scene: 'quietdash',
    theme: 'quietdash',
  },
  {
    id: 'minihabits',
    name: 'minihabits',
    status: 'archived',
    statusLabel: 'Archived',
    act: 4,
    kicker: '04 / Habit system',
    headline: 'Momentum, not perfection.',
    blurb:
      'A calm habit tracker built around momentum instead of fragile streaks. Two tiers a day, show up or go full, and a strip that remembers the last thirty days. No accounts, no notifications.',
    href: 'https://minihabits.co',
    domain: 'minihabits.co',
    scene: 'minihabits',
    theme: 'minihabits',
  },
  {
    id: 'blurt',
    name: 'blurt.sh',
    status: 'live',
    statusLabel: 'Live',
    act: 5,
    kicker: '05 / Publishing',
    headline: 'Markdown in, posts everywhere.',
    blurb:
      'Own your social publishing. Write a post in markdown, or just send an email, and it goes live across every platform. Your posts stay files you own. No setup, no dashboard, no lock-in.',
    href: 'https://blurt.sh',
    domain: 'blurt.sh',
    scene: 'blurt',
    theme: 'blurt',
  },
];
