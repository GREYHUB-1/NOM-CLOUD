export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  return /^[+]?[\d\s()-]{7,}$/.test(value.trim())
}

export function minLength(value: string, len: number): boolean {
  return value.trim().length >= len
}

export interface FieldErrors {
  [key: string]: string | undefined
}
