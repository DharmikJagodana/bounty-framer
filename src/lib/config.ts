import { transactionType } from 'viem'

let host = process.env.NEXT_PUBLIC_HOST || process.env.VERCEL_URL || 'http://localhost:3000'

if (!host) {
  throw new Error('No host provided')
}

if (!host.startsWith('http')) {
  host = 'https://' + host
}
console.log('host', host)

function removeTrailingSlash(str: string) {
  return str.replace(/\/$/, '')
}

host = removeTrailingSlash(host)

export const config = {
  host: host,
  hostname: new URL(host).hostname,
  farcasterHub: {
    url: 'https://nemes.farcaster.xyz:2281'
  }
}

const serverUrl = config.host

export const assets = {
  nft: `${serverUrl}/img/nft.png`,
  minted: `${serverUrl}/img/minted-nft.png`,
  transaction_wait: `${serverUrl}/img/transaction-wait.png`,
  error: {
    alreadyMinted: `${serverUrl}/img/already-minted.png`,
    walletNotConnected: `${serverUrl}/img/wallet-not-connected.png`,
    notFollowing: `${serverUrl}/img/not-following.png`,
    notRecasted: `${serverUrl}/img/not-recasted.png`,
  }
}