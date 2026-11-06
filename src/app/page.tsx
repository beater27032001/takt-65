import { Hero } from '@organisms/Hero'
import { Nav } from '@organisms/Nav'
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
      </ConfigProvider>
    </MotionProvider>
  )
}
