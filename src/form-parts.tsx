import type { ReactNode } from 'react'

export function Field({ id, label, required, hint, error, children, className = '' }: {
  id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; className?: string
}) {
  return <div className={`form-field ${className}`}>
    <label htmlFor={id}>{label}{required && <span className="form-field__required" aria-hidden="true"> *</span>}</label>
    {children}
    {hint && <p className="form-field__hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p className="form-field__error" id={`${id}-error`} role="alert">{error}</p>}
  </div>
}

export function DemoNote({ children }: { children?: ReactNode }) {
  return <p className="demo-note"><span className="demo-note__dot" aria-hidden="true" /><span>{children ?? 'Demo only. Nothing will be sent and no order will be placed.'}</span></p>
}

export function FormArrow() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 10h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return <div className="summary-row"><dt>{label}</dt><dd>{value}</dd></div>
}
