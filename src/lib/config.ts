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
}