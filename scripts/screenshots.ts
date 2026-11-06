// Gera os prints do README: npm run build && npm run screenshots
import { spawn } from 'node:child_process'

import { chromium, type Page } from 'playwright'

interface Shot {
  name: string
  width: number
  height: number
  scheme: 'light' | 'dark'
  full?: boolean
  setup?: (page: Page) => Promise<void>
}

const typeAndPick = (colorway: string, text: string) => async (page: Page) => {
  await page.click(`[aria-label="${colorway}"]`)
  await page.keyboard.type(text, { delay: 40 })
  await page.keyboard.down('KeyK')
  await page.waitForTimeout(150)
}
const section = (i: number) => (page: Page) =>
  page.evaluate(
    (n) =>
      window.scrollTo(0, document.querySelectorAll('section')[n].offsetTop),
    i,
  )
const scrollThrough = (page: Page) =>
  page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })

const SHOTS: Shot[] = [
  {
    name: 'desktop',
    width: 1440,
    height: 900,
    scheme: 'light',
    setup: typeAndPick('Menta', 'takt 65 '),
  },
  {
    name: 'desktop-dark',
    width: 1440,
    height: 900,
    scheme: 'dark',
    setup: typeAndPick('Sinal', 'clicky '),
  },
  {
    name: 'desktop-switches',
    width: 1440,
    height: 900,
    scheme: 'light',
    setup: section(0),
  },
  {
    name: 'desktop-camadas',
    width: 1440,
    height: 900,
    scheme: 'dark',
    setup: section(1),
  },
  {
    name: 'tablet',
    width: 820,
    height: 1180,
    scheme: 'light',
    setup: typeAndPick('Glacial', 'oi '),
  },
  { name: 'mobile', width: 390, height: 844, scheme: 'dark' },
  {
    name: 'mobile-full',
    width: 390,
    height: 844,
    scheme: 'light',
    full: true,
    setup: scrollThrough,
  },
]

const server = spawn('node_modules/.bin/next', ['start', '-p', '4173'])
await new Promise((resolve, reject) => {
  server.stdout.on('data', (d) => String(d).includes('Ready') && resolve(null))
  server.on('exit', (code) => reject(new Error(`next start saiu com ${code}`)))
})
const browser = await chromium.launch()
const errors: string[] = []

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: 2,
    colorScheme: shot.scheme,
  })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(`${shot.name}: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)
  if (shot.setup) {
    await shot.setup(page)
    await page.waitForTimeout(1500)
  }
  await page.screenshot({ path: `docs/${shot.name}.png`, fullPage: shot.full })
  await context.close()
}

await browser.close()
server.kill()
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('prints salvos em docs/')
