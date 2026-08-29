import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Minus, Users, Wallet, Building2, Sparkles } from 'lucide-react'
import SEO from '@/components/layout/SEO'
import Reveal from '@/components/marketing/Reveal'
import FaqAccordion from '@/components/marketing/FaqAccordion'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

const planDefs = [
  { name: 'Starter', prefix: 'pricing.starter', monthly: 149, annual: 119, highlight: false, features: ['f1', 'f2', 'f3', 'f4', 'f5'] },
  { name: 'Growth', prefix: 'pricing.growth', monthly: 349, annual: 279, highlight: true, features: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'] },
  { name: 'Enterprise', prefix: 'pricing.enterprise', monthly: null as number | null, annual: null as number | null, highlight: false, features: ['f1', 'f2', 'f3', 'f4', 'f5'] },
]

const comparisonCategories: {
  icon: typeof Users
  prefix: string
  tint: string
  rows: { key: string; starter: boolean | 'support'; growth: boolean | 'support'; enterprise: boolean | 'support' }[]
}[] = [
  {
    icon: Users,
    prefix: 'pricing.cat1',
    tint: '#0071E3',
    rows: [
      { key: 'row1', starter: true, growth: true, enterprise: true },
      { key: 'row2', starter: true, growth: true, enterprise: true },
      { key: 'row3', starter: true, growth: true, enterprise: true },
    ],
  },
  {
    icon: Wallet,
    prefix: 'pricing.cat2',
    tint: '#FF5A1F',
    rows: [
      { key: 'row1', starter: false, growth: true, enterprise: true },
      { key: 'row2', starter: false, growth: true, enterprise: true },
      { key: 'row3', starter: false, growth: true, enterprise: true },
    ],
  },
  {
    icon: Building2,
    prefix: 'pricing.cat3',
    tint: '#A855F7',
    rows: [
      { key: 'row1', starter: false, growth: false, enterprise: true },
      { key: 'row2', starter: false, growth: false, enterprise: true },
      { key: 'row3', starter: 'support', growth: 'support', enterprise: 'support' },
    ],
  },
]

const faqNums = ['1', '2', '3', '4', '5', '6', '7', '8']

function formatUSD(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export default function Pricing() {
  const { t } = useLanguage()
  const [annual, setAnnual] = useState(true)
  const faqs = faqNums.map((n) => ({ q: t(`pricing.faq.q${n}`), a: t(`pricing.faq.a${n}`) }))
  const supportLabels = { starter: t('pricing.support.email'), growth: t('pricing.support.priority'), enterprise: t('pricing.support.sla') }

  return (
    <div>
      <SEO
        title="Pricing — Simple Plans for Every School"
        description="No per-user fees, no hidden costs. Compare Nom Cloud's Starter, Growth and Enterprise plans, billed in USD."
        path="/pricing"
      />
      <section className="pt-20 pb-12 sm:pt-28">
        <div className="container text-center">
          <Reveal>
            <span className="eyebrow">{t('pricing.eyebrow')}</span>
            <h1 className="mx-auto mt-6 max-w-3xl text-display-lg text-ink dark:text-white">{t('pricing.title')}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite">{t('pricing.subtitle')}</p>
          </Reveal>
          <Reveal delay={120} className="mt-10 inline-flex items-center gap-3 rounded-full bg-ink/5 p-1.5 dark:bg-white/10">
            <button
              onClick={() => setAnnual(false)}
              className={cn('rounded-full px-5 py-2 text-sm font-medium transition-all', !annual ? 'bg-white shadow-soft dark:bg-white/10' : 'text-graphite')}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn('rounded-full px-5 py-2 text-sm font-medium transition-all', annual ? 'bg-white shadow-soft dark:bg-white/10' : 'text-graphite')}
            >
              {t('pricing.annual')} <span className="text-emerald-600">{t('pricing.save')}</span>
            </button>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="container grid gap-6 lg:grid-cols-3">
          {planDefs.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-3xl p-8',
                  plan.highlight ? 'border-2 border-brand bg-white shadow-floaty dark:bg-[#161618]' : 'card',
                )}
              >
                {plan.highlight && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    {t('pricing.mostPopular')}
                  </span>
                )}
                <h3 className="text-xl font-semibold text-ink dark:text-white">{plan.name}</h3>
                <p className="mt-1.5 text-sm text-graphite">{t(`${plan.prefix}.tagline`)}</p>
                <div className="mt-6">
                  {plan.monthly ? (
                    <>
                      <span className="text-4xl font-semibold tracking-tight text-ink dark:text-white">
                        {formatUSD(annual ? plan.annual! : plan.monthly)}
                      </span>
                      <span className="text-sm text-graphite"> {t('pricing.perMonth')}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-semibold tracking-tight text-ink dark:text-white">{t('pricing.custom')}</span>
                  )}
                </div>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink dark:text-white">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                      {t(`${plan.prefix}.${f}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.monthly ? '/signup' : '/contact'}
                  className={cn('mt-8 w-full justify-center py-3.5 text-sm', plan.highlight ? 'btn-accent' : 'btn-outline')}
                >
                  {plan.monthly ? t('pricing.getStarted') : t('pricing.contactSales')}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section overflow-hidden bg-white dark:bg-white/[0.02]">
        <div className="container">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> {t('pricing.compare.eyebrow')}
            </span>
            <h2 className="mt-5 text-display-md text-ink dark:text-white">{t('pricing.compare.title')}</h2>
            <p className="mt-4 text-base text-graphite">{t('pricing.compare.subtitle')}</p>
          </Reveal>

          <Reveal delay={100} className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:mt-14">
            {planDefs.map((p) => (
              <div key={p.name} className="rounded-2xl bg-mist py-3 text-center dark:bg-white/[0.04]">
                <p className="text-sm font-semibold text-ink dark:text-white">{p.name}</p>
              </div>
            ))}
          </Reveal>

          <div className="mt-4 space-y-6">
            {comparisonCategories.map((cat, ci) => (
              <Reveal key={cat.prefix} delay={ci * 120}>
                <div className="group relative overflow-hidden rounded-[1.75rem] border border-ink/5 bg-white shadow-soft dark:border-white/10 dark:bg-[#161618]">
                  <div className="pointer-events-none absolute inset-0 -translate-x-full animate-scan-x bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 dark:via-white/10" />
                  <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
                    <div className="flex items-center gap-3 sm:w-56 sm:flex-shrink-0">
                      <div className="rounded-2xl p-3" style={{ backgroundColor: `${cat.tint}1A`, color: cat.tint }}>
                        <cat.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-ink dark:text-white">{t(`${cat.prefix}.title`)}</h3>
                    </div>
                    <div className="flex-1 space-y-3">
                      {cat.rows.map((row) => (
                        <div key={row.key} className="grid grid-cols-4 items-center gap-2 rounded-xl bg-mist px-4 py-3 text-sm dark:bg-white/[0.03]">
                          <span className="col-span-1 font-medium text-ink dark:text-white">{t(`${cat.prefix}.${row.key}`)}</span>
                          {[row.starter, row.growth, row.enterprise].map((cell, i) => (
                            <span key={i} className="flex items-center justify-center">
                              {cell === 'support' ? (
                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink shadow-sm dark:bg-white/10 dark:text-white">
                                  {i === 0 ? supportLabels.starter : i === 1 ? supportLabels.growth : supportLabels.enterprise}
                                </span>
                              ) : cell ? (
                                <Check className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Minus className="h-4 w-4 text-graphite/30" />
                              )}
                            </span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl">
          <Reveal className="text-center">
            <span className="eyebrow">{t('pricing.faq.eyebrow')}</span>
            <h2 className="mt-5 text-display-md text-ink dark:text-white">{t('pricing.faq.title')}</h2>
          </Reveal>
          <div className="mt-12">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>
    </div>
  )
}
