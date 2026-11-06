'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { CAPTURED, isBig, KEYS, typeKey, type Key } from '@domain/keyboard'
import { useConfig } from '@providers/ConfigProvider'

/** Estado do teclado na tela: teclas abaixadas, texto digitado e contagem. Escuta o teclado físico também. */
export function useKeyboard() {
  const { stroke } = useConfig()
  const [down, setDown] = useState<Set<string>>(() => new Set())
  const [text, setText] = useState('')
  const [count, setCount] = useState(0)
  const downRef = useRef(down)
  useEffect(() => {
    downRef.current = down
  }, [down])

  const press = useCallback(
    (key: Key, typed?: string) => {
      if (downRef.current.has(key.code)) return
      downRef.current = new Set(downRef.current).add(key.code)
      setDown(downRef.current)
      stroke(true, isBig(key))
      setCount((c) => c + 1)
      setText((t) => typeKey(t, key, typed))
    },
    [stroke],
  )

  const release = useCallback(
    (key: Key) => {
      if (!downRef.current.has(key.code)) return
      const next = new Set(downRef.current)
      next.delete(key.code)
      downRef.current = next
      setDown(next)
      stroke(false, isBig(key))
    },
    [stroke],
  )

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, input, textarea, a') && e.code !== 'Space')
        return
      if (target.closest('button, a') && e.code === 'Space') return
      if (e.metaKey || e.ctrlKey) return
      const key = KEYS.get(e.code)
      if (!key) return
      if (CAPTURED.has(e.code)) e.preventDefault()
      if (!e.repeat) press(key, e.key)
    }
    const onUp = (e: KeyboardEvent) => {
      const key = KEYS.get(e.code)
      if (key) release(key)
    }
    const releaseAll = () =>
      downRef.current.forEach((code) => release(KEYS.get(code)!))
    addEventListener('keydown', onDown)
    addEventListener('keyup', onUp)
    addEventListener('blur', releaseAll)
    return () => {
      removeEventListener('keydown', onDown)
      removeEventListener('keyup', onUp)
      removeEventListener('blur', releaseAll)
    }
  }, [press, release])

  return { down, text, count, press, release }
}

export type KeyboardState = ReturnType<typeof useKeyboard>
