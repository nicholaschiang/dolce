import { type User } from '@prisma/client'
import { type Person } from 'schema-dts'

import { type Serialize, url } from 'utils'

/**
 * Get the user Schema.org `application/ld+json` compatible representation.
 * @todo fill this out more completely (e.g. add publications, brands, etc).
 */
export function getUserSchema(user: Serialize<User>): Person {
  return {
    '@type': 'Person',
    '@id': user.id.toString(),
    'name': user.name,
    'image': url(user.avatar),
    'sameAs': url(user.url),
  }
}
