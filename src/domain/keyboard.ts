// Teclado 65%: grade de 64 colunas por linha (1u = 4 colunas).
export type KeyTone = 'alpha' | 'mod' | 'accent'

export interface Key {
  code: string
  label: string
  /** largura em unidades (1u = uma tecla comum) */
  width: number
  tone: KeyTone
}

const k = (
  code: string,
  label: string,
  width = 1,
  tone: KeyTone = 'alpha',
): Key => ({ code, label, width, tone })
const letters = (s: string) => [...s].map((ch) => k(`Key${ch}`, ch))

export const ROWS: Key[][] = [
  [
    k('Escape', 'Esc', 1, 'accent'),
    ...[...'1234567890'].map((d) => k(`Digit${d}`, d)),
    k('Minus', '-'),
    k('Equal', '='),
    k('Backspace', '⌫', 2, 'mod'),
    k('Delete', 'Del', 1, 'mod'),
  ],
  [
    k('Tab', 'Tab', 1.5, 'mod'),
    ...letters('QWERTYUIOP'),
    k('BracketLeft', '['),
    k('BracketRight', ']'),
    k('Backslash', '\\', 1.5, 'mod'),
    k('PageUp', 'PgUp', 1, 'mod'),
  ],
  [
    k('CapsLock', 'Caps', 1.75, 'mod'),
    ...letters('ASDFGHJKL'),
    k('Semicolon', 'Ç'),
    k('Quote', '~'),
    k('Enter', 'Enter', 2.25, 'accent'),
    k('PageDown', 'PgDn', 1, 'mod'),
  ],
  [
    k('ShiftLeft', 'Shift', 2.25, 'mod'),
    ...letters('ZXCVBNM'),
    k('Comma', ','),
    k('Period', '.'),
    k('Slash', ';'),
    k('ShiftRight', 'Shift', 1.75, 'mod'),
    k('ArrowUp', '↑', 1, 'mod'),
    k('End', 'End', 1, 'mod'),
  ],
  [
    k('ControlLeft', 'Ctrl', 1.25, 'mod'),
    k('MetaLeft', 'Win', 1.25, 'mod'),
    k('AltLeft', 'Alt', 1.25, 'mod'),
    k('Space', '', 6.25),
    k('AltRight', 'Alt', 1, 'mod'),
    k('Fn', 'Fn', 1, 'mod'),
    k('ControlRight', 'Ctrl', 1, 'mod'),
    k('ArrowLeft', '←', 1, 'mod'),
    k('ArrowDown', '↓', 1, 'mod'),
    k('ArrowRight', '→', 1, 'mod'),
  ],
]

export const KEY_COUNT = ROWS.flat().length
export const KEYS = new Map(ROWS.flat().map((key) => [key.code, key]))
export const columns = (key: Key) => Math.round(key.width * 4)
/** teclas largas soam mais graves (o estabilizador muda o som) */
export const isBig = (key: Key) => key.width >= 2

/** Teclas que o navegador usaria para rolar ou navegar: a página toma conta delas. */
export const CAPTURED = new Set([
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Backspace',
  'Quote',
  'Slash',
  'End',
])

const MAX_TEXT = 120

/**
 * O que aparece na tela de teste depois de uma tecla.
 * `typed` é o caractere vindo do teclado físico (event.key); no clique ele não existe e vale o rótulo.
 */
export function typeKey(text: string, key: Key, typed?: string): string {
  let next = text
  if (key.code === 'Backspace') next = text.slice(0, -1)
  else if (key.code === 'Enter') next = `${text} ↵ `
  else if (typed && typed.length === 1) next = text + typed
  else if (key.code === 'Space') next = `${text} `
  else if (!typed && key.label.length === 1 && key.tone === 'alpha')
    next = text + key.label.toLowerCase()
  return next.slice(-MAX_TEXT)
}

