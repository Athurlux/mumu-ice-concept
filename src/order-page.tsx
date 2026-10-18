import { useEffect, useRef, useState, type FormEvent } from 'react'
import { DemoNote, Field, FormArrow, SummaryRow } from './form-parts'
import { dateNotPast, focusFirstError, sampleFutureDate, textOrDash, todayInKampala, validPhone, validPositiveWholeNumber, type Errors } from './form-utils'

type OrderData = {
  occasion: string; quantity: string; notes: string; name: string; phone: string; area: string;
  address: string; landmark: string; date: string; time: string; instructions: string
}
const emptyOrder: OrderData = { occasion: '', quantity: '1', notes: '', name: '', phone: '', area: '', address: '', landmark: '', date: '', time: '', instructions: '' }
const occasions = ['Home', 'Party', 'Event', 'Restaurant/Bar', 'Other']
const timeWindows = ['Morning', 'Afternoon', 'Evening', 'Flexible']

function dateLabel(value: string): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Kampala' }).format(new Date(`${value}T12:00:00+03:00`))
}

function orderSummaryText(data: OrderData): string {
  return [
    'Mumu Ice — demo delivery request',
    `Occasion: ${data.occasion}`,
    `Quantity: ${data.quantity} ${data.quantity === '1' ? 'bag' : 'bags'}`,
    `Recipient: ${data.name}`,
    `Phone: ${data.phone}`,
    `Address: ${data.address}, ${data.area}`,
    `Landmark: ${textOrDash(data.landmark)}`,
    `Preferred date: ${dateLabel(data.date)}`,
    `Preferred time: ${data.time}`,
    `Order notes: ${textOrDash(data.notes)}`,
    `Delivery instructions: ${textOrDash(data.instructions)}`,
    'Price and delivery fee: to be confirmed',
    'Demo only — nothing was submitted.',
  ].join('\n')
}

function OrderSummary({ data }: { data: OrderData }) {
  return <div className="order-review-grid">
    <section><h3>Your ice</h3><dl><SummaryRow label="Occasion" value={data.occasion} /><SummaryRow label="Quantity" value={`${data.quantity} ${data.quantity === '1' ? 'bag' : 'bags'}`} /><SummaryRow label="Order notes" value={textOrDash(data.notes)} /></dl></section>
    <section><h3>Delivery details</h3><dl><SummaryRow label="Recipient" value={data.name} /><SummaryRow label="Phone" value={data.phone} /><SummaryRow label="Address" value={<>{data.address}<br />{data.area}</>} /><SummaryRow label="Landmark" value={textOrDash(data.landmark)} /><SummaryRow label="Preferred date" value={dateLabel(data.date)} /><SummaryRow label="Preferred time" value={data.time} /><SummaryRow label="Instructions" value={textOrDash(data.instructions)} /></dl></section>
  </div>
}

