import { type Look, type Image } from '@prisma/client'
import { type CreativeWork } from 'schema-dts'

import { type Serialize, url } from 'utils'

export function getLookSchema(
  look: Serialize<Look & { images: Image[] }>,
): CreativeWork {
  return {
    '@type': 'CreativeWork',
    '@id': look.id.toString(),
    'name': `Look ${look.number}`,
    'image': look.images.map((image) => url(image.url)),
  }
}
