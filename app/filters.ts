import type { Prisma } from '@prisma/client'

const SINGLE_CONDITION_TO_STRING: Record<FilterCondition, string> = {
  equals: 'is',
  not: 'is not',
  in: 'is',
  notIn: 'is not',
  lt: 'is less than',
  lte: 'is less than or equal to',
  gt: 'is greater than',
  gte: 'is greater than or equal to',
  contains: 'contains',
  startsWith: 'starts with',
  endsWith: 'ends with',
  every: 'includes',
  some: 'includes',
  none: 'does not include',
  mode: 'mode',
}
const PLURAL_CONDITION_TO_STRING: Record<FilterCondition, string> = {
  ...SINGLE_CONDITION_TO_STRING,
  in: 'is any of',
  every: 'includes all of',
  some: 'includes any of',
  // TODO is this "exclude if any of" or "exclude if all" or both?
  none: 'exclude if any of',
}
export const FILTER_PARAM = 'f'
export const JOIN_PARAM = 'j'

// i tried to use a custom (Objectify<T> = T extends object ? T : never) type
// but it didn't work for filtering decimal fields (where Decimal is an object).
type PrismaProductFilter =
  | Prisma.IntFilter<'Product'>
  | Prisma.StringFilter<'Product'>
  | Prisma.EnumLevelFilter<'Product'>
  | Prisma.DateTimeFilter<'Product'>
  | Prisma.DecimalNullableFilter<'Product'>
  | Prisma.SizeListRelationFilter
  | Prisma.VariantListRelationFilter
  | Prisma.StyleListRelationFilter
  | Prisma.CollectionListRelationFilter
  | Prisma.BrandListRelationFilter
  | Prisma.UserListRelationFilter
  | Prisma.LookListRelationFilter
type PrismaShowFilter =
  | Prisma.IntFilter<'Show'>
  | Prisma.IntNullableFilter<'Show'>
  | Prisma.StringFilter<'Show'>
  | Prisma.StringNullableFilter<'Show'>
  | Prisma.EnumLevelFilter<'Show'>
  | Prisma.EnumSexFilter<'Show'>
  | Prisma.DateTimeFilter<'Show'>
  | Prisma.DateTimeNullableFilter<'Show'>
  | Prisma.EnumLocationNullableFilter<'Show'>
  | Prisma.ArticleListRelationFilter
  | Prisma.ReviewListRelationFilter
  | Prisma.VideoNullableRelationFilter
  | Prisma.SeasonRelationFilter
  | Prisma.CollectionListRelationFilter
  | Prisma.LookListRelationFilter
  | Prisma.BrandRelationFilter

type Ignore = 'AND' | 'OR' | 'NOT'
type ProductFilterName = keyof Omit<Prisma.ProductWhereInput, Ignore>
type ShowFilterName = keyof Omit<Prisma.ShowWhereInput, Ignore>
export type FilterName = ProductFilterName | ShowFilterName

type ProductFilterCondition<N extends ProductFilterName> = keyof Extract<
  PrismaProductFilter,
  Prisma.ProductWhereInput[N]
>
type ShowFilterCondition<N extends ShowFilterName> = keyof Extract<
  PrismaShowFilter,
  Prisma.ShowWhereInput[N]
>
export type FilterCondition<N extends FilterName = FilterName> =
  N extends ProductFilterName
    ? ProductFilterCondition<N>
    : N extends ShowFilterName
    ? ShowFilterCondition<N>
    : never

type ProductFilterValue<
  N extends ProductFilterName,
  C extends ProductFilterCondition<N>,
> = Extract<PrismaProductFilter, Prisma.ProductWhereInput[N]>[C]
type ShowFilterValue<
  N extends ShowFilterName,
  C extends ShowFilterCondition<N>,
> = Extract<PrismaShowFilter, Prisma.ShowWhereInput[N]>[C]
export type FilterValue<
  N extends FilterName = FilterName,
  C extends FilterCondition<N> = FilterCondition<N>,
> = C extends ProductFilterCondition<infer PN>
  ? ProductFilterValue<PN, C>
  : C extends ShowFilterCondition<infer SN>
  ? ShowFilterValue<SN, C>
  : never

