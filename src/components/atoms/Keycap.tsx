'use client'

import { columns, type Key } from '@domain/keyboard'
import { cn } from '@lib/utils'

const TONE = {
  alpha: 'cap-alpha',
  mod: 'cap-mod',
  accent: 'cap-accent',
} as const

interface Props {
  keyDef: Key
  down: boolean
  /** posição na diagonal, para a cascata de entrada */
  wave: number
  onPress: () => void
  onRelease: () => void
}

export function Keycap({ keyDef, down, wave, onPress, onRelease }: Props) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={keyDef.label || 'Espaço'}
      aria-pressed={down}
      className="key"
      style={{ gridColumn: `span ${columns(keyDef)}` }}
      onPointerDown={(e) => {
        e.preventDefault()
        onPress()
      }}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      onPointerCancel={onRelease}
    >
      <span
        className={cn('cap', TONE[keyDef.tone], down && 'is-down')}
        style={{ animationDelay: `${0.25 + wave * 0.018}s` }}
      >
        {keyDef.label}
      </span>
    </button>
  )
}
