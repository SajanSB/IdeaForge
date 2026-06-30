import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim()
  if (!trimmed) return false
  return EMAIL_PATTERN.test(trimmed)
}

export function getEmailValidationError(email: string): string | null {
  const trimmed = email.trim()
  if (!trimmed) return 'Email is required'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address'
  return null
}

export type PasswordRequirement = {
  check: boolean
  label: string
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    { check: password.length >= 8, label: '8+ characters' },
    { check: /[a-z]/.test(password), label: 'Lowercase' },
    { check: /[A-Z]/.test(password), label: 'Uppercase' },
    { check: /[0-9]/.test(password), label: 'Number' },
    { check: /[^A-Za-z0-9]/.test(password), label: 'Special character' },
  ]
}

export function isStrongPassword(password: string): boolean {
  return getPasswordRequirements(password).every((requirement) => requirement.check)
}

export function getConfirmPasswordError(password: string, confirmPassword: string): string | null {
  if (!confirmPassword.trim()) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}
