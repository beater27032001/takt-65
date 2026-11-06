'use client'

import { COLORWAYS, SWITCHES } from '@domain/keyboard'
import type { KeyboardState } from '@hooks/useKeyboard'
import { cn } from '@lib/utils'
import { useConfig } from '@providers/ConfigProvider'

const LABEL = 'mb-2 font-mono text-[11px] tracking-[.12em] text-muted uppercase'

export function Controls({ kb }: { kb: KeyboardState }) {
  const cfg = useConfig()
  return (
    <div className="mt-9 flex flex-wrap items-start gap-x-9 gap-y-5">
      <div>
        <div className={LABEL}>Cor</div>
        <div className="flex gap-2">
          {COLORWAYS.map((c) => (
            <button
              key={c.name}
              aria-label={c.name}
              title={c.name}
              aria-pressed={cfg.colorway.name === c.name}
              onClick={() => cfg.setColorway(c)}
              className="grid size-11 grid-cols-2 overflow-hidden rounded-[10px] border-2 border-transparent p-0 transition-transform hover:-translate-y-0.5 aria-pressed:border-fg"
            >
              <i style={{ background: c.alpha }} />
              <i style={{ background: c.mod }} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className={LABEL}>Switch</div>
        <div
          role="group"
          aria-label="Switch"
          className="inline-flex rounded-full border border-line bg-surface p-[3px]"
        >
          {SWITCHES.map((s) => (
            <button
              key={s.id}
              aria-pressed={cfg.switchId === s.id}
              onClick={() => cfg.setSwitch(s.id)}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm transition-colors',
                cfg.switchId === s.id ? 'bg-fg text-bg' : 'hover:text-accent',
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <div className="min-w-0 flex-[1_1_300px]">
        <div className={LABEL}>Teste</div>
        <div
          aria-live="polite"
          className="flex min-h-12 items-center justify-end overflow-hidden rounded-[10px] border border-line bg-surface px-3.5 py-3 font-mono text-[15px] whitespace-pre"
        >
          <span className="min-w-0 overflow-hidden">
            {kb.text ? (
              kb.text
            ) : (
              <span className="text-muted">digite algo…</span>
            )}
          </span>
          <i
            aria-hidden
            className="ml-0.5 inline-block h-[1.1em] w-2 flex-none animate-[blink_1s_steps(1)_infinite] bg-accent"
          />
          <span className="flex-1" />
        </div>
        <div className="mt-1.5 font-mono text-[11px] text-muted tabular-nums">
          {kb.count.toLocaleString('pt-BR')} teclas pressionadas
        </div>
      </div>
    </div>
  )
}
