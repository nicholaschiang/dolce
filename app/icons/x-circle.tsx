export default function XCircle({ className }: { className?: string }) {
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
      <circle cx='12' cy='12' r='10' />
      <path d='M15 9l-6 6' />
      <path d='M9 9l6 6' />
    </svg>
  );
}