export type Filter<
  N extends FilterName = FilterName,
  C extends FilterCondition<N> = FilterCondition<N>,
  V extends FilterValue<N, C> = FilterValue<N, C>,
> = {
  id: string
  name: N
  condition: C
  value: V
}

export function filterToSearchParam<
  N extends FilterName,
  C extends FilterCondition<N>,
>(filter: Filter<N, C>): string {
  return [
    filter.id,
    filter.name,
    filter.condition.toString(),
    JSON.stringify(filter.value),
  ]
    .map(encodeURIComponent)
    .join(':')
}

export function searchParamToFilter(searchParam: string): Filter {
  const [id, name, condition, value] = searchParam
    .split(':')
    .map(decodeURIComponent)
  return {
    id,
    name: name as FilterName,
    condition: condition as FilterCondition,
    value: JSON.parse(value) as FilterValue,
  }
}

export function filterToPrismaWhere(
  filter: Filter,
): Prisma.XOR<Prisma.ProductWhereInput, Prisma.ShowWhereInput> {
  return { [filter.name]: { [filter.condition]: filter.value } }
}

/**
 * Converts a filter value into a user-facing string.
 * @example
 * filterValueToString('foo') // 'foo'
 * filterValueToString(1) // '1'
 * filterValueToString({ equals: 1 }) // '{ equals: 1 }'
 * filterValueToString({ name: 'foo' }) // 'foo'
 * filterValueToString(['foo', 'bar']) // 'foo, bar'
 * filterValueToString([{ name: 'foo' }, { name: 'bar' }]) // 'foo, bar'
 */
function filterValueToString(value: FilterValue): string {
  switch (typeof value) {
    case 'string':
      return value
    case 'number':
      return value.toString()
    case 'boolean':
      return value.toString()
    case 'object':
      if (Array.isArray(value)) return value.map(filterValueToString).join(', ')
      if (value instanceof Date) return value.toString()
      // TODO instead of surfacing the code-based "null" value, we should add
      // i18n and then surface the relevant "n/a" (or its equivalent) string.
      if (value === null) return 'null'
      if ('name' in value && typeof value.name === 'string') return value.name
      return JSON.stringify(value)
    default:
      throw new Error(`Unknown filter value type "${typeof value}"`)
  }
}

/**
 * Converts a filter condition into a user-facing string.
 * @example
 * filterConditionToString('equals') // 'is'
 * filterConditionToString('not') // 'is not'
 * filterConditionToString('in') // 'is any of'
 * filterConditionToString('notIn') // 'is not'
 * filterConditionToString('lt') // 'is less than'
 */
function filterConditionToString(
  condition: FilterCondition,
  plural = true,
): string {
  return plural
    ? PLURAL_CONDITION_TO_STRING[condition]
    : SINGLE_CONDITION_TO_STRING[condition]
}

/**
 * Converts a filter name into a user-facing string. Removes plurals.
 * @example
 * filterNameToString('name') // 'name'
 * filterNameToString('sizes') // 'size'
 * filterNameToString('variants') // 'variant'
 * @todo instead of assuming that any trailing "s" is plural, we should add i18n
 * and then map the database field names to their user-facing equivalents.
 */
function filterNameToString(name: FilterName): string {
  return name
}

/**
 * Converts a filter into a set of user-facing strings.
 * @example
 * // { name: 'name', condition: 'is', value: 'foo' }
 * filterToUserStrings({ name: 'name', condition: 'equals', value: 'foo' })
 * // { name: 'name', condition: 'is any of', value: 'foo, bar' }
 * filterToUserStrings({ name: 'name', condition: 'in', value: ['foo', 'bar'] })
 */
export function filterToStrings(filter: Filter): Record<keyof Filter, string> {
  return {
    id: filter.id,
    name: filterNameToString(filter.name),
    condition: filterConditionToString(
      filter.condition,
      Array.isArray(filter.value) && filter.value.length > 1,
    ),
    value: filterValueToString(filter.value),
  }
}

export function filterToString(filter: Filter): string {
  const { name, condition, value } = filterToStrings(filter)
  return `${name} ${condition} ${value}`
}
