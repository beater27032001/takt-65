'use client'

import { motion } from 'motion/react'

import { EASE } from '@constants/motion'
import { useKeyboard } from '@hooks/useKeyboard'
import { Controls } from '@molecules/Controls'
import { Keyboard } from '@molecules/Keyboard'

export function Hero() {
  const kb = useKeyboard()
  return (
    <header className="pt-7 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="m-0 font-mono text-xs tracking-[.12em] text-muted uppercase">
            Teclado mecânico 65% · gasket mount
          </p>
          <h1 className="m-0 mt-[.12em] overflow-hidden font-display text-[clamp(56px,13vw,168px)] leading-[.82] font-black tracking-[-.02em] wide">
            <motion.span
              className="block pb-[.04em]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              TAKT 65
            </motion.span>
          </h1>
        </div>
        <motion.p
          className="m-0 max-w-[38ch] text-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          Clique nas teclas ou digite no seu teclado. Troque o switch e ouça a
          diferença antes de comprar.
        </motion.p>
      </div>
      <Keyboard kb={kb} />
      <Controls kb={kb} />
    </header>
  )
}
