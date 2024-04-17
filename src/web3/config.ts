import {
  http, cookieStorage,
  createStorage
} from 'wagmi'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { base, baseSepolia } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID!

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  chains: [base, baseSepolia],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  connectors: [
    walletConnect({ projectId }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})


