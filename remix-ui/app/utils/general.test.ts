import { email } from 'utils/schema'

test('validateEmail returns false for non-emails', () => {
  expect(email.safeParse(undefined).success).toBe(false)
  expect(email.safeParse(null).success).toBe(false)
  expect(email.safeParse('').success).toBe(false)
  expect(email.safeParse('not-an-email').success).toBe(false)
  expect(email.safeParse('n@').success).toBe(false)
})

test('validateEmail returns true for emails', () => {
  expect(email.safeParse('kody@example.com').success).toBe(true)
})
