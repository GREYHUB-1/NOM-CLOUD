import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, GraduationCap, Users } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth, DEMO_CREDENTIALS } from '@/context/AuthContext'
import { isValidEmail } from '@/utils/validators'
import { useToast } from '@/context/ToastContext'
import { useLanguage } from '@/context/LanguageContext'

const demoIcons = { admin: ShieldCheck, teacher: GraduationCap, parent: Users }

export default function Login() {
  const { t } = useLanguage()
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = login(email, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error || 'Unable to log in.')
      return
    }
    showToast({ type: 'success', title: 'Welcome back!' })
    const redirectTo = location.state?.from
    const fallback = `/app/${result.role}`
    navigate(redirectTo && redirectTo !== '/login' && redirectTo.startsWith(`/app/${result.role}`) ? redirectTo : fallback)
  }

  const quickFill = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  return (
    <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label={t('auth.login.email')}
          type="email"
          required
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.ac.ke"
        />
        <div>
          <Input
            label={t('auth.login.password')}
            type={showPassword ? 'text' : 'password'}
            required
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-graphite hover:text-ink dark:hover:text-white"
          >
            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showPassword ? t('auth.login.hide') : t('auth.login.show')}
          </button>
        </div>
        {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">{error}</p>}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {t('auth.login.submit')} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative text-center">
          <span className="relative z-10 bg-mist px-3 text-xs font-medium text-graphite dark:bg-surface-dark">{t('auth.login.or')}</span>
          <div className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-ink/10 dark:bg-white/10" />
        </div>
        <div className="mt-4 space-y-2">
          {DEMO_CREDENTIALS.map((cred) => {
            const Icon = demoIcons[cred.role]
            return (
              <button
                key={cred.role}
                type="button"
                onClick={() => quickFill(cred.email, cred.password)}
                className="flex w-full items-center gap-3 rounded-xl border border-ink/10 px-4 py-3 text-left text-sm transition-colors hover:border-accent/40 hover:bg-accent/5 dark:border-white/10"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink dark:bg-white/10 dark:text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-ink dark:text-white">{cred.label}</span>
                  <span className="block truncate text-xs text-graphite">{cred.email}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-graphite">
        {t('auth.login.noAccount')}{' '}
        <Link to="/signup" className="link-underline font-medium text-accent">
          {t('auth.login.signup')}
        </Link>
      </p>
    </AuthLayout>
  )
}
