import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export function loader() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 32,
          fontWeight: 400,
        }}
      >
        <img
          alt=''
          src='https://nicholas.engineering/favicon.png'
          width={50}
          height={50}
        />
        <div>nicholas.engineering</div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    },
  )
}
