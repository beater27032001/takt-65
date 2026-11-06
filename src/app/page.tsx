import { Hero } from '@organisms/Hero'
import { Layers } from '@organisms/Layers'
import { Nav } from '@organisms/Nav'
import { Switches } from '@organisms/Switches'
import { ConfigProvider } from '@providers/ConfigProvider'
import { MotionProvider } from '@providers/MotionProvider'

export default function Home() {
  return (
    <MotionProvider>
      <ConfigProvider>
        <div className="wrap">
          <Nav />
          <Hero />
        </div>
        <Switches />
        <Layers />
      </ConfigProvider>
    </MotionProvider>
  )
}
