export default function Grid({ className }: { className?: string }) {
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
      <path d='M3 3h7v7H3z' />
      <path d='M14 3h7v7h-7z' />
      <path d='M14 14h7v7h-7z' />
      <path d='M3 14h7v7H3z' />
    </svg>
  );
}
