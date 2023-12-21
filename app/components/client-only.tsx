import { type PropsWithChildren, useState, useEffect } from 'react'

export function ClientOnly({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted ? <>{children}</> : null
}
