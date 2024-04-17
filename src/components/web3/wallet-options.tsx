import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  return <w3m-button />
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector
  onClick: () => void
}) {
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    ; (async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <button disabled={!ready} onClick={onClick}>
      {connector.name}
    </button>
  )
}