import { type Color } from '@prisma/client'
import { nanoid } from 'nanoid/non-secure'

import { type Serialize } from 'utils/general'

import { type Filter } from 'filters'

export function getColorFilter(
  variant: Serialize<{ colors: Color[] }>,
): Filter<'variants', 'some'> {
  const filter: Filter<'variants', 'some'> = {
    id: nanoid(5),
    name: 'variants',
    condition: 'some',
    value: {
      AND: variant.colors.map((color) => ({
        colors: { some: { id: color.id, name: color.name } },
      })),
    },
  }
  return filter
}

export function getColorName(variant: Serialize<{ colors: Color[] }>) {
  return variant.colors.map((c) => c.name).join(' / ')
}
