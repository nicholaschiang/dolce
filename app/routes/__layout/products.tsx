import * as Checkbox from '@radix-ui/react-checkbox';
import * as Portal from '@radix-ui/react-portal';
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import { useCallback, useMemo, useState } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import type { Prisma } from '@prisma/client';
import cn from 'classnames';
import { dequal } from 'dequal/lite';
import { json } from '@remix-run/node';

import { log } from '~/log.server';
import { prisma } from '~/db.server';

const FILTER_PARAM = 'f';
const JOIN_PARAM = 'j';
const STYLES = [
  'coat & jackets',
  'coat',
  'sweatshirts',
  'sweatshirt',
  'pants',
  'jeans',
  'tops',
  'shirt & blouse',
  't-shirts',
  't-shirt',
  'knitwear',
  'jumpsuit',
  'jacket',
  'belts',
  'belt',
  'swimwear',
  'bikini bottom',
  'shoes',
  'sneakers',
  'boots',
  'flats',
  'sandals',
  'other accessories',
  'hat',
  'shorts',
  'jewelry',
  'earrings',
  'bracelet',
  'necklace',
  'ring',
];

type MenuItemProps = {
  label: string;
  checked: boolean | 'indeterminate';
  setChecked(checked: boolean | 'indeterminate'): void;
};

function MenuItem({ label, checked, setChecked }: MenuItemProps) {
  return (
    <li className='relative flex h-8 w-full min-w-min max-w-xl items-center text-ellipsis whitespace-nowrap hover:after:absolute hover:after:inset-y-0 hover:after:inset-x-1 hover:after:-z-10 hover:after:rounded-md hover:after:bg-gray-400/10 hover:after:dark:bg-gray-500/10'>
      <div
        tabIndex={-1}
        role='button'
        onClick={() => setChecked(!checked)}
        onKeyDown={() => setChecked(!checked)}
        className='flex h-full flex-1 items-center overflow-hidden px-3.5'
      >
        <Checkbox.Root
          checked={checked}
          onCheckedChange={setChecked}
          className={cn(
            'mr-3 flex h-3.5 w-3.5 appearance-none items-center justify-center rounded-sm border p-0.5 outline-none transition-colors',
            !checked &&
              'border-gray-500/50 bg-transparent dark:border-gray-400/50',
            checked && 'border-indigo-500 bg-indigo-500 text-white'
          )}
        >
          <Checkbox.Indicator
            forceMount
            className={cn(
              'transition-opacity',
              checked ? 'opacity-100' : 'opacity-0'
            )}
          >
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        {label}
      </div>
    </li>
  );
}

type MenuProps = {
  position: { top: number; left: number };
  setOpen: Dispatch<SetStateAction<boolean>>;
  items: MenuItemProps[];
};

function Menu({ position, setOpen, items }: MenuProps) {
  const [filter, setFilter] = useState('');
  const results = items.filter(({ label }) => label.includes(filter.trim()));
  return (
    <Portal.Root>
      <div
        tabIndex={-1}
        role='button'
        aria-label='Close Menu'
        onClick={() => setOpen(false)}
        onKeyDown={() => setOpen(false)}
        className='fixed inset-0 z-40 flex cursor-default items-start justify-center'
      />
      <div
        className='backdrop-order dark:backdrop-order fixed z-50 mt-0.5 flex min-w-min max-w-xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-white/75 text-sm shadow backdrop-blur-md backdrop-brightness-150 backdrop-contrast-50 backdrop-saturate-200 will-change-transform dark:border-gray-700 dark:bg-gray-900/75 dark:backdrop-brightness-75 dark:backdrop-contrast-75'
        style={position}
      >
        <div
          className={cn(
            'flex items-center border-gray-200 dark:border-gray-700',
            results.length && 'border-b'
          )}
        >
          <input
            className='flex-1 appearance-none bg-transparent px-3.5 pt-2.5 pb-2 text-xs caret-indigo-500 outline-none'
            type='text'
            placeholder='Filter…'
            spellCheck='false'
            autoComplete='off'
            value={filter}
            onChange={(evt) => setFilter(evt.currentTarget.value)}
          />
          <span className='mr-3 inline-flex items-center justify-center whitespace-nowrap'>
            <kbd className='inline-block min-w-[1.0625rem] rounded bg-gray-200/50 p-0.5 text-center align-baseline text-2xs font-thin capitalize text-gray-400 dark:bg-gray-700/50 dark:text-gray-500'>
              f
            </kbd>
          </span>
        </div>
        <ul className={cn(results.length && 'py-1')}>
          {results.map((result) => (
            <MenuItem {...result} key={result.label} />
          ))}
        </ul>
      </div>
    </Portal.Root>
  );
}

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

