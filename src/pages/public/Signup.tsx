import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock, User as UserIcon, Phone, ShieldCheck, GraduationCap, Users, Check } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { isValidEmail, minLength, type FieldErrors } from '@/utils/validators'
import type { Role } from '@/types'
import { cn } from '@/utils/cn'
import { useLanguage } from '@/context/LanguageContext'

export default function Signup() {
  const { t } = useLanguage()
  const { signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const roles: { id: Role; label: string; description: string; icon: typeof ShieldCheck }[] = [
    { id: 'admin', label: t('auth.signup.role.admin'), description: t('auth.signup.role.adminDesc'), icon: ShieldCheck },
    { id: 'teacher', label: t('auth.signup.role.teacher'), description: t('auth.signup.role.teacherDesc'), icon: GraduationCap },
    { id: 'parent', label: t('auth.signup.role.parent'), description: t('auth.signup.role.parentDesc'), icon: Users },
  ]

  const [role, setRole] = useState<Role>('admin')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = (): boolean => {
    const next: FieldErrors = {}
    if (!minLength(form.name, 2)) next.name = 'Please enter your full name.'
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.'
    if (!minLength(form.password, 8)) next.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = signup({ name: form.name, email: form.email, password: form.password, role, phone: form.phone })
    setLoading(false)
    if (!result.ok) {
      setFormError(result.error || 'Unable to create your account.')
      return
    }
    showToast({ type: 'success', title: 'Account created', description: `Welcome to Nom Cloud, ${form.name.split(' ')[0]}!` })
    navigate(`/app/${role}`)
  }

  return (
    <AuthLayout title={t('auth.signup.title')} subtitle={t('auth.signup.subtitle')}>
      <div className="mb-6 grid grid-cols-3 gap-2.5">
        {roles.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition-all',
              role === r.id ? 'border-brand bg-brand/5 shadow-soft' : 'border-ink/10 hover:border-ink/25 dark:border-white/10',
            )}
          >
            {role === r.id && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-2.5 w-2.5" />
              </span>
            )}
            <r.icon className={cn('h-5 w-5', role === r.id ? 'text-brand' : 'text-graphite')} />
            <span className="text-xs font-semibold text-ink dark:text-white">{r.label}</span>
          </button>
        ))}
      </div>
      <p className="mb-6 -mt-2 text-xs text-graphite">{roles.find((r) => r.id === role)?.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label={t('auth.signup.fullName')}
          required
          icon={<UserIcon className="h-4 w-4" />}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          placeholder="Jane Doe"
        />
        <Input
          label={t('auth.signup.email')}
          type="email"
          required
          icon={<Mail className="h-4 w-4" />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="you@school.ac.ke"
        />
        <Input
          label={t('auth.signup.phone')}
          type="tel"
          icon={<Phone className="h-4 w-4" />}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+254 7XX XXX XXX"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('auth.signup.password')}
            type="password"
            required
            icon={<Lock className="h-4 w-4" />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="8+ characters"
          />
          <Input
            label={t('auth.signup.confirmPassword')}
            type="password"
            required
            icon={<Lock className="h-4 w-4" />}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            placeholder="Re-enter password"
          />
        </div>
        {formError && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">{formError}</p>}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {t('auth.signup.submit')} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-graphite">
        {t('auth.signup.haveAccount')}{' '}
        <Link to="/login" className="link-underline font-medium text-accent">
          {t('auth.signup.login')}
        </Link>
      </p>
    </AuthLayout>
  )
}
