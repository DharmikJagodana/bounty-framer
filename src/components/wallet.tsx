"use client"
import React from 'react'

import { useAccount } from 'wagmi'
import { Account } from './web3/account'
import { WalletOptions } from './web3/wallet-options'

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

export default function Wallet() {
  return (
    <div>
      <ConnectWallet />
    </div>
  )
}
