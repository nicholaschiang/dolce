import { getBrandsFromNeimanMarcus } from './neiman-marcus.mjs';

export async function main() {
  const brands = await getBrandsFromNeimanMarcus();
  console.log(brands);
}

void main();
