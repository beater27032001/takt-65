// Rode com: npm run check
import assert from 'node:assert/strict'

import {
  columns,
  curvePoints,
  KEY_COUNT,
  KEYS,
  ROWS,
  soundRecipe,
  SPECS,
  SWITCHES,
  typeKey,
} from './keyboard.ts'

assert.equal(KEY_COUNT, 68, 'a ficha técnica diz 68 teclas')
assert.ok(SPECS[0][1].includes(String(KEY_COUNT)))
for (const row of ROWS)
  assert.equal(
    row.reduce((sum, key) => sum + columns(key), 0),
    64,
    'toda linha fecha as 64 colunas',
  )

const a = KEYS.get('KeyA')!
assert.equal(typeKey('', a), 'a', 'clique digita o rótulo em minúscula')
assert.equal(
  typeKey('', a, 'A'),
  'A',
  'teclado físico vale o caractere digitado',
)
assert.equal(typeKey('ab', KEYS.get('Backspace')!), 'a')
assert.equal(typeKey('a', KEYS.get('Space')!), 'a ')
assert.equal(typeKey('a', KEYS.get('Enter')!), 'a ↵ ')
assert.equal(
  typeKey('a', KEYS.get('ShiftLeft')!),
  'a',
  'modificador não escreve',
)
assert.equal(
  typeKey('x'.repeat(120), a).length,
  120,
  'a tela guarda só o final',
)

const linear = soundRecipe('linear', true, false)
const clicky = soundRecipe('clicky', true, false)
assert.ok(
  clicky.some((s) => s.freq > 4000),
  'clicky tem o clique agudo',
)
assert.ok(
  linear.every((s) => s.freq < 1000),
  'linear é só grave',
)
const bigTone = soundRecipe('tactile', true, true).find(
  (s) => s.kind === 'tone',
)!
const smallTone = soundRecipe('tactile', true, false).find(
  (s) => s.kind === 'tone',
)!
assert.ok(bigTone.freq < smallTone.freq, 'tecla larga soa mais grave')

const box = {
  width: 280,
  height: 150,
  left: 34,
  right: 10,
  top: 10,
  bottom: 24,
}
const { x, y } = curvePoints(SWITCHES[0].curve, box)
assert.equal(x(0), 34)
assert.equal(x(4), 270)
assert.equal(y(0), 126)
assert.equal(y(80), 10)
console.log('keyboard ok')
