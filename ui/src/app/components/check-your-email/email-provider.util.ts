/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import emailProvidersData from '../../data/email-providers.json';

export interface EmailProvider {
  provider_name: string;
  primary_webmail_login_urls: string[];
  [key: string]: any;
}

/**
 * Build a domain-to-provider map from the email providers data
 * Extracts domains from provider names and alternate login domains
 */
function buildProviderDomainMap(): Map<string, EmailProvider> {
  const domainMap = new Map<string, EmailProvider>();
  
  // Define domain patterns for known providers
  const providerDomainPatterns: Record<string, string[]> = {
    Gmail: ['gmail.com', 'googlemail.com', 'google.com'],
    'Outlook.com': ['outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'outlook.in'],
    'Yahoo Mail': ['yahoo.com', 'ymail.com', 'rocketmail.com', 'yahoo.co.jp', 'yahoo.ru', 'yahoo.fr'],
    'iCloud Mail': ['icloud.com', 'me.com', 'mac.com'],
    'AOL Mail': ['aol.com'],
    'Proton Mail': ['proton.me', 'protonmail.com'],
    'Zoho Mail': ['zoho.com', 'zohomail.com'],
    'GMX Mail': ['gmx.com', 'gmx.us', 'gmx.de', 'gmx.net', 'gmx.at', 'gmx.ch'],
    'Mail.com': ['mail.com'],
    'Fastmail': ['fastmail.com'],
    'Tuta Mail': ['tuta.com', 'tutanota.com'],
    'Yandex Mail': ['yandex.com', 'yandex.ru', 'yandex.ua', 'yandex.kz'],
    'Mail.ru': ['mail.ru', 'bk.ru', 'list.ru', 'inbox.ru'],
    'WEB.DE Mail': ['web.de'],
    'T-Online Mail': ['t-online.de'],
    'Rambler Mail': ['rambler.ru'],
    'QQ Mail': ['qq.com'],
    '163 Mail': ['163.com'],
    '126 Mail': ['126.com'],
    'Sina Mail': ['sina.com', 'sina.cn'],
    'Naver Mail': ['naver.com'],
    'Daum Mail': ['daum.net', 'hanmail.net'],
    'Hushmail': ['hushmail.com'],
    'BT Mail': ['btinternet.com', 'btopenworld.com'],
    'Virgin Media Mail': ['virginmedia.com', 'ntlworld.com'],
    'Telstra Mail': ['telstra.com.au'],
    'Rogers Webmail': ['rogers.com'],
    'Xfinity Email': ['comcast.net', 'xfinity.com'],
    "AT&T Mail": ['att.net', 'sbcglobal.net', 'bellsouth.net', 'pacbell.net'],
    'Charter Spectrum': ['spectrum.net', 'charter.net', 'twc.com', 'rr.com'],
    'IONOS Webmail': ['ionos.com'],
    'OVHcloud Webmail': ['ovh.net'],
    'GoDaddy Webmail': ['godaddy.com'],
    'Rackspace Webmail': ['rackspace.com']
  };
  
  emailProvidersData.forEach((provider: any) => {
    const domainsSet = new Set<string>();
    
    // Check if this provider matches any of our known patterns
    for (const [patternProvider, domains] of Object.entries(providerDomainPatterns)) {
      if (provider.provider_name === patternProvider) {
        domains.forEach(d => domainsSet.add(d.toLowerCase()));
        break;
      }
    }
    
    // Also extract from alternate_login_domains_or_regional_variants if they look like domains
    if (provider.alternate_login_domains_or_regional_variants && Array.isArray(provider.alternate_login_domains_or_regional_variants)) {
      provider.alternate_login_domains_or_regional_variants.forEach((url: string) => {
        if (url && url !== 'unspecified' && url.includes('.')) {
          // Try to extract domain from URL
          try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '').toLowerCase();
            // Only add if it looks like a domain (not too long, has at least one dot)
            if (hostname.includes('.') && hostname.split('.').length <= 3 && !hostname.includes('mail.') && !hostname.includes('app.')) {
              domainsSet.add(hostname);
            }
          } catch {
            // Ignore invalid URLs
          }
        }
      });
    }
    
    // Register all domains for this provider
    domainsSet.forEach(domain => {
      domainMap.set(domain, provider);
    });
  });
  
  return domainMap;
}

// Build the domain map once
const PROVIDER_DOMAIN_MAP = buildProviderDomainMap();

export function extractDomain(email: string): string {
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) {
    return '';
  }
  return email.slice(atIndex + 1).trim().toLowerCase();
}

export function findProviderLoginUrl(email: string): string | null {
  const domain = extractDomain(email);
  if (!domain) {
    return null;
  }

  const provider = PROVIDER_DOMAIN_MAP.get(domain);
  
  if (!provider || !provider.primary_webmail_login_urls || provider.primary_webmail_login_urls.length === 0) {
    return null;
  }

  // Return the first primary webmail login URL
  return provider.primary_webmail_login_urls[0] ?? null;
}
