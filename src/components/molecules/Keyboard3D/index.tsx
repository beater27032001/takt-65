'use client'

import { useEffect, useState } from 'react'

import { motion } from 'motion/react'
import dynamic from 'next/dynamic'

import type { KeyboardState } from '@hooks/useKeyboard'
import { KeyboardCss } from '@molecules/KeyboardCss'
import { useConfig } from '@providers/ConfigProvider'

// three.js só no navegador, num pedaço separado do bundle
const Scene = dynamic(() => import('./Scene'), { ssr: false })

/** Avisa que a versão em CSS entrou no lugar do 3D, para o contêiner aparecer. */
function Shown({
  onShow,
  children,
}: {
  onShow: () => void
  children: React.ReactNode
}) {
  useEffect(onShow, [onShow])
  return children
}

/** Teclado em 3D; sem WebGL, cai para a versão em CSS. */
export function Keyboard({ kb }: { kb: KeyboardState }) {
  const { colorway } = useConfig()
  const [ready, setReady] = useState(false)
  return (
    <motion.div
      className="relative -mx-4 mt-6 aspect-[1.55/1] sm:mx-0 sm:aspect-[2.15/1]"
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 0.6 }}
    >
      <Scene
        colorway={colorway}
        down={kb.down}
        onPress={kb.press}
        onRelease={kb.release}
        onReady={() => setReady(true)}
        fallback={
          <Shown onShow={() => setReady(true)}>
            <KeyboardCss kb={kb} />
          </Shown>
        }
      />
    </motion.div>
  )
}
