export default function Database({ className }: { className?: string }) {
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
      <ellipse cx='12' cy='5' rx='9' ry='3' />
      <path d='M21 12c0 1.66-4 3-9 3s-9-1.34-9-3' />
      <path d='M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5' />
    </svg>
  );
}
