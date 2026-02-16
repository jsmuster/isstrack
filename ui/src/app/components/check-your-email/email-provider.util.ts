import { TOP_EMAIL_PROVIDERS } from './email-providers.top50'

export function extractDomain(email: string): string {
  const atIndex = email.lastIndexOf('@')
  if (atIndex === -1) {
    return ''
  }
  return email.slice(atIndex + 1).trim().toLowerCase()
}

export function findProviderLoginUrl(email: string): string | null {
  const domain = extractDomain(email)
  if (!domain) {
    return null
  }

  const provider = TOP_EMAIL_PROVIDERS.find((entry) =>
    entry.domains.some((entryDomain) => entryDomain.toLowerCase() === domain)
  )

  return provider?.loginUrl ?? null
}
