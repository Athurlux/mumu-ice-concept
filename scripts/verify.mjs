import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--disable-gpu'] })
const origin = process.env.MUMU_VERIFY_URL || 'http://127.0.0.1:4173/'
const captureScreenshots = !process.env.MUMU_VERIFY_URL
const results = []

for (const [width, height] of [[360, 780], [390, 844], [768, 900], [1440, 900]]) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1100)
  const sections = await page.locator('main section').count()
  for (let index = 0; index < sections; index++) { await page.locator('main section').nth(index).scrollIntoViewIfNeeded(); await page.waitForTimeout(180) }
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager' })
  })
  await page.evaluate(() => Promise.all([...document.images].map(img => img.decode().catch(() => {}))))
  await page.waitForTimeout(1100)
  const metrics = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    heroBottom: Math.round(document.querySelector('.hero').getBoundingClientRect().bottom),
    primaryButtonBottom: Math.round(document.querySelector('.hero .button').getBoundingClientRect().bottom),
    headerTransparentAtTop: !document.querySelector('.site-header').classList.contains('site-header--solid'),
    headline: document.querySelector('h1').textContent,
    brokenImages: [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src),
    loadedHero: document.querySelector('.hero__picture img').currentSrc,
  }))
  if (captureScreenshots && (width === 1440 || width === 390)) {
    const filename = width === 1440 ? 'desktop-full.png' : 'mobile-full.png'
    await page.screenshot({ path: filename, fullPage: true, animations: 'disabled' })
  }
  if (captureScreenshots && width === 768) await page.screenshot({ path: 'tablet-768.png', animations: 'disabled' })
  if (captureScreenshots && width === 360) await page.screenshot({ path: 'mobile-360.png', animations: 'disabled' })
  if (width <= 390) {
    await page.keyboard.press('Tab')
    metrics.firstKeyboardFocus = await page.evaluate(() => document.activeElement?.textContent?.trim())
    const menu = page.getByRole('button', { name: 'Open menu' })
    await menu.click()
    metrics.menuOpened = await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded')
    await page.keyboard.press('Escape')
    metrics.escapeClosedMenu = await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')
    await menu.click()
    await page.getByRole('navigation', { name: 'Main navigation' }).getByText('Our Ice').click()
    await page.waitForFunction(() => Math.abs(document.querySelector('#the-ice').getBoundingClientRect().top - 64) < 3)
    metrics.menuLinkHash = new URL(page.url()).hash
    metrics.menuClosed = await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')
    metrics.productTargetTop = Math.round(await page.locator('#the-ice').evaluate(el => el.getBoundingClientRect().top))
    await page.locator('.hero .button').click()
    metrics.primaryPath = new URL(page.url()).pathname
  }
  results.push({ width, height, ...metrics, errors })
  if (metrics.document > metrics.viewport || metrics.brokenImages.length || errors.length || metrics.primaryButtonBottom > height || !metrics.headerTransparentAtTop) throw new Error(`Responsive verification failed at ${width}px`)
  if (width <= 390 && (metrics.menuOpened !== 'true' || metrics.escapeClosedMenu !== 'false' || metrics.menuClosed !== 'false' || metrics.firstKeyboardFocus !== 'Skip to content' || metrics.primaryPath !== '/order' || metrics.menuLinkHash !== '#the-ice')) throw new Error(`Navigation verification failed at ${width}px`)
  await context.close()
}

const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const reducedPage = await reduced.newPage()
await reducedPage.goto(origin)
results.push({ reducedMotion: await reducedPage.evaluate(() => ({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, heroAnimationDuration: getComputedStyle(document.querySelector('.hero h1 span')).animationDuration, revealOpacity: getComputedStyle(document.querySelector('.statement')).opacity })) })
await browser.close()
console.log(JSON.stringify(results, null, 2))
