import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { OrderPage } from './order-page'
import { BusinessPage, ContactPage, DeliveryPage } from './info-pages'
import './styles.css'
import './journeys.css'

const image = (name: string, size: number) => `/images/${name}-${size}.webp`

function Brand({ light = false }: { light?: boolean }) {
  return <span className={`brand${light ? ' brand--light' : ''}`} aria-label="Mumu Ice"><svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M32 5 58 19 32 33 6 19Z" fill="#a5e8fa" /><path d="M6 25 29 37v22L6 47Z" fill="#00b9ec" /><path d="M58 25 35 37v22l23-12Z" fill="#087bbf" /></svg><span className="brand__text"><span>Mumu</span><span>Ice</span></span></span>
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={diagonal ? 'M4 16 16 4M6 4h10v10' : 'M2 10h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey) }
  }, [])
  useEffect(() => { document.body.classList.toggle('menu-open', open); return () => document.body.classList.remove('menu-open') }, [open])
  const close = () => setOpen(false)
  const path = window.location.pathname
  return <header className={`site-header${scrolled || open || path !== '/' ? ' site-header--solid' : ''}`}>
    <div className="site-header__inner wrap">
      <a className="site-header__brand" href="/" onClick={close}><Brand light /><span className="header-concept">INDEPENDENT CONCEPT</span></a>
      <nav className={`site-nav${open ? ' site-nav--open' : ''}`} id="site-nav" aria-label="Main navigation">
        <a href="/#the-ice" onClick={close}>Our Ice</a><a href="/delivery" onClick={close} aria-current={path === '/delivery' ? 'page' : undefined}>Delivery</a><a href="/business" onClick={close} aria-current={path === '/business' ? 'page' : undefined}>Events &amp; Business</a><a href="/contact" onClick={close} aria-current={path === '/contact' ? 'page' : undefined}>Contact</a>
        <a className="site-nav__mobile-explore" href="/order" onClick={close}>Order Ice <Arrow /></a>
      </nav>
      <a className="header-cta" href="/order">Order Ice <Arrow diagonal /></a>
      <button className={`menu-toggle${open ? ' menu-toggle--open' : ''}`} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-controls="site-nav" aria-expanded={open} onClick={() => setOpen(value => !value)}><span /><span /></button>
    </div>
  </header>
}

function Hero() {
  return <section className="hero" id="top" aria-labelledby="hero-title"><picture className="hero__picture"><source media="(max-width: 699px)" srcSet={`${image('hero-mobile', 480)} 480w, ${image('hero-mobile', 720)} 720w`} sizes="100vw" /><img src={image('hero-desktop', 1440)} srcSet={`${image('hero-desktop', 960)} 960w, ${image('hero-desktop', 1440)} 1440w`} sizes="100vw" width="1536" height="1024" alt="" fetchPriority="high" /></picture><div className="hero__shade" /><div className="wrap hero__inner"><div className="hero__copy"><p className="eyebrow hero__eyebrow"><span className="eyebrow__rule" /> CHILL LOOKS GOOD ON YOU</p><h1 id="hero-title" aria-label="Bring on the chill."><span>BRING ON</span><span>THE <em>CHILL.</em></span></h1><p className="hero__intro">Ice for good times, big occasions and everyday refreshment.</p><div className="hero__actions"><a className="button button--lime" href="/order">Order Ice <Arrow /></a><a className="text-link" href="/delivery">Explore Delivery <Arrow diagonal /></a></div></div><div className="hero__footer" aria-hidden="true"><span>01 / 05</span><span>SCROLL TO FEEL THE CHILL <span className="down-arrow">↓</span></span><span>KAMPALA, UGANDA</span></div></div></section>
}

function BrandStatement() {
  return <section className="statement reveal" id="the-brand" aria-labelledby="statement-title"><div className="wrap statement__inner"><div className="statement__side"><span className="section-index">01 / THE FEELING</span><span className="statement__asterisk" aria-hidden="true">✳</span></div><div className="statement__main"><h2 id="statement-title">SMALL CUBES.<br /><span>BIG ENERGY.</span></h2><p>From the first pour to the final toast, bring a little more chill to the moment.</p></div></div></section>
}

