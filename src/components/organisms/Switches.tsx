'use client'

import { Play } from 'lucide-react'
import { motion } from 'motion/react'

import { EASE } from '@constants/motion'
import { SWITCHES } from '@domain/keyboard'
import { ForceCurve } from '@molecules/ForceCurve'
import { SectionTitle } from '@molecules/SectionTitle'
import { useConfig } from '@providers/ConfigProvider'

export function Switches() {
  const { demo, switchId, setSwitch } = useConfig()
  return (
    <section className="border-t border-line py-20 md:py-24">
      <div className="wrap">
        <SectionTitle>Três sensações, uma placa hot-swap</SectionTitle>
        <motion.div
          className="grid gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
        >
          {SWITCHES.map((sw) => (
            <motion.article
              key={sw.id}
              className="flex min-w-0 flex-col gap-3 rounded-[14px] border border-line bg-surface p-[22px] transition-colors aria-[current=true]:border-accent"
              aria-current={switchId === sw.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: EASE },
                },
              }}
            >
              <h3 className="m-0 font-display text-[26px] font-extrabold [font-stretch:112%]">
                {sw.name}
              </h3>
              <p className="m-0 text-[15px] text-muted">{sw.text}</p>
              <ForceCurve sw={sw} />
              <div className="flex gap-4 font-mono text-xs text-muted">
                <span>
                  Atuação{' '}
                  <b className="font-semibold text-fg">{sw.actuation}</b>
                </span>
                <span>
                  Curso <b className="font-semibold text-fg">{sw.travel}</b>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => demo(sw.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-fg px-4 py-2 font-mono text-xs transition-colors hover:bg-fg hover:text-bg"
                >
                  <Play aria-hidden className="size-3" fill="currentColor" />
                  Ouvir {sw.name.toLowerCase()}
                </button>
                {switchId !== sw.id && (
                  <button
                    onClick={() => setSwitch(sw.id)}
                    className="rounded-full px-3 py-2 font-mono text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
                  >
                    Usar este
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
