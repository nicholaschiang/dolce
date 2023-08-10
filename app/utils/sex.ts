import { Sex } from '@prisma/client'

/**
 * Get the show sex header (i.e. "Menswear" or "") based on the collections sex.
 * If every collection in the show has a sex of "MAN", then "Menswear" will be
 * appended to the header. Otherwise, nothing will be appended.
 */
export function getSexName(sex: Sex) {
  return sex === Sex.MAN ? 'Menswear' : ''
}

export const SEX_TO_SLUG: Record<Sex, string> = {
  [Sex.MAN]: 'man',
  [Sex.WOMAN]: 'woman',
  [Sex.UNISEX]: 'all',
}
