import { type PropsWithChildren, useState, useEffect } from 'react'

export function ClientOnly({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  /* eslint-disable-next-line react/jsx-no-useless-fragment */
  return mounted ? <>{children}</> : null
}
