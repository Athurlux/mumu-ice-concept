import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const results = []
for (const [width, height] of [[390, 844], [1440, 900]]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  for (const route of ['/', '/order', '/delivery', '/business', '/contact']) {
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const response = await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')); document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager' }) })
    await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))))
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)
    const name = route === '/' ? 'home' : route.slice(1)
    await page.screenshot({ path: `review-${name}-${width}.png`, fullPage: true, animations: 'disabled' })
    const metrics = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, title: document.title, heading: document.querySelector('h1')?.textContent, brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src) }))
    results.push({ route, width, status: response?.status(), ...metrics, errors })
  }
  await context.close()
}
await browser.close()
console.log(JSON.stringify(results, null, 2))
