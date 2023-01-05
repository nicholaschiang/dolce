export default function MoreVertical({ className }: { className?: string }) {
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
      <circle cx='12' cy='12' r='1' fill='currentColor' />
      <circle cx='12' cy='5' r='1' fill='currentColor' />
      <circle cx='12' cy='19' r='1' fill='currentColor' />
    </svg>
  );
}
