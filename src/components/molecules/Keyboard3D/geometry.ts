import { ExtrudeGeometry, Path, Shape, type BufferGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/** Folga entre teclas e quanto o topo é mais estreito que a base (perfil afunilado). */
export const GAP = 0.055
export const TOP_INSET = 0.11
const RADIUS = 0.09

const caps = new Map<string, BufferGeometry>()

/** Keycap: caixa arredondada com as laterais afunilando até o topo; a base fica em y = 0. */
export function capGeometry(width: number, height: number) {
  const id = `${width}:${height}`
  const cached = caps.get(id)
  if (cached) return cached
  const w = width - GAP
  const d = 1 - GAP
  let g: BufferGeometry = new RoundedBoxGeometry(w, height, d, 4, RADIUS)
  g.deleteAttribute('normal')
  g.deleteAttribute('uv')
  g = mergeVertices(g)
  const pos = g.getAttribute('position')
  const hw = w / 2
  const hd = d / 2
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) + height / 2) / height // 0 na base, 1 no topo
    pos.setX(i, pos.getX(i) * ((hw - TOP_INSET * t) / hw))
    pos.setZ(i, pos.getZ(i) * ((hd - TOP_INSET * t) / hd))
  }
  g.computeVertexNormals()
  g.translate(0, height / 2, 0)
  caps.set(id, g)
  return g
}

function roundedRect<T extends Path>(path: T, w: number, h: number, r: number) {
  const x = -w / 2
  const y = -h / 2
  path.moveTo(x + r, y)
  path.lineTo(x + w - r, y)
  path.quadraticCurveTo(x + w, y, x + w, y + r)
  path.lineTo(x + w, y + h - r)
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  path.lineTo(x + r, y + h)
  path.quadraticCurveTo(x, y + h, x, y + h - r)
  path.lineTo(x, y + r)
  path.quadraticCurveTo(x, y, x + r, y)
  return path
}

/** Moldura do case: retângulo arredondado com a abertura das teclas, chanfrado; a base fica em y = 0. */
export function caseFrame(
  outerW: number,
  outerD: number,
  holeW: number,
  holeD: number,
  height: number,
) {
  const shape = roundedRect(new Shape(), outerW, outerD, 0.42)
  shape.holes.push(roundedRect(new Path(), holeW, holeD, 0.08))
  const bevel = 0.06
  const g = new ExtrudeGeometry(shape, {
    depth: height - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 24,
  })
  g.rotateX(-Math.PI / 2)
  g.translate(0, bevel, 0)
  return g
}
