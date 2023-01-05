export default function Plus({ className }: { className?: string }) {
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
      <path d='M12 5v14' />
      <path d='M5 12h14' />
    </svg>
  );
}