export interface Colorway {
  name: string
  alpha: string
  alphaText: string
  mod: string
  modText: string
  accent: string
  accentText: string
  case: string
}

export const COLORWAYS: Colorway[] = [
  {
    name: 'Grafite',
    alpha: '#2b2e33',
    alphaText: '#d9dde3',
    mod: '#1a1c20',
    modText: '#9aa1ab',
    accent: '#e8572a',
    accentText: '#16181b',
    case: '#3a3e45',
  },
  {
    name: 'Menta',
    alpha: '#eef1ec',
    alphaText: '#2a3a33',
    mod: '#a9cbb9',
    modText: '#1e2d27',
    accent: '#2f6f57',
    accentText: '#eef1ec',
    case: '#cfd6cf',
  },
  {
    name: 'Sinal',
    alpha: '#f2f2f0',
    alphaText: '#111111',
    mod: '#111215',
    modText: '#f2f2f0',
    accent: '#ffb000',
    accentText: '#111111',
    case: '#1d1f23',
  },
  {
    name: 'Glacial',
    alpha: '#dfe9f5',
    alphaText: '#22344d',
    mod: '#8fb3dd',
    modText: '#0f1d30',
    accent: '#ff6b8b',
    accentText: '#ffffff',
    case: '#b5c6da',
  },
]

export type SwitchId = 'linear' | 'tactile' | 'clicky'

export interface Switch {
  id: SwitchId
  name: string
  text: string
  actuation: string
  travel: string
  /** curva de força: [curso em mm, força em gf] */
  curve: [number, number][]
}

export const SWITCHES: Switch[] = [
  {
    id: 'linear',
    name: 'Linear',
    text: 'Curso liso do topo ao fundo. Silencioso e rápido para jogos.',
    actuation: '45 gf',
    travel: '4,0 mm',
    curve: [
      [0, 0],
      [0.1, 35],
      [2, 45],
      [3.6, 55],
      [3.75, 80],
    ],
  },
  {
    id: 'tactile',
    name: 'Tátil',
    text: 'Um degrau no meio do curso avisa que a tecla registrou.',
    actuation: '55 gf',
    travel: '4,0 mm',
    curve: [
      [0, 0],
      [0.1, 30],
      [0.9, 62],
      [1.2, 40],
      [2, 44],
      [3.6, 56],
      [3.75, 80],
    ],
  },
  {
    id: 'clicky',
    name: 'Clicky',
    text: 'Degrau com clique audível. O som que todo mundo associa a teclado mecânico.',
    actuation: '60 gf',
    travel: '4,0 mm',
    curve: [
      [0, 0],
      [0.1, 32],
      [1.4, 66],
      [1.55, 38],
      [2.2, 46],
      [3.6, 57],
      [3.75, 80],
    ],
  },
]
export const switchById = (id: SwitchId) => SWITCHES.find((s) => s.id === id)!

/** Converte a curva para pontos de um gráfico (0–4 mm × 0–80 gf). */
export function curvePoints(
  curve: [number, number][],
  box: {
    width: number
    height: number
    left: number
    right: number
    top: number
    bottom: number
  },
) {
  const x = (mm: number) =>
    box.left + (mm / 4) * (box.width - box.left - box.right)
  const y = (gf: number) =>
    box.height - box.bottom - (gf / 80) * (box.height - box.top - box.bottom)
  return {
    x,
    y,
    points: curve
      .map(([mm, gf]) => `${x(mm).toFixed(1)},${y(gf).toFixed(1)}`)
      .join(' '),
  }
}

/** Um som de tecla é feito de ruído filtrado e um tom curto que cai de frequência. */
export type Sound =
  | {
      kind: 'noise'
      at: number
      freq: number
      q: number
      gain: number
      length: number
      filter: 'bandpass' | 'lowpass'
    }
  | { kind: 'tone'; at: number; freq: number; gain: number; length: number }

