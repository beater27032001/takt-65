'use client'

import { useEffect, useRef, useState } from 'react'

import { Check, ShoppingBag } from 'lucide-react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'motion/react'

import { EASE } from '@constants/motion'
import { PRICE, switchById } from '@domain/keyboard'
import { useConfig } from '@providers/ConfigProvider'

const brl = (v: number) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`

export function Buy() {
  const { colorway, switchId, stroke } = useConfig()
  const [added, setAdded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const price = useMotionValue(0)
  const text = useTransform(price, brl)

  useEffect(() => {
    if (!inView) return
    const controls = animate(price, PRICE, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [inView, price])

  return (
    <section className="border-t border-line py-20 md:py-24">
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div ref={ref}>
          <p className="m-0 mb-3 font-mono text-xs tracking-[.12em] text-muted uppercase">
            Sua configuração
          </p>
          <motion.div
            aria-label={brl(PRICE)}
            className="font-display text-[clamp(54px,9vw,112px)] leading-[.85] font-black wide tabular-nums"
          >
            {text}
          </motion.div>
          <div className="mt-2.5 flex items-center gap-2 font-mono text-[13px] text-muted">
            <span
              aria-hidden
              className="inline-grid size-4 grid-cols-2 overflow-hidden rounded-sm"
            >
              <i style={{ background: colorway.alpha }} />
              <i style={{ background: colorway.mod }} />
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${colorway.name}-${switchId}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                TAKT 65 · {colorway.name} · {switchById(switchId).name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <motion.button
          onClick={() => {
            setAdded(true)
            stroke(true, false, 'clicky')
          }}
          disabled={added}
          whileHover={added ? undefined : { scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex min-w-[260px] items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-7 py-4 font-bold text-[#111]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'ok' : 'buy'}
              className="inline-flex items-center gap-2"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {added ? (
                <Check aria-hidden className="size-5" />
              ) : (
                <ShoppingBag aria-hidden className="size-5" />
              )}
              {added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </section>
  )
}
