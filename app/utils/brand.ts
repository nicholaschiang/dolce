import { type Brand } from '@prisma/client'
import { type Organization } from 'schema-dts'

import { type Serialize, url } from 'utils'

export function getBrandSchema(brand: Serialize<Brand>): Organization {
  return {
    '@type': 'Organization',
    '@id': brand.id.toString(),
    'name': brand.name,
    'image': url(brand.avatar),
    'sameAs': url(brand.url),
  }
}
