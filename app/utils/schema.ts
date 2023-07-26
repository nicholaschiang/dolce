import { z } from 'zod'

export const name = z.string().trim().min(1, 'Name is required')

export const username = z
  .string()
  .trim()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be fewer than 30 characters')
  .regex(
    /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
    'Username contains invalid characters',
  )

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
