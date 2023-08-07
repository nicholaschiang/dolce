import * as React from 'react'

export const Italy = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
    height='1em'
    width='1em'
    ref={ref}
    {...props}
  >
    <g fillRule='evenodd' strokeWidth='1pt'>
      <path fill='#fff' d='M0 0h512v512H0z' />
      <path fill='#009246' d='M0 0h170.7v512H0z' />
      <path fill='#ce2b37' d='M341.3 0H512v512H341.3z' />
    </g>
  </svg>
))
