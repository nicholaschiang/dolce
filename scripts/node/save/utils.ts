/**
 * Derive the brand slug based on the brand name. Ideally, I should just set it
 * by default at the database level, but I don't know of a way to express this
 * RegExp in the Prisma Schema format (see the migration, though).
 */
export function slug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()\s]+/g, '-')
    .replace(/-$/, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f\u2019'"]/g, '')
}

/**
 * Capitalizes the first letter of each word in the given string. Lowercases all
 * the other letters in each string (e.g. "RESORT 2024" -> "Resort 2024").
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export function caps(sentence: string): string {
  return sentence
    .split(' ')
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`)
    .join(' ')
}
