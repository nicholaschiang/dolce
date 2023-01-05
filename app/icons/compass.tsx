export default function Compass({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill='none'
      height='24'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      viewBox='0 0 24 24'
      width='24'
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        className='text-gray-900 dark:text-gray-100'
      />
      <path
        d='M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'
        className='text-primary'
      />
    </svg>
  );
}
