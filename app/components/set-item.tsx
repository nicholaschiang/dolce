import { ImageItem } from 'components/image-item'

import { type SetItem as SetItemT } from 'utils/set'

export function SetItem({ item }: { item: SetItemT }) {
  return <ImageItem to={item.url} image={item.images[0]?.url} />
}
