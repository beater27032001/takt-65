'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'motion/react'
import {
  Color,
  type Group,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  type Texture,
} from 'three'

import {
  BOARD_DEPTH,
  BOARD_WIDTH,
  layoutKeys,
  type Colorway,
  type Key,
  type KeyTone,
} from '@domain/keyboard'

import { capGeometry, caseFrame, GAP, TOP_INSET } from './geometry'
import { legendTexture } from './legends'

export interface SceneProps {
  colorway: Colorway
  down: Set<string>
  onPress: (key: Key) => void
  onRelease: (key: Key) => void
}

/** Perfil esculpido por fileira, como keycaps Cherry: altura e inclinação do topo. */
const PROFILE = [
  { height: 0.6, tilt: 0.14 },
  { height: 0.54, tilt: 0.07 },
  { height: 0.5, tilt: 0 },
  { height: 0.54, tilt: -0.07 },
  { height: 0.56, tilt: -0.1 },
]
const TRAVEL = 0.15
const BEZEL = 0.46
const CAP_BASE = -0.12
const FOV = 26
const ELEVATION = (40 * Math.PI) / 180
/** caixa que precisa caber na tela: teclado com o case */
const FIT_WIDTH = BOARD_WIDTH + BEZEL * 2
const FIT_DEPTH = BOARD_DEPTH + BEZEL * 2
const THICKNESS = 1.3
/** a frente fica mais perto da câmera e parece maior: folga de perspectiva */
const MARGIN = 1.14

const PLACED = layoutKeys()

function useMonoFamily() {
  const [family, setFamily] = useState<string | null>(null)
  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-plex-mono')
      .trim()
    const name = value || 'monospace'
    document.fonts.load(`500 40px ${name}`).finally(() => setFamily(name))
  }, [])
  return family
}

function Keyboard({ colorway, down, onPress, onRelease }: SceneProps) {
  const reduced = useReducedMotion()
  const family = useMonoFamily()
  const root = useRef<Group>(null)
  const keys = useRef<(Group | null)[]>([])
  const offsets = useRef(PLACED.map(() => 0))
  const downRef = useRef(down)
  useEffect(() => {
    downRef.current = down
  }, [down])
  const pointerKey = useRef<Key | null>(null)
  const capMats = useRef<Partial<Record<KeyTone, MeshPhysicalMaterial>>>({})
  const legendMats = useRef<Partial<Record<KeyTone, MeshStandardMaterial[]>>>(
    {},
  )
  const caseMat = useRef<MeshPhysicalMaterial>(null)

  const target = useMemo(
    () => ({
      cap: {
        alpha: new Color(colorway.alpha),
        mod: new Color(colorway.mod),
        accent: new Color(colorway.accent),
      },
      legend: {
        alpha: new Color(colorway.alphaText),
        mod: new Color(colorway.modText),
        accent: new Color(colorway.accentText),
      },
      case: new Color(colorway.case),
    }),
    [colorway],
  )

  const frame = useMemo(
    () =>
      caseFrame(
        BOARD_WIDTH + BEZEL * 2,
        BOARD_DEPTH + BEZEL * 2,
        BOARD_WIDTH + 0.08,
        BOARD_DEPTH + 0.08,
        0.78,
      ),
    [],
  )

  const legends = useMemo(() => {
    if (!family) return null
    return PLACED.map(({ key }) =>
      key.label
        ? legendTexture(
            key,
            key.width - GAP - TOP_INSET * 2,
            1 - GAP - TOP_INSET * 2,
            family,
          )
        : null,
    )
  }, [family])
  useEffect(() => () => legends?.forEach((t) => t?.dispose()), [legends])

  // soltar a tecla mesmo se o dedo sair dela antes de levantar
  useEffect(() => {
    const up = () => {
      if (pointerKey.current) onRelease(pointerKey.current)
      pointerKey.current = null
    }
    addEventListener('pointerup', up)
    addEventListener('pointercancel', up)
    return () => {
      removeEventListener('pointerup', up)
      removeEventListener('pointercancel', up)
    }
  }, [onRelease])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    PLACED.forEach((placed, i) => {
      const group = keys.current[i]
      if (!group) return
      // entrada: as teclas caem em cascata diagonal
      const start = 0.3 + placed.wave * 0.035
      const enter = reduced ? 1 : Math.min(1, Math.max(0, (t - start) / 0.45))
      const drop = 1 - (1 - enter) ** 3 // desacelera ao encaixar
      const pressed = downRef.current.has(placed.key.code) ? -TRAVEL : 0
      offsets.current[i] += (pressed - offsets.current[i]) * 0.55
      group.position.y = CAP_BASE + offsets.current[i] + (1 - drop) * 1.4
      group.visible = enter > 0
    })

    // inclinação de digitação, mais um pouco seguindo o ponteiro
    const g = root.current!
    const px = reduced ? 0 : state.pointer.x
    const py = reduced ? 0 : state.pointer.y
    g.rotation.y += (px * 0.1 - g.rotation.y) * 0.06
    g.rotation.x += (0.1 - py * 0.04 - g.rotation.x) * 0.06

    // troca de cor suave
    for (const tone of ['alpha', 'mod', 'accent'] as const) {
      capMats.current[tone]?.color.lerp(target.cap[tone], 0.12)
      legendMats.current[tone]?.forEach((m) =>
        m.color.lerp(target.legend[tone], 0.12),
      )
    }
    caseMat.current?.color.lerp(target.case, 0.12)
  })

  const legendRegistry =
    (tone: KeyTone, i: number) => (m: MeshStandardMaterial | null) => {
      const list = (legendMats.current[tone] ??= [])
      if (m) list[i] = m
    }

  return (
    <group ref={root} rotation={[0.1, 0, 0]}>
      {/* case de alumínio anodizado */}
      <mesh geometry={frame} position={[0, -0.5, 0]} castShadow>
        <meshPhysicalMaterial
          ref={caseMat}
          color={colorway.case}
          metalness={0.75}
          roughness={0.38}
          clearcoat={0.2}
          clearcoatRoughness={0.4}
        />
      </mesh>
      {/* placa e fundo entre as teclas */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[BOARD_WIDTH + 0.1, 0.06, BOARD_DEPTH + 0.1]} />
        <meshStandardMaterial color="#1c1d21" metalness={0.6} roughness={0.5} />
      </mesh>

      {PLACED.map((placed, i) => {
        const { key } = placed
        const profile = PROFILE[placed.row]
        const tone = key.tone
        const topW = key.width - GAP - TOP_INSET * 2
        const topD = 1 - GAP - TOP_INSET * 2
        const legend = legends?.[i]
        return (
          <group
            key={key.code}
            ref={(el) => {
              keys.current[i] = el
            }}
            position={[placed.x, CAP_BASE, placed.z]}
            onPointerDown={(e) => {
              e.stopPropagation()
              pointerKey.current = key
              onPress(key)
            }}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = '')}
          >
            <group rotation={[profile.tilt, 0, 0]}>
              <mesh
                geometry={capGeometry(key.width, profile.height)}
                castShadow
                receiveShadow
              >
                <meshPhysicalMaterial
                  ref={(m) => {
                    if (m) capMats.current[tone] = m
                  }}
                  color={colorway[tone]}
                  roughness={0.62}
                  metalness={0}
                  sheen={0.3}
                  sheenRoughness={0.8}
                />
              </mesh>
              {legend && (
                <mesh
                  position={[0, profile.height + 0.002, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[topW, topD]} />
                  <meshStandardMaterial
                    ref={legendRegistry(tone, i)}
                    color={colorway[`${tone}Text`]}
                    alphaMap={legend as Texture}
                    transparent
                    roughness={0.55}
                    depthWrite={false}
                  />
                </mesh>
              )}
            </group>
          </group>
        )
      })}
    </group>
  )
}

