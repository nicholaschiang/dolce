import type { ComponentPropsWithoutRef } from 'react'

import { OPTIMIZE_IMAGES } from 'utils/general'

export function Image({
  optimizerUrl = '/image',
  responsive,
  src,
  alt,
  preload,
  ...etc
}: ComponentPropsWithoutRef<'img'> & {
  src: string
  optimizerUrl?: string
  responsive?: { maxWidth: number; size: { width: number } }[]
  preload?: boolean
}) {
  if (!OPTIMIZE_IMAGES) return <img alt={alt ?? ''} src={src} {...etc} />

  const url = `${optimizerUrl}?url=${encodeURIComponent(src)}`
  const props: ComponentPropsWithoutRef<'img'> = {
    src: `${url}&w=${etc.width ?? ''}&q=75`,
  }

  let largestImageWidth = 0
  let largestImageSrc: string | undefined
  if (responsive && responsive.length) {
    let srcSet = ''
    let sizes = ''
    responsive
      .sort((a, b) => a.maxWidth - b.maxWidth)
      .forEach(({ maxWidth, size }, index) => {
        // TODO perhaps add double the width to the `srcSet` for displays that
        // have double the pixel density (e.g. Apple retina displays).
        if (srcSet) srcSet += ', '
        const srcSetUrl = `${url}&w=${size.width}&q=75 ${size.width}w`
        srcSet += srcSetUrl

        if (sizes) sizes += ', '
        if (index === 0) sizes += `(max-width: ${maxWidth}px) ${size.width}px`
        else {
          const minWidth = responsive[index - 1].maxWidth
          sizes += `((min-width: ${minWidth}px) and (max-width: ${maxWidth}px)) ${size.width}px`
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

  if (largestImageSrc && (!etc.width || largestImageWidth > Number(etc.width)))
    props.src = largestImageSrc

  return (
    <>
      <img alt={alt ?? ''} {...etc} {...props} />
      {preload && (
        <link
          rel='preload'
          as='image'
          href={props.src}
          imageSrcSet={props.srcSet}
          imageSizes={props.sizes}
        />
      )}
    </>
  )
}
