import { Link } from 'react-router-dom'
import { useData } from '@/context/DataContext'
import { cn } from '@/utils/cn'

// Once a user is signed in, the app should feel like *their* school's private
// system — not a Nom Cloud-branded product. Everywhere inside /app, we show the
// school's own logo (uploaded in Admin → Settings) and name instead of the Nom
// Cloud mark, falling back to a clean initial badge in the school's brand color
// when no logo image has been uploaded yet.
export default function SchoolBrandLogo({ to, className, textClassName }: { to: string; className?: string; textClassName?: string }) {
  const { settings } = useData()

  return (
    <Link to={to} className={cn('group inline-flex min-w-0 items-center gap-2.5', className)}>
      {settings.logoDataUrl ? (
        <img
          src={settings.logoDataUrl}
          alt={settings.name}
          className="h-8 w-8 flex-shrink-0 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: settings.primaryColor }}
        >
          {settings.logoInitial}
        </span>
      )}
      <span className={cn('truncate text-[1.05rem] font-semibold tracking-tight text-ink dark:text-white', textClassName)}>{settings.name}</span>
    </Link>
  )
}
