import type { ComponentPropsWithoutRef } from 'react'

export function Image({
  optimizerUrl = '/image',
  responsive,
  src,
  alt,
  ...rest
}: ComponentPropsWithoutRef<'img'> & {
  src: string
  optimizerUrl?: string
  responsive?: { maxWidth?: number; size: { width: number } }[]
}) {
  const url = `${optimizerUrl}?url=${encodeURIComponent(src)}`
  const props: ComponentPropsWithoutRef<'img'> = {
    src: `${url}&w=${rest.width ?? ''}&q=75`,
  }

  let largestImageWidth = 0
  let largestImageSrc: string | undefined
  if (responsive && responsive.length) {
    let srcSet = ''
    let sizes = ''
    responsive.forEach(({ maxWidth, size }) => {
      if (srcSet) {
        srcSet += ', '
      }
      const srcSetUrl = `${url}&w=${size.width}&q=75 ${size.width}w`
      srcSet += srcSetUrl

      if (maxWidth) {
        if (sizes) {
          sizes += ', '
        }
        sizes += `(max-width: ${maxWidth}px) ${size.width}px`
      }

      if (size.width > largestImageWidth) {
        largestImageWidth = size.width
        largestImageSrc = srcSetUrl
      }
    })
    props.srcSet = srcSet
    props.sizes = sizes || '100vw'
    props.src = ''
  }

  if (largestImageSrc && (!rest.width || largestImageWidth > rest.width))
    props.src = largestImageSrc

  return <img alt={alt ?? ''} {...rest} {...props} />
}
