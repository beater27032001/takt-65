'use client'

import { motion } from 'motion/react'

import { EASE } from '@constants/motion'
import { SPECS } from '@domain/keyboard'
import { SectionTitle } from '@molecules/SectionTitle'

export function Specs() {
  return (
    <section className="border-t border-line py-20 md:py-24">
      <div className="wrap">
        <SectionTitle>Ficha técnica</SectionTitle>
        <motion.dl
          className="m-0 grid gap-x-12 md:grid-cols-2"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {SPECS.map(([term, value]) => (
            <motion.div
              key={term}
              className="flex justify-between gap-4 border-b border-line py-3.5"
              variants={{
                hidden: { opacity: 0, x: -12 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, ease: EASE },
                },
              }}
            >
              <dt className="text-muted">{term}</dt>
              <dd className="m-0 text-right font-mono font-medium">{value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
