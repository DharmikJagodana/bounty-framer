import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image(
  { params }: { params: { time: string } }
) {
  // Font


  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 64,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <p>Already Minted</p>
          <p>
            <span>
              Come back in {params.time} hours
            </span>
          </p>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          fontSize: 34,
          textAlign: 'center',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.1)',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          Meanwhile you can share this page with your friends
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}