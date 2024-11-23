import { type Brand } from '@prisma/client'

import { type Serialize } from 'utils/general'

export function getBrandName(product: Serialize<{ brands: Brand[] }>) {
  return product.brands.map((b) => b.name).join(' x ')
}
