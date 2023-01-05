export default function Sidebar({ className }: { className?: string }) {
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
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <path d='M9 3v18' />
    </svg>
  );
}
