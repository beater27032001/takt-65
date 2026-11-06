'use client'

import { useState } from 'react'
import { useRef } from 'react'

import { motion, useInView } from 'motion/react'

import { EASE } from '@constants/motion'
import { LAYERS } from '@domain/keyboard'
import { cn } from '@lib/utils'
import { SectionTitle } from '@molecules/SectionTitle'
import { useConfig } from '@providers/ConfigProvider'

const SWITCH_LAYER = 4
const OPEN = { desktop: 56, mobile: 40 }

export function Layers() {
  const { stroke } = useConfig()
  const stage = useRef<HTMLDivElement>(null)
  const inView = useInView(stage, { once: true, amount: 0.5 })
  const [assembled, setAssembled] = useState(false)
  const [focus, setFocus] = useState<number | null>(null)
  // explode sozinho na primeira vez que aparece; depois o botão manda
  const open = inView && !assembled

  return (
    <section className="border-t border-line py-20 md:py-24">
      <div className="wrap grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <motion.div
            ref={stage}
            aria-hidden
            className="layers-stage relative h-[340px] [perspective:1100px] md:h-[420px]"
            initial={{ '--gap': '9px' } as never}
            animate={{ '--gap': open ? `var(--open)` : '9px' } as never}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ '--open': `${OPEN.mobile}px` } as React.CSSProperties}
          >
            {LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                className={cn('layer', focus === i && 'is-focus')}
                style={
                  {
                    '--i': i - 2.5,
                    background:
                      i === SWITCH_LAYER
                        ? 'repeating-linear-gradient(90deg,#e8572a 0 18px,transparent 18px 26px)'
                        : layer.color,
                  } as React.CSSProperties
                }
              />
            ))}
          </motion.div>
          <button
            onClick={() => {
              setAssembled(open)
              stroke(true)
              stroke(false, false, undefined, 0.08)
            }}
            className="relative z-10 mt-6 rounded-full border border-fg bg-bg px-4 py-2 font-mono text-xs transition-colors hover:bg-fg hover:text-bg"
          >
            {open ? 'Montar camadas' : 'Separar camadas'}
          </button>
        </div>
        <div>
          <SectionTitle>Seis camadas até a mesa</SectionTitle>
          <ul className="m-0 flex list-none flex-col-reverse border-t border-line p-0">
            {LAYERS.map((layer, i) => (
              <li
                key={layer.name}
                onPointerEnter={() => setFocus(i)}
                onPointerLeave={() => setFocus(null)}
                className={cn(
                  'grid grid-cols-[28px_1fr] gap-2.5 border-b border-line py-3 transition-colors',
                  focus === i && 'text-accent',
                )}
              >
                <i
                  className="mt-1 block size-4 rounded shadow-[inset_0_0_0_1px_rgb(0_0_0/.15)]"
                  style={{
                    background: i === SWITCH_LAYER ? '#e8572a' : layer.color,
                  }}
                />
                <div>
                  <b className="block">{layer.name}</b>
                  <span className="text-sm text-muted">{layer.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
