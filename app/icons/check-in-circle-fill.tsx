export default function CheckInCircleFill({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
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
      <path
        d='M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z'
        fill='currentColor'
        stroke='currentColor'
      />
      <path
        d='M8 11.8571L10.5 14.3572L15.8572 9'
        fill='none'
        className='stroke-white dark:stroke-gray-900'
      />
    </svg>
  );
}