function Product() {
  return <section className="product section-pad" id="the-ice" aria-labelledby="product-title"><div className="wrap product__layout"><div className="product__copy reveal"><p className="section-index">02 / THE ICE</p><h2 id="product-title">MEET YOUR<br /><span>PLUS ONE.</span></h2><p className="section-lede">A fresh look for the ice behind your favourite moments.</p><span className="concept-label"><span /> Packaging concept</span><a className="product__cta" href="/order">Build your ice request <Arrow diagonal /></a></div><div className="product__visual reveal"><div className="product__visual-inner"><picture><source srcSet={`${image('ice-bag', 550)} 550w, ${image('ice-bag', 850)} 850w`} sizes="(max-width: 700px) 82vw, 43vw" /><img src={image('ice-bag', 850)} width="1024" height="1536" alt="Proposed Mumu Ice packaging filled with ice cubes" loading="lazy" decoding="async" /></picture></div><span className="product__side-note" aria-hidden="true">THE GOOD TIMES START HERE — MUMU ICE</span></div></div><div className="wrap product__bottom"><span>ICE, BUT MAKE IT A MOMENT.</span><span className="product__line" /><span>001</span></div></section>
}

type Occasion = { label: string; title: string; caption: string; asset: string; alt: string; className: string }
const occasions: Occasion[] = [
  { label: '01 / AFTER HOURS', title: 'Good times', caption: 'The table is set. The ice is in.', asset: 'party', alt: 'Ice bucket with chilled drinks and limes at an evening gathering', className: 'occasion--party' },
  { label: '02 / THE LITTLE RITUALS', title: 'The perfect pour', caption: 'For that first sip feeling.', asset: 'drink', alt: 'Cold lime drink with ice and a splash', className: 'occasion--drink' },
  { label: '03 / ALL TOGETHER', title: 'Bigger occasions', caption: 'Bring more chill to the gathering.', asset: 'bulk', alt: 'Proposed Mumu Ice bags arranged together', className: 'occasion--bulk' },
]

function OccasionFigure({ item }: { item: Occasion }) {
  return <figure className={`occasion ${item.className} reveal`}><div className="occasion__image"><picture><source srcSet={`${image(item.asset, 760)} 760w, ${image(item.asset, 1200)} 1200w`} sizes="(max-width: 700px) 92vw, 55vw" /><img src={image(item.asset, 1200)} width="1536" height="1024" alt={item.alt} loading="lazy" decoding="async" /></picture></div><figcaption><span className="occasion__label">{item.label}</span><div className="occasion__caption"><div><h3>{item.title}</h3><p>{item.caption}</p></div><span className="occasion__arrow" aria-hidden="true"><Arrow diagonal /></span></div></figcaption></figure>
}

function Occasions() {
  return <section className="occasions section-pad" id="occasions" aria-labelledby="occasions-title"><div className="wrap"><div className="occasions__intro reveal"><div><p className="section-index">03 / YOUR MOMENTS</p><h2 id="occasions-title">EVERY MOMENT<br /><span>HAS ITS COOL.</span></h2></div><p>From easy afternoons to the nights everyone remembers.</p></div><div className="occasions__grid">{occasions.map(item => <OccasionFigure key={item.asset} item={item} />)}</div></div></section>
}

function BrandMoment() {
  return <section className="brand-moment" aria-labelledby="brand-moment-title"><div className="brand-moment__ice" aria-hidden="true"><img src={image('floating-ice', 900)} srcSet={`${image('floating-ice', 560)} 560w, ${image('floating-ice', 900)} 900w`} sizes="(max-width: 700px) 72vw, 46vw" width="1254" height="1254" loading="lazy" decoding="async" alt="" /></div><div className="wrap brand-moment__inner"><p className="section-index">04 / THE MUMU MOOD</p><h2 id="brand-moment-title">KEEP THE GOOD<br /><span>TIMES COOL.</span></h2><p>Make room for another round.</p></div><span className="brand-moment__edge" aria-hidden="true">MUMU ICE / MUMU ICE / MUMU ICE / MUMU ICE /</span></section>
}

function HomeDelivery() {
  return <section className="home-delivery" aria-labelledby="home-delivery-title"><div className="wrap home-delivery__inner"><div><p className="section-index">DELIVERY / THE WAY FORWARD</p><h2 id="home-delivery-title">YOUR ICE.<br /><span>YOUR PLAN.</span></h2><p>Choose the ice, add your preferred details, and see the full request before anything happens.</p><a href="/delivery" className="button button--lime">Explore delivery <Arrow /></a></div><div className="home-delivery__graphic" aria-hidden="true"><span className="home-delivery__ring home-delivery__ring--one" /><span className="home-delivery__ring home-delivery__ring--two" /><span className="home-delivery__point" /><span className="home-delivery__graphic-label">01 / CHOOSE&nbsp; → &nbsp;02 / DETAIL&nbsp; → &nbsp;03 / REVIEW</span></div></div></section>
}

