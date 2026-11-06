'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'motion/react'

import { EASE } from '@constants/motion'
import { useConfig } from '@providers/ConfigProvider'

export function Nav() {
  const { soundOn, toggleSound } = useConfig()
  const Icon = soundOn ? Volume2 : VolumeX
  return (
    <motion.nav
      className="flex items-center justify-between gap-3 py-[18px]"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className="font-display text-xl font-black tracking-[.02em] wide">
        TAKT<span className="text-accent">.</span>
      </span>
      <button
        aria-pressed={soundOn}
        onClick={toggleSound}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-mono text-xs transition-colors hover:border-fg"
      >
        <Icon aria-hidden className="size-4" />
        {soundOn ? 'Som ligado' : 'Som desligado'}
      </button>
    </motion.nav>
  )
}
