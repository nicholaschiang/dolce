import type { Prisma } from '@prisma/client'

// i tried to use a custom (Objectify<T> = T extends object ? T : never) type
// but it didn't work for filtering decimal fields (where Decimal is an object).
type PrismaFilter =
  | Prisma.IntFilter
  | Prisma.StringFilter
  | Prisma.EnumLevelFilter
  | Prisma.SizeListRelationFilter
  | Prisma.VariantListRelationFilter
  | Prisma.DecimalNullableFilter
  | Prisma.PriceListRelationFilter
  | Prisma.VideoListRelationFilter
  | Prisma.ImageListRelationFilter
  | Prisma.DateTimeFilter
  | Prisma.StyleListRelationFilter
  | Prisma.CollectionListRelationFilter
  | Prisma.DesignerListRelationFilter
  | Prisma.BrandListRelationFilter

// keyof union types will return the common keys (thus never), so we have to use
// conditional types for type params (https://stackoverflow.com/a/52221718)
type AllUnionMemberKeys<T> = T extends any ? keyof T : never

export type FilterName = AllUnionMemberKeys<
  Omit<Prisma.ProductWhereInput, 'AND' | 'OR' | 'NOT'>
>

export type FilterCondition<N extends FilterName = FilterName> =
  AllUnionMemberKeys<Extract<Prisma.ProductWhereInput[N], PrismaFilter>>

export type FilterValue<
  N extends FilterName = FilterName,
  C extends FilterCondition<N> = FilterCondition<N>,
> = Extract<Prisma.ProductWhereInput[N], PrismaFilter>[C]

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

export function searchParamToFilter<
  N extends FilterName,
  C extends FilterCondition<N>,
>(searchParam: string): Filter<N, C> {
  const [id, name, condition, value] = searchParam
    .split(':')
    .map(decodeURIComponent)
  return {
    id,
    name: name as N,
    condition: condition as C,
    value: JSON.parse(value) as FilterValue<N, C>,
  }
}

export function filterToPrismaWhere<
  N extends FilterName,
  C extends FilterCondition<N>,
>(filter: Filter<N, C>): Prisma.ProductWhereInput {
  return { [filter.name]: { [filter.condition]: filter.value } }
}
