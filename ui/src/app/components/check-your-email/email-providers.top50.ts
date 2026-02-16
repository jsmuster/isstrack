/**
 * c Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
export type EmailProvider = {
  name: string
  domains: string[]
  loginUrl: string
}

export const TOP_EMAIL_PROVIDERS: EmailProvider[] = [
  { name: 'Gmail', domains: ['gmail.com'], loginUrl: 'https://mail.google.com/' },
  { name: 'Outlook', domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'], loginUrl: 'https://outlook.live.com/mail/' },
  { name: 'Yahoo', domains: ['yahoo.com', 'ymail.com', 'rocketmail.com'], loginUrl: 'https://mail.yahoo.com/' },
  { name: 'iCloud', domains: ['icloud.com', 'me.com', 'mac.com'], loginUrl: 'https://www.icloud.com/mail' },
  { name: 'Zoho', domains: ['zoho.com', 'zohomail.com'], loginUrl: 'https://mail.zoho.com/' },
  { name: 'Proton', domains: ['proton.me', 'protonmail.com'], loginUrl: 'https://mail.proton.me/' },
  { name: 'AOL', domains: ['aol.com'], loginUrl: 'https://mail.aol.com/' },
  { name: 'GMX', domains: ['gmx.com', 'gmx.us', 'gmx.de', 'gmx.net', 'gmx.co.uk'], loginUrl: 'https://www.gmx.com/' },
  { name: 'Mail.com', domains: ['mail.com'], loginUrl: 'https://www.mail.com/' },
  { name: 'Fastmail', domains: ['fastmail.com'], loginUrl: 'https://app.fastmail.com/mail/' },
  { name: 'Yandex', domains: ['yandex.com', 'yandex.ru', 'yandex.ua', 'yandex.kz'], loginUrl: 'https://mail.yandex.com/' },
  { name: 'Tutanota', domains: ['tutanota.com', 'tuta.com'], loginUrl: 'https://mail.tutanota.com/' },
  { name: 'Mail.ru', domains: ['mail.ru', 'bk.ru', 'list.ru', 'inbox.ru'], loginUrl: 'https://mail.ru/' },
  { name: 'Comcast', domains: ['comcast.net'], loginUrl: 'https://connect.xfinity.com/appsuite' },
  { name: 'Verizon', domains: ['verizon.net'], loginUrl: 'https://webmail.verizon.net/' },
  { name: 'AT&T', domains: ['att.net', 'sbcglobal.net', 'bellsouth.net', 'pacbell.net', 'swbell.net', 'ameritech.net'], loginUrl: 'https://currently.att.yahoo.com/' },
  { name: 'Cox', domains: ['cox.net'], loginUrl: 'https://www.cox.com/' },
  { name: 'Charter', domains: ['charter.net', 'spectrum.net', 'twc.com', 'rr.com'], loginUrl: 'https://webmail.spectrum.net/' },
  { name: 'BT', domains: ['btinternet.com', 'btopenworld.com'], loginUrl: 'https://mail.btinternet.com/' },
  { name: 'Virgin Media', domains: ['virginmedia.com', 'ntlworld.com'], loginUrl: 'https://mail.virginmedia.com/' },
  { name: 'Orange', domains: ['orange.fr', 'wanadoo.fr'], loginUrl: 'https://mail.orange.fr/' },
  { name: 'Free', domains: ['free.fr'], loginUrl: 'https://webmail.free.fr/' },
  { name: 'SFR', domains: ['sfr.fr', 'neuf.fr'], loginUrl: 'https://webmail.sfr.fr/' },
  { name: 'Laposte', domains: ['laposte.net'], loginUrl: 'https://www.laposte.net/' },
  { name: 'T-Online', domains: ['t-online.de'], loginUrl: 'https://email.t-online.de/' },
  { name: 'Gmx.de', domains: ['gmx.de'], loginUrl: 'https://www.gmx.net/' },
  { name: 'Web.de', domains: ['web.de'], loginUrl: 'https://web.de/' },
  { name: 'Seznam', domains: ['seznam.cz'], loginUrl: 'https://email.seznam.cz/' },
  { name: 'Naver', domains: ['naver.com'], loginUrl: 'https://mail.naver.com/' },
  { name: 'Daum', domains: ['daum.net', 'hanmail.net'], loginUrl: 'https://mail.daum.net/' },
  { name: 'QQ Mail', domains: ['qq.com'], loginUrl: 'https://mail.qq.com/' },
  { name: '163', domains: ['163.com'], loginUrl: 'https://mail.163.com/' },
  { name: '126', domains: ['126.com'], loginUrl: 'https://mail.126.com/' },
  { name: 'Sina', domains: ['sina.com', 'sina.cn'], loginUrl: 'https://mail.sina.com.cn/' },
  { name: 'Yeah', domains: ['yeah.net'], loginUrl: 'https://mail.yeah.net/' },
  { name: 'Hushmail', domains: ['hushmail.com'], loginUrl: 'https://www.hushmail.com/' },
  { name: 'Outlook India', domains: ['outlook.in'], loginUrl: 'https://outlook.live.com/mail/' },
  { name: 'Sky', domains: ['sky.com'], loginUrl: 'https://skyid.sky.com/' },
  { name: 'Mail.ee', domains: ['mail.ee', 'inbox.lv', 'apollo.lv'], loginUrl: 'https://mail.ee/' },
  { name: 'Gmail for Work', domains: ['googlemail.com'], loginUrl: 'https://mail.google.com/' },
  { name: 'Hey', domains: ['hey.com'], loginUrl: 'https://app.hey.com/' },
  { name: 'Runbox', domains: ['runbox.com'], loginUrl: 'https://runbox.com/webmail' },
  { name: 'Posteo', domains: ['posteo.de'], loginUrl: 'https://posteo.de/' },
  { name: 'Mailbox.org', domains: ['mailbox.org'], loginUrl: 'https://mailbox.org/' },
  { name: 'Riseup', domains: ['riseup.net'], loginUrl: 'https://mail.riseup.net/' },
  { name: 'StartMail', domains: ['startmail.com'], loginUrl: 'https://mail.startmail.com/' },
  { name: 'QQ Mail (Foxmail)', domains: ['foxmail.com'], loginUrl: 'https://mail.qq.com/' },
  { name: 'Mailfence', domains: ['mailfence.com'], loginUrl: 'https://mailfence.com/' },
  { name: 'Yahoo Japan', domains: ['yahoo.co.jp'], loginUrl: 'https://mail.yahoo.co.jp/' }
]
