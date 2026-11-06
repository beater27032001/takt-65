'use client'

import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react'

import { Keycap } from '@atoms/Keycap'
import { columns, ROWS } from '@domain/keyboard'
import type { KeyboardState } from '@hooks/useKeyboard'

const TILT = { stiffness: 140, damping: 18 }

export function Keyboard({ kb }: { kb: KeyboardState }) {
  const reduced = useReducedMotion()
  const tiltX = useSpring(0, TILT)
  const tiltY = useSpring(0, TILT)
  // inclinação base de mesa, mais um pouco seguindo o ponteiro
  const rotateX = useTransform(tiltY, (v) => 14 - v * 6)
  const rotateY = useTransform(tiltX, (v) => v * 6)

  return (
    <div
      className="mt-9 [perspective:1400px]"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        tiltX.set((e.clientX - r.left) / r.width - 0.5)
        tiltY.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        tiltX.set(0)
        tiltY.set(0)
      }}
    >
      <motion.div
        className="board origin-bottom rounded-[18px] p-[clamp(8px,1.8vw,20px)]"
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {ROWS.map((row, r) => {
          let col = 0
          return (
            <div key={r} className="grid grid-cols-[repeat(64,minmax(0,1fr))]">
              {row.map((key) => {
                const wave = r + col / 4
                col += columns(key)
                return (
                  <Keycap
                    key={key.code}
                    keyDef={key}
                    down={kb.down.has(key.code)}
                    wave={wave}
                    onPress={() => kb.press(key)}
                    onRelease={() => kb.release(key)}
                  />
                )
              })}
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
