import { Level } from '@prisma/client'

export const LEVEL_TO_SLUG: Record<Level, string> = {
  [Level.BESPOKE]: 'bespoke',
  [Level.COUTURE]: 'couture',
  [Level.HANDMADE]: 'handmade',
  [Level.RTW]: 'rtw',
}
