'use client'

import { config, projectId } from '@/web3/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { type State, WagmiProvider } from 'wagmi'
import { createWeb3Modal } from '@web3modal/wagmi/react'

type Props = {
  children: ReactNode,
  initialState: State | undefined,
}

const queryClient = new QueryClient()

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Providers({ children, initialState }: Props) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

