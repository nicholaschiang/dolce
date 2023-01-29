import { Link, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import { log } from '~/log.server';
import { prisma } from '~/db.server';

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
          <h2>{name}</h2>
          <h3>${msrp}</h3>
        </Link>
      </div>
    </li>
  );
}

export type LoaderData = { products: ProductItemProps[] };

export const loader: LoaderFunction = async () => {
  log.debug('getting products...');
  const products = (
    await prisma.product.findMany({
      include: { images: true },
      where: { images: { some: {} } },
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
  return (
    <ol className='-m-2 flex flex-wrap'>
      {products.map((product) => (
        <ProductItem {...product} key={product.id} />
      ))}
    </ol>
  );
}
