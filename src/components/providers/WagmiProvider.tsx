"use client"

import { config } from '@/web3/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
interface IProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function Web3Provider(
  { children }: IProps
) {
  const initialState = cookieToInitialState(
    config,
    headers().get('cookie')
  )
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
