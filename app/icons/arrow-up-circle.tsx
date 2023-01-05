export default function ArrowUpCircle({ className }: { className?: string }) {
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
      <path d='M16 12l-4-4-4 4' />
      <path d='M12 16V8' />
    </svg>
  );
}
