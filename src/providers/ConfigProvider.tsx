'use client'

import { createContext, use, useCallback, useState } from 'react'

import {
  COLORWAYS,
  DEMO_RHYTHM,
  type Colorway,
  type SwitchId,
} from '@domain/keyboard'
import { KeySound } from '@services/KeySound'

interface Config {
  colorway: Colorway
  setColorway: (c: Colorway) => void
  switchId: SwitchId
  setSwitch: (id: SwitchId) => void
  soundOn: boolean
  toggleSound: () => void
  /** som de uma tecla com o switch atual (ou outro, se informado) */
  stroke: (down: boolean, big?: boolean, id?: SwitchId, delay?: number) => void
  /** demonstração de oito toques de um switch */
  demo: (id: SwitchId) => void
}

const ConfigContext = createContext<Config | null>(null)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [colorway, setColorway] = useState(COLORWAYS[0])
  const [switchId, setSwitchId] = useState<SwitchId>('tactile')
  const [soundOn, setSoundOn] = useState(true)
  const [sound] = useState(() => new KeySound())

  const stroke = useCallback(
    (down: boolean, big = false, id?: SwitchId, delay = 0) => {
      if (soundOn) sound.stroke(id ?? switchId, down, big, delay)
    },
    [sound, soundOn, switchId],
  )

  const value: Config = {
    colorway,
    setColorway: (c) => {
      setColorway(c)
      stroke(false, false, 'clicky')
    },
    switchId,
    setSwitch: (id) => {
      setSwitchId(id)
      if (soundOn) sound.stroke(id, true)
    },
    soundOn,
    toggleSound: () => setSoundOn((on) => !on),
    stroke,
    demo: (id) =>
      DEMO_RHYTHM.forEach((t, i) => {
        stroke(true, i === 4, id, t)
        stroke(false, i === 4, id, t + 0.07)
      }),
  }

  // as cores das teclas viram variáveis CSS lidas pela página toda
  const style = {
    '--cap-alpha': colorway.alpha,
    '--cap-alpha-text': colorway.alphaText,
    '--cap-mod': colorway.mod,
    '--cap-mod-text': colorway.modText,
    '--cap-accent': colorway.accent,
    '--cap-accent-text': colorway.accentText,
    '--case': colorway.case,
  } as React.CSSProperties

  return (
    <ConfigContext value={value}>
      <div style={style}>{children}</div>
    </ConfigContext>
  )
}

export const useConfig = () => use(ConfigContext)!
