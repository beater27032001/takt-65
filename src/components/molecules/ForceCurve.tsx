'use client'

import { motion } from 'motion/react'

import { curvePoints, type Switch } from '@domain/keyboard'

const BOX = {
  width: 280,
  height: 150,
  left: 34,
  right: 10,
  top: 10,
  bottom: 24,
}

/** Curva de força do switch: curso (mm) × força (gf), sempre na mesma escala para comparar. */
export function ForceCurve({ sw }: { sw: Switch }) {
  const { x, y, points } = curvePoints(sw.curve, BOX)
  return (
    <svg
      viewBox={`0 0 ${BOX.width} ${BOX.height}`}
      role="img"
      aria-label={`Curva de força do switch ${sw.name}`}
      className="block h-auto w-full"
    >
      <g stroke="var(--line)" strokeWidth={1}>
        {[0, 40, 80].map((g) => (
          <line
            key={g}
            x1={BOX.left}
            x2={BOX.width - BOX.right}
            y1={y(g)}
            y2={y(g)}
          />
        ))}
      </g>
      <g className="font-mono" fontSize={9} fill="var(--muted)">
        {[0, 40, 80].map((g) => (
          <text key={g} x={BOX.left - 6} y={y(g) + 3} textAnchor="end">
            {g}
          </text>
        ))}
        {[0, 2, 4].map((m) => (
          <text key={m} x={x(m)} y={BOX.height - 8} textAnchor="middle">
            {m} mm
          </text>
        ))}
      </g>
      <motion.polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
      />
    </svg>
  )
}
