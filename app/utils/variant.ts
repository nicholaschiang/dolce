import { type Color, type Tag } from '@prisma/client'
import { nanoid } from 'nanoid/non-secure'

import { type Serialize } from 'utils/general'

import { type Filter } from 'filters'

export type VariantFilter = Filter<'variants', 'some'>

export type VariantTagFilter = Filter<
  'variants',
  'some',
  { tags: { some: { id: number; name: string } } }
>

export function isVariantTagFilter(filter: Filter): filter is VariantTagFilter {
  return (
    isVariantFilter(filter) &&
    typeof filter.value === 'object' &&
    filter.value !== null &&
    'tags' in filter.value &&
    typeof filter.value.tags === 'object' &&
    filter.value.tags !== null &&
    'some' in filter.value.tags &&
    typeof filter.value.tags.some === 'object' &&
    filter.value.tags.some !== null &&
    'id' in filter.value.tags.some &&
    'name' in filter.value.tags.some
  )
}

export function getTagFilter(tag: Serialize<Tag>): VariantFilter {
  const filter: VariantFilter = {
    id: nanoid(5),
    name: 'variants',
    condition: 'some',
    value: { tags: { some: { id: tag.id, name: tag.name } } },
  }
  return filter
}

export function getTagName(tag: Serialize<Tag>): string {
  return tag.name
}

export type VariantColorFilter = Filter<
  'variants',
  'some',
  { AND: { colors: { some: { id: number; name: string } } }[] }
>

export function getColorFilter(
  variant: Serialize<{ colors: Color[] }>,
): VariantColorFilter {
  const filter: VariantColorFilter = {
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

export function isVariantColorFilter(
  filter: Filter,
): filter is VariantColorFilter {
  return (
    isVariantFilter(filter) &&
    typeof filter.value === 'object' &&
    filter.value !== null &&
    'AND' in filter.value &&
    typeof filter.value.AND === 'object' &&
    filter.value.AND !== null &&
    filter.value.AND instanceof Array &&
    isColorsArray(filter.value.AND)
  )
}

function isColorsArray(
  array: unknown[],
): array is { colors: { some: { name: string } } }[] {
  return array.every(
    (object) =>
      typeof object === 'object' &&
      object !== null &&
      'colors' in object &&
      typeof object.colors === 'object' &&
      object.colors !== null &&
      'some' in object.colors &&
      typeof object.colors.some === 'object' &&
      object.colors.some !== null &&
      'name' in object.colors.some &&
      typeof object.colors.some.name === 'string',
  )
}

function isVariantFilter(filter: Filter): filter is VariantFilter {
  return filter.name === 'variants' && filter.condition === 'some'
}
