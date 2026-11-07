import { CanvasTexture } from 'three'

import type { Key } from '@domain/keyboard'

const PX = 128

/**
 * Legenda de uma tecla como máscara (branco sobre preto): o material pinta na cor da legenda,
 * então trocar de cor não exige redesenhar.
 */
export function legendTexture(
  key: Key,
  topWidth: number,
  topDepth: number,
  family: string,
) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(PX * (topWidth / topDepth))
  canvas.height = PX
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#fff'
  ctx.textBaseline = 'top'
  const size = key.tone === 'alpha' && key.label.length === 1 ? 54 : 34
  ctx.font = `500 ${size}px ${family}`
  ctx.fillText(key.label, 16, 14)
  const texture = new CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}
