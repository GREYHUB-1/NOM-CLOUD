import { Smartphone, Landmark, Send } from 'lucide-react'

// Payment methods accepted for parent fee payments, ordered from most to least widely
// recognized in the Somali / East African market.
//
// Mastercard and PayPal use their real brand marks (via the open-source Simple Icons
// CDN) — displaying a card network's mark to show it's accepted is standard merchant
// practice worldwide and doesn't imply a special partnership.
//
// EVC Plus, Dahabshiil, WAAFI, eDahab, Premier Bank, Salaam Somali Bank and the
// International Bank of Somalia are regional mobile-money and banking brands whose
// official logo artwork isn't available to us here. Rather than guess at (and risk
// misrepresenting) their registered marks, each gets a clean, original wordmark badge
// in the brand's own colors instead — clearly a Nom Cloud-drawn badge, not a copy of
// their trademark.
export type PaymentMethod = {
  name: string
  tint: string
  kind: 'mark' | 'wordmark'
  markSrc?: string
  icon?: typeof Smartphone
}

export const paymentMethods: PaymentMethod[] = [
  { name: 'EVC Plus', tint: '#F7A81B', kind: 'wordmark', icon: Smartphone },
  { name: 'Mastercard', tint: '#000000', kind: 'mark', markSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@14.11.1/icons/mastercard.svg' },
  { name: 'Dahabshiil', tint: '#0071E3', kind: 'wordmark', icon: Send },
  { name: 'PayPal', tint: '#00457C', kind: 'mark', markSrc: 'https://cdn.jsdelivr.net/npm/simple-icons@14.11.1/icons/paypal.svg' },
  { name: 'WAAFI', tint: '#1DA1E8', kind: 'wordmark', icon: Smartphone },
  { name: 'eDahab', tint: '#FF5A1F', kind: 'wordmark', icon: Smartphone },
  { name: 'Premier Bank', tint: '#0B3D2E', kind: 'wordmark', icon: Landmark },
  { name: 'Salaam Somali Bank', tint: '#0E7C61', kind: 'wordmark', icon: Landmark },
  { name: 'International Bank of Somalia', tint: '#5B3A9B', kind: 'wordmark', icon: Landmark },
]

export function PaymentBadge({ method, dark = true }: { method: PaymentMethod; dark?: boolean }) {
  return (
    <div
      className={`flex flex-shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 ${
        dark ? 'border-white/10 bg-white/[0.04]' : 'border-ink/10 bg-white dark:border-white/10 dark:bg-[#161618]'
      }`}
    >
      {method.kind === 'mark' ? (
        <span className="flex h-8 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
          <img src={method.markSrc} alt={`${method.name} logo`} className="h-full w-full object-contain" loading="lazy" />
        </span>
      ) : (
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: method.tint }}
        >
          {method.icon ? <method.icon className="h-4 w-4" /> : null}
        </span>
      )}
      <span className={`whitespace-nowrap text-xs font-semibold tracking-tight ${dark ? 'text-white/85' : 'text-ink dark:text-white'}`}>
        {method.name}
      </span>
    </div>
  )
}
