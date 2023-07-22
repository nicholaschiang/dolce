import { z } from 'zod'

export const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Email is invalid')

export const password = z
  .string()
  .trim()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
