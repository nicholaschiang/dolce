import { z } from 'zod'

export const name = z.string({ required_error: 'Name is required' }).trim()

export const username = z
  .string({ required_error: 'Username is required' })
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be fewer than 30 characters')
  .regex(
    /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
    'Username contains invalid characters',
  )

export const email = z
  .string({ required_error: 'Email is required' })
  .trim()
  .email('Email is invalid')

export const password = z
  .string({ required_error: 'Password is required' })
  .trim()
  .min(8, 'Password must be at least 8 characters')
