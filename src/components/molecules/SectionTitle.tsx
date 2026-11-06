'use client'

import { motion } from 'motion/react'

import { EASE } from '@constants/motion'

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      className="m-0 mt-[.2em] mb-[.6em] overflow-hidden font-display text-[clamp(36px,5.4vw,64px)] leading-[.95] font-extrabold tracking-[-.01em] text-balance [font-stretch:112%]"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.span
        className="block pb-[.05em]"
        variants={{ hidden: { y: '100%' }, show: { y: 0 } }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.h2>
  )
}
