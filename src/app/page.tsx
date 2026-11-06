import { Buy } from '@organisms/Buy'
import { Footer } from '@organisms/Footer'
import { Hero } from '@organisms/Hero'
import { Layers } from '@organisms/Layers'
import { Nav } from '@organisms/Nav'
import { Specs } from '@organisms/Specs'
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
        <Specs />
        <Buy />
        <Footer />
      </ConfigProvider>
    </MotionProvider>
  )
}
