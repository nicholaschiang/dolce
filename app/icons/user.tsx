export default function User({ className }: { className?: string }) {
  return (
    <svg
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
      className={className}
    >
      <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  );
}
