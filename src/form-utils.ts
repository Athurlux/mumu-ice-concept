export type Errors<T extends string> = Partial<Record<T, string>>

export function todayInKampala(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Kampala', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const value = (type: string) => parts.find(part => part.type === type)?.value ?? ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

export function sampleFutureDate(): string {
  return todayInKampala(new Date(Date.now() + 3 * 86_400_000))
}

export function validPhone(value: string): boolean {
  const trimmed = value.trim()
  if (!/^[+\d\s().-]+$/.test(trimmed)) return false
  const compact = trimmed.replace(/[\s().-]/g, '')
  if (!/^\+?\d{8,15}$/.test(compact)) return false
  if (compact.startsWith('0')) return compact.length === 10
  return true
}

export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validPositiveWholeNumber(value: string): boolean {
  return /^\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value)) && Number(value) > 0
}

export function dateNotPast(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= todayInKampala()
}

export function focusFirstError(errors: Record<string, string | undefined>): void {
  const first = Object.keys(errors).find(key => errors[key])
  if (first) requestAnimationFrame(() => document.getElementById(first)?.focus())
}

export function textOrDash(value: string): string {
  return value.trim() || '—'
}
