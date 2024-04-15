import React from 'react'

interface MaxWidthWrapperProps {
  children: React.ReactNode;
}

export default function MaxWidthWrapper(
  { children }: MaxWidthWrapperProps
) {
  return (
    <div className='max-w-6xl'>
      {children}
    </div>
  )
}