function HomeBusiness() {
  return <section className="home-business" aria-labelledby="home-business-title"><div className="home-business__image"><img src="/images/bulk-1200.webp" srcSet="/images/bulk-760.webp 760w, /images/bulk-1200.webp 1200w" sizes="(max-width: 700px) 100vw, 50vw" width="1536" height="1024" alt="Proposed Mumu Ice bags arranged for an occasion" loading="lazy" /></div><div className="home-business__copy"><p className="section-index">EVENTS & BUSINESS</p><h2 id="home-business-title">FOR THE<br /><span>BIGGER MOMENTS.</span></h2><p>Planning a celebration or exploring ongoing supply? Tell us what you have in mind through a dedicated demo enquiry.</p><a href="/business" className="home-business__link">Explore events &amp; business <Arrow diagonal /></a></div></section>
}

const faqs = [
  { question: 'How would I request ice?', answer: 'Select Order Ice, choose an occasion and quantity, add preferred delivery details, then review a demo request. Nothing is sent from this concept site.' },
  { question: 'Can I enquire about event or business supply?', answer: 'Yes. The Events & Business page lets you describe a one-time occasion or a recurring supply need and preview your enquiry locally.' },
  { question: 'How are prices and delivery charges confirmed?', answer: 'This concept does not calculate prices or fees. A real supplier would need to confirm bag size, price, availability and delivery charges.' },
  { question: 'Is this a real ordering website?', answer: 'No. This is an independent website and branding concept. Forms demonstrate the customer journey in your browser; they do not submit requests or place orders.' },
]

function HomeFaq() {
  return <section className="home-faq section-pad" id="faq" aria-labelledby="faq-title"><div className="wrap home-faq__layout"><div><p className="section-index">GOOD TO KNOW</p><h2 id="faq-title">QUICK<br /><span>ANSWERS.</span></h2><p>Clear details for a concept you can explore.</p></div><div className="home-faq__questions">{faqs.map((item, index) => <details key={item.question}><summary><span>{String(index + 1).padStart(2, '0')}</span>{item.question}<b aria-hidden="true">+</b></summary><p>{item.answer}</p></details>)}</div></div></section>
}

function MobileOrderCta() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const check = () => { const faqTop = document.getElementById('faq')?.getBoundingClientRect().top ?? Infinity; setVisible(window.innerWidth < 700 && window.scrollY > 430 && faqTop > window.innerHeight - 60) }
    check(); window.addEventListener('scroll', check, { passive: true }); window.addEventListener('resize', check)
    return () => { window.removeEventListener('scroll', check); window.removeEventListener('resize', check) }
  }, [])
  return visible ? <a className="mobile-order-cta" href="/order">Order Ice <Arrow /></a> : null
}

function Footer() {
  return <footer className="footer" id="footer"><div className="wrap"><div className="footer__top"><div><p className="section-index">STAY COOL</p><h2>GOOD TIMES<br />LOOK BETTER<br /><span>ON ICE.</span></h2></div><div className="footer__actions"><a className="button button--lime" href="/order">Order Ice <Arrow /></a><a className="footer__back" href="#main">Back to top <span aria-hidden="true">↑</span></a></div></div><div className="footer__bottom"><a href="/" aria-label="Mumu Ice, homepage"><Brand light /></a><nav aria-label="Footer navigation"><a href="/#the-ice">Our Ice</a><a href="/delivery">Delivery</a><a href="/business">Events &amp; Business</a><a href="/contact">Contact</a></nav><p>Mumu Ice — Kampala, Uganda</p></div><p className="footer__disclosure">Independent website and branding concept. Not affiliated with Mumu Ice. Form previews are local demos; nothing is submitted.</p></div></footer>
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  useEffect(() => {
    const titles: Record<string, string> = { '/': 'Mumu Ice — Bring on the chill', '/order': 'Order Ice — Mumu Ice demo', '/delivery': 'Delivery — Mumu Ice concept', '/business': 'Events & Business — Mumu Ice concept', '/contact': 'Contact — Mumu Ice concept' }
    document.title = titles[path] ?? 'Page not found — Mumu Ice'
    if (window.location.hash) requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView())
  }, [path])
  useEffect(() => {
    if (path !== '/') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: 0.08, rootMargin: '0px 0px -30px 0px' })
    elements.forEach(element => { element.classList.add('will-reveal'); observer.observe(element) })
    return () => observer.disconnect()
  }, [path])
  const content = path === '/' ? <><Hero /><BrandStatement /><Product /><HomeDelivery /><Occasions /><HomeBusiness /><BrandMoment /><HomeFaq /></> : path === '/order' ? <OrderPage /> : path === '/delivery' ? <DeliveryPage /> : path === '/business' ? <BusinessPage /> : path === '/contact' ? <ContactPage /> : <section className="not-found wrap"><p className="section-index">404 / LOST YOUR CHILL?</p><h1>PAGE NOT FOUND.</h1><p>Head back to the Mumu Ice concept homepage.</p><a className="button button--lime" href="/">Go home <Arrow /></a></section>
  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main">{content}</main>{path === '/' && <MobileOrderCta />}<Footer /></>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
