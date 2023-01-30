import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import type { Prisma } from '@prisma/client';
import type { ReactNode } from 'react';
import cn from 'classnames';
import { json } from '@remix-run/node';
import { useMemo } from 'react';

import { log } from '~/log.server';
import { prisma } from '~/db.server';

const FILTER_SEARCH_PARAM = 'f';
const JOIN_SEARCH_PARAM = 'j';

type ProductItemProps = {
  id: number;
  name: string;
  imageUrl?: string;
  msrp?: number;
};

function ProductItem({ id, name, imageUrl, msrp }: ProductItemProps) {
  return (
    <li className='shrink-0 grow-0 basis-2/12'>
      <div className='relative m-2'>
        <div className='absolute w-full'>
          <img className='absolute top-0 w-full' src={imageUrl} alt={name} />
        </div>
        <Link to={`/products/${id}`}>
          <div className='relative mb-2 border border-gray-200 pt-5/4 before:block before:w-full dark:border-gray-700' />
          <h2 className='leading-none'>{name}</h2>
          <h3>${msrp}</h3>
        </Link>
      </div>
    </li>
  );
}

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
  | Prisma.BrandListRelationFilter;

type FilterName = keyof Omit<Prisma.ProductWhereInput, 'AND' | 'OR' | 'NOT'>;
type FilterCondition<N extends FilterName> = keyof Extract<
  Prisma.ProductWhereInput[N],
  PrismaFilter
>;
type FilterValue<N extends FilterName, C extends FilterCondition<N>> = Extract<
  Prisma.ProductWhereInput[N],
  PrismaFilter
>[C];
type Filter<N extends FilterName, C extends FilterCondition<N>> = {
  name: N;
  condition: C;
  value: FilterValue<N, C>;
};

function filterToSearchParam<
  N extends FilterName,
  C extends FilterCondition<N>
>(filter: Filter<N, C>): string {
  return [
    filter.name,
    filter.condition.toString(),
    JSON.stringify(filter.value),
  ]
    .map(encodeURIComponent)
    .join(':');
}

function searchParamToFilter<
  N extends FilterName,
  C extends FilterCondition<N>
>(searchParam: string): Filter<N, C> {
  const [name, condition, value] = searchParam
    .split(':')
    .map(decodeURIComponent);
  return {
    name: name as N,
    condition: condition as C,
    value: JSON.parse(value) as FilterValue<N, C>,
  };
}

function filterToPrismaWhere<
  N extends FilterName,
  C extends FilterCondition<N>
>(filter: Filter<N, C>): Prisma.ProductWhereInput {
  return { [filter.name]: { [filter.condition]: filter.value } };
}

function FilterItemSpan({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'flex cursor-pointer items-center py-1 px-1.5 text-xs transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600',
        className
      )}
    >
      {children}
    </span>
  );
}

function FilterItem<N extends FilterName, C extends FilterCondition<N>>({
  name,
  condition,
  value,
}: Filter<N, C>) {
  return (
    <li className='mr-1.5 mb-1.5 flex flex-none items-stretch gap-px overflow-hidden rounded border border-gray-200 bg-white last:mr-0 dark:border-none dark:bg-transparent'>
      <FilterItemSpan>{name}</FilterItemSpan>
      <FilterItemSpan className='text-gray-400'>
        {condition.toString()}
      </FilterItemSpan>
      <FilterItemSpan>{JSON.stringify(value)}</FilterItemSpan>
    </li>
  );
}

export type LoaderData = { products: ProductItemProps[] };

// users can control prisma queries via url search parameters.
// Ex: /products?f=price:gt:100&f=price:lt:200&j=OR
// ... will return products with a price between 100 and 200.
export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const filters = searchParams
    .getAll(FILTER_SEARCH_PARAM)
    .map(searchParamToFilter);
  let join = searchParams.get(JOIN_SEARCH_PARAM);
  if (!join || !['AND', 'OR', 'NOT'].includes(join)) join = 'AND';
  log.debug('getting products... %o', filters);
  const products = (
    await prisma.product.findMany({
      include: { images: true },
      where: { [join]: filters.map(filterToPrismaWhere) },
    })
  ).map((product) => ({
    id: product.id,
    name: product.name,
    imageUrl: product.images[0]?.url,
    // real users don't care about cents. most reputable brands won't include
    // cents in their prices anyway. prices that do include cents are usually
    // intended to be misleading (e.g. $69.70 instead of $70).
    msrp: product.msrp ? Math.round(Number(product.msrp)) : undefined,
  }));
  log.debug('got %d products', products.length);
  return json<LoaderData>({ products });
};

export default function ProductsPage() {
  const { products } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => searchParams.getAll(FILTER_SEARCH_PARAM).map(searchParamToFilter),
    [searchParams]
  );
  return (
    <>
      <nav className='sticky top-0 z-50 border-b border-gray-200 bg-gray-100/75 px-12 py-3 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/75'>
        <ul className='mt-1.5 flex flex-wrap'>
          {filters.map((filter) => (
            <FilterItem {...filter} key={filterToSearchParam(filter)} />
          ))}
        </ul>
      </nav>
      <ol className='-m-2 flex flex-wrap px-12 py-6'>
        {products.map((product) => (
          <ProductItem {...product} key={product.id} />
        ))}
      </ol>
    </>
  );
}