/** Estúdio de luz: softboxes que dão reflexo ao alumínio e volume às teclas. */
function Studio() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={1.15}>
      <Lightformer
        form="rect"
        intensity={2.2}
        scale={[14, 4, 1]}
        position={[0, 8, 3]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.2}
        scale={[3, 8, 1]}
        position={[-10, 2, 4]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Lightformer
        form="rect"
        intensity={0.8}
        color="#ffd9c8"
        scale={[3, 8, 1]}
        position={[10, 2, -2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </Environment>
  )
}

function Rig() {
  useFrame(({ camera, size }) => {
    // recua a câmera o quanto precisar para o teclado caber na largura da tela
    const aspect = size.width / size.height
    const tan = 2 * Math.tan(((FOV / 2) * Math.PI) / 180)
    const projected =
      FIT_DEPTH * Math.sin(ELEVATION) + THICKNESS * Math.cos(ELEVATION)
    const dist = Math.max(FIT_WIDTH / (tan * aspect), projected / tan) * MARGIN
    camera.position.set(
      0,
      Math.sin(ELEVATION) * dist,
      Math.cos(ELEVATION) * dist,
    )
    camera.lookAt(0, -0.3, 0.2)
  })
  return null
}

export default function Scene({
  onReady,
  fallback,
  ...props
}: SceneProps & { onReady: () => void; fallback: React.ReactNode }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ fov: FOV, near: 0.1, far: 200, position: [0, 12, 14] }}
      gl={{ antialias: true, alpha: true }}
      onCreated={onReady}
      fallback={fallback}
      style={{ touchAction: 'pan-y' }}
      aria-label="Teclado TAKT 65 em 3D. Toque nas teclas ou digite no seu teclado."
      role="img"
    >
      <Studio />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[4, 10, 6]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Rig />
      <Keyboard {...props} />
      <ContactShadows
        position={[0, -0.95, 0]}
        scale={34}
        blur={2.4}
        far={4}
        opacity={0.5}
        resolution={1024}
      />
    </Canvas>
  )
}