export function OrderPage() {
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1)
  const [data, setData] = useState<OrderData>(emptyOrder)
  const [errors, setErrors] = useState<Errors<keyof OrderData>>({})
  const [copyStatus, setCopyStatus] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const previousStage = useRef(stage)

  useEffect(() => {
    if (previousStage.current === stage) return
    previousStage.current = stage
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => heading.current?.focus())
  }, [stage])

  const update = (key: keyof OrderData, value: string) => {
    setData(current => ({ ...current, [key]: value }))
    setErrors(current => ({ ...current, [key]: undefined }))
  }

  const continueFromRequirements = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Errors<keyof OrderData> = {}
    if (!data.occasion) next.occasion = 'Choose an occasion to continue.'
    if (!validPositiveWholeNumber(data.quantity)) next.quantity = 'Enter a whole number of bags greater than zero.'
    setErrors(next)
    if (Object.keys(next).length) { focusFirstError(next); return }
    setStage(2)
  }

  const continueFromDelivery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Errors<keyof OrderData> = {}
    if (!data.name.trim()) next.name = 'Enter the recipient’s full name.'
    if (!data.phone.trim()) next.phone = 'Enter a phone number.'
    else if (!validPhone(data.phone)) next.phone = 'Enter a valid local or international phone number.'
    if (!data.area.trim()) next.area = 'Enter a delivery area or neighbourhood.'
    if (!data.address.trim()) next.address = 'Enter street or address details.'
    if (!data.date) next.date = 'Choose a preferred delivery date.'
    else if (!dateNotPast(data.date)) next.date = 'Choose today or a future date in Kampala time.'
    if (!data.time) next.time = 'Choose a preferred time window.'
    setErrors(next)
    if (Object.keys(next).length) { focusFirstError(next); return }
    setStage(3)
  }

  const useSample = () => {
    setData(current => ({ ...current, name: 'Amina Demo', phone: '+256 700 000 000', area: 'Example area, Kampala', address: 'Sample House, Demo Street', landmark: 'Near the sample market', date: sampleFutureDate(), time: 'Afternoon', instructions: 'Demonstration details only.' }))
    setErrors({})
  }

  const restart = () => { setData({ ...emptyOrder }); setErrors({}); setCopyStatus(''); setStage(1) }
  const copySummary = async () => {
    try { await navigator.clipboard.writeText(orderSummaryText(data)); setCopyStatus('Summary copied.') }
    catch { setCopyStatus('Copy unavailable in this browser. You can select the details above.') }
  }

  return <div className="journey-page order-page">
    <section className="journey-intro journey-intro--order"><div className="wrap journey-intro__inner"><p className="section-index">MUMU ICE / DELIVERY REQUEST</p><h1>ICE, ON<br /><span>YOUR TERMS.</span></h1><p>Build a request around your moment. This frontend demo lets you review every detail before seeing a local confirmation.</p></div></section>
    <div className="wrap order-layout">
      <div className="order-main">
        <nav className="stepper" aria-label="Request progress"><ol>{['Your ice', 'Delivery details', 'Review'].map((label, index) => <li key={label} className={stage === index + 1 ? 'stepper__active' : stage > index + 1 ? 'stepper__done' : ''} aria-current={stage === index + 1 ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{label}</li>)}</ol></nav>

        {stage === 1 && <form noValidate onSubmit={continueFromRequirements} className="journey-form"><div className="form-heading"><p className="section-index">01 / CHOOSE YOUR ICE</p><h2 ref={heading} tabIndex={-1}>WHAT’S THE<br /><span>OCCASION?</span></h2><p>Start with the essentials. Bag size and pricing would be confirmed by the supplier.</p></div>
          <div className="order-product-mini"><img src="/images/ice-bag-550.webp" width="550" height="825" alt="Proposed Mumu Ice bag filled with ice cubes" /><div><strong>Mumu Ice</strong><span>Packaging concept</span><p>Ice for the moments worth keeping cool.</p></div></div>
          <fieldset className="choice-fieldset" id="occasion" tabIndex={-1} aria-describedby={errors.occasion ? 'occasion-error' : undefined}><legend>Occasion <span aria-hidden="true">*</span></legend><div className="choice-grid">{occasions.map(option => <label className={`choice-chip${data.occasion === option ? ' choice-chip--selected' : ''}`} key={option}><input type="radio" name="occasion" value={option} checked={data.occasion === option} onChange={() => update('occasion', option)} /><span>{option}</span></label>)}</div>{errors.occasion && <p className="form-field__error" id="occasion-error" role="alert">{errors.occasion}</p>}</fieldset>
          <Field id="quantity" label="Quantity of bags" required hint="Enter a whole number. Bag size and price would be confirmed by the supplier." error={errors.quantity}><div className="quantity-control"><button type="button" aria-label="Remove one bag" disabled={!validPositiveWholeNumber(data.quantity) || Number(data.quantity) <= 1} onClick={() => update('quantity', String(Math.max(1, Number(data.quantity) - 1)))}>−</button><input id="quantity" name="quantity" type="number" inputMode="numeric" min="1" step="1" value={data.quantity} onChange={event => update('quantity', event.target.value)} aria-invalid={Boolean(errors.quantity)} aria-describedby={`quantity-hint${errors.quantity ? ' quantity-error' : ''}`} /><button type="button" aria-label="Add one bag" onClick={() => update('quantity', String(validPositiveWholeNumber(data.quantity) ? Number(data.quantity) + 1 : 1))}>+</button><span>bags</span></div></Field>
          <Field id="notes" label="Order notes" hint="Optional — tell us anything that helps describe your request."><textarea id="notes" name="notes" rows={3} value={data.notes} onChange={event => update('notes', event.target.value)} aria-describedby="notes-hint" placeholder="For example, ice for a garden party" /></Field>
          <button className="form-primary" type="submit">Continue to delivery <FormArrow /></button>
        </form>}

        {stage === 2 && <form noValidate onSubmit={continueFromDelivery} className="journey-form"><div className="form-heading"><p className="section-index">02 / DELIVERY DETAILS</p><h2 ref={heading} tabIndex={-1}>WHERE TO<br /><span>BRING THE CHILL?</span></h2><p>Tell us where and when you would prefer delivery. Availability is not checked in this demo.</p></div>
          <button className="sample-button" type="button" onClick={useSample}>Use sample details <span aria-hidden="true">↗</span></button><p className="sample-explainer">Fills obviously fictional details for a quick walkthrough.</p>
          <div className="form-grid">
            <Field id="name" label="Full name" required error={errors.name}><input id="name" name="name" type="text" autoComplete="name" value={data.name} onChange={event => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} /></Field>
            <Field id="phone" label="Phone number" required error={errors.phone}><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={event => update('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} placeholder="e.g. 0700 000 000" /></Field>
            <Field id="area" label="Delivery area or neighbourhood" required error={errors.area}><input id="area" name="area" type="text" autoComplete="address-level2" value={data.area} onChange={event => update('area', event.target.value)} aria-invalid={Boolean(errors.area)} aria-describedby={errors.area ? 'area-error' : undefined} placeholder="Area in or around Kampala" /></Field>
            <Field id="address" label="Street / address details" required error={errors.address}><input id="address" name="address" type="text" autoComplete="street-address" value={data.address} onChange={event => update('address', event.target.value)} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'address-error' : undefined} /></Field>
            <Field id="landmark" label="Nearby landmark"><input id="landmark" name="landmark" type="text" value={data.landmark} onChange={event => update('landmark', event.target.value)} /></Field>
            <Field id="date" label="Preferred delivery date" required hint="Dates use Kampala time (UTC+3)." error={errors.date}><input id="date" name="date" type="date" min={todayInKampala()} value={data.date} onChange={event => update('date', event.target.value)} aria-invalid={Boolean(errors.date)} aria-describedby={`date-hint${errors.date ? ' date-error' : ''}`} /></Field>
            <Field id="time" label="Preferred time window" required error={errors.time}><select id="time" name="time" value={data.time} onChange={event => update('time', event.target.value)} aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? 'time-error' : undefined}><option value="">Select a preference</option>{timeWindows.map(option => <option key={option}>{option}</option>)}</select></Field>
            <Field id="instructions" label="Delivery instructions" className="form-field--wide"><textarea id="instructions" name="instructions" rows={3} value={data.instructions} onChange={event => update('instructions', event.target.value)} placeholder="Optional directions for the request" /></Field>
          </div><div className="form-actions"><button className="form-back" type="button" onClick={() => setStage(1)}>← Back to your ice</button><button className="form-primary" type="submit">Review request <FormArrow /></button></div>
        </form>}

        {stage === 3 && <section className="journey-form" aria-labelledby="review-heading"><div className="form-heading"><p className="section-index">03 / REVIEW</p><h2 ref={heading} id="review-heading" tabIndex={-1}>ONE LAST<br /><span>LOOK.</span></h2><p>Check your details. You can go back without losing what you entered.</p></div><div className="review-edit-links"><button type="button" onClick={() => setStage(1)}>Edit ice requirements ↗</button><button type="button" onClick={() => setStage(2)}>Edit delivery details ↗</button></div><OrderSummary data={data} /><p className="price-notice">Price and delivery fee: <strong>to be confirmed</strong></p><DemoNote /><button type="button" className="form-primary" onClick={() => setStage(4)}>Preview request confirmation <FormArrow /></button></section>}

        {stage === 4 && <section className="journey-form confirmation" aria-labelledby="confirmation-heading"><p className="confirmation__mark" aria-hidden="true">✓</p><p className="section-index">DEMO CONFIRMATION</p><h2 ref={heading} id="confirmation-heading" tabIndex={-1}>YOUR DEMO<br /><span>REQUEST IS READY.</span></h2><p className="confirmation__lead">No request was submitted. No order has been placed or scheduled. This is a preview of the details a customer could send in a future service.</p><OrderSummary data={data} /><p className="price-notice">Price and delivery fee: <strong>to be confirmed</strong></p><div className="form-actions"><button className="form-back" type="button" onClick={restart}>Start a new demo request</button><button className="form-secondary" type="button" onClick={copySummary}>Copy summary</button></div>{copyStatus && <p className="copy-status" role="status">{copyStatus}</p>}</section>}
      </div>
      <aside className="order-aside" aria-label="Mumu Ice packaging concept"><div className="order-aside__image"><img src="/images/ice-bag-850.webp" srcSet="/images/ice-bag-550.webp 550w, /images/ice-bag-850.webp 850w" sizes="(min-width: 900px) 29vw, 0px" width="1024" height="1536" alt="Proposed Mumu Ice packaging filled with ice cubes" /></div><div className="order-aside__foot"><span>PACKAGING CONCEPT</span><p>Good moments begin with a little more chill.</p></div></aside>
    </div>
  </div>
}