// keyof union types will return the common keys (thus never), so we have to use
// conditional types for type params (https://stackoverflow.com/a/52221718)
type AllUnionMemberKeys<T> = T extends any ? keyof T : never;
type FilterName = AllUnionMemberKeys<
  Omit<Prisma.ProductWhereInput, 'AND' | 'OR' | 'NOT'>
>;
type FilterCondition<N extends FilterName> = AllUnionMemberKeys<
  Extract<Prisma.ProductWhereInput[N], PrismaFilter>
>;
type FilterValue<N extends FilterName, C extends FilterCondition<N>> = Extract<
  Prisma.ProductWhereInput[N],
  PrismaFilter
>[C];
type Filter<
  N extends FilterName = FilterName,
  C extends FilterCondition<N> = FilterCondition<N>
> = {
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

type FilterItemButtonProps = {
  className?: string;
  children: ReactNode;
  onClick?: (event: FormEvent<HTMLButtonElement>) => void;
};

function FilterItemButton({
  className,
  children,
  onClick,
}: FilterItemButtonProps) {
  return (
    <button
      type='button'
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center py-1 px-1.5 text-xs transition-colors hover:bg-gray-100 disabled:cursor-default dark:bg-gray-700 dark:hover:bg-gray-600',
        className
      )}
    >
      {children}
    </button>
  );
}

type FilterItemProps = { filter: Filter };

function FilterItem({ filter }: FilterItemProps) {
  return (
    <li className='mr-1.5 mb-1.5 flex flex-none items-stretch gap-px overflow-hidden rounded border border-gray-200 bg-white last:mr-0 dark:border-none dark:bg-transparent'>
      <FilterItemButton>{filter.name}</FilterItemButton>
      <FilterItemButton className='text-gray-400'>
        {filter.condition.toString()}
      </FilterItemButton>
      <FilterItemButton>{JSON.stringify(filter.value)}</FilterItemButton>
    </li>
  );
}

type CreateFilterItemProps = {
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
};

function CreateFilterItem({ filters, setFilters }: CreateFilterItemProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  return (
    <>
      <button
        type='button'
        className='flex h-6 w-6 items-center justify-center rounded text-xs text-gray-600 transition-colors hover:bg-gray-200/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
        onClick={(evt) => {
          const { top, left, height } =
            evt.currentTarget.getBoundingClientRect();
          setPosition({ top: top + height, left });
          setOpen(true);
        }}
      >
        <PlusIcon className='h-3.5 w-3.5' />
      </button>
      {open && (
        <Menu
          setOpen={setOpen}
          position={position}
          items={STYLES.map((style) => {
            const filter: Filter<'styles', 'some'> = {
              name: 'styles',
              condition: 'some',
              value: { name: style },
            };
            return {
              label: style,
              checked: filters.some((f) => dequal(f, filter)),
              setChecked(checked: boolean | 'indeterminate') {
                if (checked) {
                  setFilters((prev) => [...prev, filter]);
                } else {
                  setFilters((prev) => prev.filter((f) => !dequal(f, filter)));
                }
                setOpen(false);
              },
            };
          })}
        />
      )}
    </>
  );
}

export type LoaderData = { products: ProductItemProps[] };

// users can control prisma queries via url search parameters.
// Ex: /products?f=price:gt:100&f=price:lt:200&j=OR
// ... will return products with a price between 100 and 200.
export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const filters = searchParams.getAll(FILTER_PARAM).map(searchParamToFilter);
  let join = searchParams.get(JOIN_PARAM);
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
  const filters = useMemo<Filter[]>(
    () => searchParams.getAll(FILTER_PARAM).map(searchParamToFilter),
    [searchParams]
  );
  const setFilters = useCallback<Dispatch<SetStateAction<Filter[]>>>(
    (action: SetStateAction<Filter[]>) => {
      setSearchParams((prevSearchParams) => {
        let nextFilters: Filter[];
        if (typeof action === 'function') {
          const prevFilters = prevSearchParams
            .getAll(FILTER_PARAM)
            .map(searchParamToFilter);
          nextFilters = action(prevFilters);
        } else {
          nextFilters = action;
        }
        const nextSearchParams = new URLSearchParams(prevSearchParams);
        nextSearchParams.delete(FILTER_PARAM);
        nextFilters.forEach((filter) =>
          nextSearchParams.append(FILTER_PARAM, filterToSearchParam(filter))
        );
        return nextSearchParams;
      });
    },
    [setSearchParams]
  );
  return (
    <>
      <nav className='sticky top-0 z-30 border-b border-gray-200 bg-gray-100/75 px-12 py-3 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800/75'>
        <ul className='mt-1.5 flex flex-wrap'>
          {filters.map((filter) => (
            <FilterItem filter={filter} key={filterToSearchParam(filter)} />
          ))}
          <CreateFilterItem filters={filters} setFilters={setFilters} />
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
