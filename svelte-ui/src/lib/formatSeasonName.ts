/**
 * Capitalizes the first letter of each word in the given string. Lowercases all
 * the other letters in each string (e.g. "RESORT 2024" -> "Resort 2024").
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
function formatCaps(sentence: string): string {
  return sentence
    .split(' ')
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1).toLowerCase()}`)
    .join(' ')
}

/**
 * Get the user-friendly season name from a season object (e.g. "Resort 2024").
 * @param season The season object.
 * @returns The user-friendly season name.
 */
export function formatSeasonName(season: { name: string; year: number }) {
  const name = formatCaps(season.name.replace('_', ' ')).replace(' ', '-')
  return `${name} ${season.year}`
}
