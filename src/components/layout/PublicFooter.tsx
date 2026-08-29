import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Facebook, Mail, CreditCard } from 'lucide-react'
import Logo from '@/components/layout/Logo'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useLanguage } from '@/context/LanguageContext'
import { paymentMethods, PaymentBadge } from '@/components/marketing/PaymentLogos'

const columns = [
  {
    titleKey: 'footer.product',
    links: [
      { key: 'nav.solutions', to: '/solutions' },
      { key: 'nav.features', to: '/features' },
      { key: 'nav.pricing', to: '/pricing' },
      { key: 'nav.security', to: '/security' },
    ],
  },
  {
    titleKey: 'footer.company',
    links: [
      { key: 'nav.about', to: '/about' },
      { key: 'nav.contact', to: '/contact' },
      { key: 'nav.login', to: '/login' },
      { key: 'footer.signup', to: '/signup' },
    ],
  },
  {
    titleKey: 'footer.platform',
    links: [
      { key: 'footer.adminDashboard', to: '/signup' },
      { key: 'footer.teacherPortal', to: '/signup' },
      { key: 'footer.parentApp', to: '/signup' },
    ],
  },
  {
    titleKey: 'footer.legal',
    links: [
      { key: 'footer.privacy', to: '/privacy' },
      { key: 'footer.terms', to: '/terms' },
      { key: 'footer.cookies', to: '/cookies' },
    ],
  },
]

export default function PublicFooter() {
  const { t } = useLanguage()

  return (
    <footer className="bg-[#0B0B0D] text-white">
      <div className="border-b border-white/10 py-10">
        <div className="mb-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{t('footer.payments')}</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0B0B0D] to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0B0B0D] to-transparent sm:w-32" />
          <div className="flex w-max animate-marquee-slow items-center gap-4 [animation-duration:38s]">
            {[...paymentMethods, ...paymentMethods].map((m, i) => (
              <PaymentBadge key={`${m.name}-${i}`} method={m} />
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">{t('footer.tagline')}</p>
            <div className="mt-6 flex items-center gap-3">
              {[Twitter, Linkedin, Facebook, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-brand hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.titleKey}>
              <h4 className="text-sm font-semibold text-white">{t(col.titleKey)}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link to={link.to} className="link-underline text-sm text-white/50 hover:text-white">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Nom Cloud. {t('footer.rights')}</p>
          <div className="flex items-center gap-4">
            <p className="hidden items-center gap-1.5 text-xs text-white/40 sm:flex">
              <CreditCard className="h-3.5 w-3.5" /> {t('footer.tagline2')}
            </p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span className="hidden sm:inline">{t('footer.language')}:</span>
              <LanguageSwitcher className="[&_button]:text-white/70 [&_button:hover]:text-white [&_button:hover]:bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