/** Receita do som de um switch. `variation` (≈ 0,92–1,08) deixa cada toque um pouco diferente. */
export function soundRecipe(
  id: SwitchId,
  down: boolean,
  big: boolean,
  variation = 1,
): Sound[] {
  const v = variation
  const low = big ? 0.7 : 1
  if (!down)
    return id === 'clicky'
      ? [
          {
            kind: 'noise',
            at: 0,
            freq: 3800 * v,
            q: 7,
            gain: 0.42,
            length: 0.012,
            filter: 'bandpass',
          },
        ]
      : [
          {
            kind: 'noise',
            at: 0,
            freq: 1100 * v,
            q: 1,
            gain: 0.12,
            length: 0.025,
            filter: 'bandpass',
          },
        ]
  if (id === 'clicky')
    return [
      {
        kind: 'noise',
        at: 0,
        freq: 4200 * v,
        q: 7,
        gain: 0.55,
        length: 0.016,
        filter: 'bandpass',
      },
      {
        kind: 'noise',
        at: 0.006,
        freq: 900 * v * low,
        q: 0.7,
        gain: 0.3,
        length: 0.045,
        filter: 'lowpass',
      },
      { kind: 'tone', at: 0.006, freq: 170 * v * low, gain: 0.2, length: 0.05 },
    ]
  if (id === 'tactile')
    return [
      {
        kind: 'noise',
        at: 0,
        freq: 1900 * v,
        q: 2.2,
        gain: 0.22,
        length: 0.02,
        filter: 'bandpass',
      },
      {
        kind: 'noise',
        at: 0.004,
        freq: 820 * v * low,
        q: 0.7,
        gain: 0.5,
        length: 0.055,
        filter: 'lowpass',
      },
      {
        kind: 'tone',
        at: 0.004,
        freq: 140 * v * low,
        gain: 0.36,
        length: 0.075,
      },
    ]
  return [
    {
      kind: 'noise',
      at: 0,
      freq: 780 * v * low,
      q: 0.7,
      gain: 0.55,
      length: 0.06,
      filter: 'lowpass',
    },
    { kind: 'tone', at: 0, freq: 125 * v * low, gain: 0.4, length: 0.085 },
  ]
}

/** Ritmo da demonstração "Ouvir": instantes de cada toque, a quinta tecla é a barra de espaço. */
export const DEMO_RHYTHM = [0, 0.14, 0.27, 0.36, 0.52, 0.63, 0.78, 0.88]

export interface Layer {
  name: string
  text: string
  color: string
}

export const LAYERS: Layer[] = [
  {
    name: 'Case de alumínio',
    text: 'Usinado em CNC, 1,1 kg só na carcaça.',
    color: 'var(--case)',
  },
  {
    name: 'Espuma e gaskets',
    text: 'Poron na base e 12 tiras de silicone.',
    color: '#d6c9a8',
  },
  {
    name: 'PCB hot-swap',
    text: 'Troque switches sem solda.',
    color: '#1f6b4f',
  },
  {
    name: 'Placa de policarbonato',
    text: 'Flexível, deixa o som mais grave.',
    color: 'rgb(210 225 240 / .85)',
  },
  { name: 'Switches', text: 'Linear, tátil ou clicky.', color: '#e8572a' },
  {
    name: 'Keycaps PBT',
    text: 'Legendas double-shot, não desbotam.',
    color: 'var(--cap-alpha)',
  },
]

export const SPECS: [string, string][] = [
  ['Layout', '65% · 68 teclas'],
  ['Montagem', 'Gasket, 12 pontos'],
  ['Hot-swap', '3 e 5 pinos'],
  ['Polling', '8.000 Hz com fio'],
  ['Conexão', 'USB-C · 2,4 GHz · BT 5.3'],
  ['Bateria', '4.000 mAh'],
  ['Case', 'Alumínio 6063 CNC'],
  ['Peso', '1,6 kg'],
]

export const PRICE = 1290
