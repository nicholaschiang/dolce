import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback,
} from 'components/ui/avatar'

type Source = { name: string; avatar?: string | null }

export function Avatar({ src }: { src?: Source | null }) {
  return (
    <AvatarRoot>
      <AvatarImage src={src?.avatar ?? undefined} alt={src?.name} />
      <AvatarFallback>
        {src?.name
          .split(' ')
          .slice(0, 2)
          .map((s) => s.substring(0, 1))
          .join('')
          .toUpperCase()}
      </AvatarFallback>
    </AvatarRoot>
  )
}
