import { useRef, useState } from 'react'
import { Save, School, Palette, Bell, ShieldCheck, Upload, X } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import PageHeader from '@/components/ui/PageHeader'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Switch from '@/components/ui/Switch'

export default function AdminSettings() {
  const { settings, updateSettings } = useData()
  const { showToast } = useToast()
  const [form, setForm] = useState(settings)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    updateSettings(form)
    showToast({ type: 'success', title: 'Settings saved', description: 'School settings have been updated.' })
  }

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', title: 'Not an image', description: 'Please choose a PNG, JPG or SVG file.' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm({ ...form, logoDataUrl: typeof reader.result === 'string' ? reader.result : undefined })
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <PageHeader
        title="School Settings"
        description="Manage your school's profile, grading and notification preferences."
        actions={
          <Button onClick={handleSave} icon={<Save className="h-4 w-4" />}>
            Save Changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-brand/10 p-2.5 text-brand">
              <School className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-ink dark:text-white">School Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="label mb-2">School logo</p>
              <p className="mb-3 text-xs text-graphite">
                Shown throughout your dashboard — in the sidebar and top bar — instead of the Nom Cloud logo, so this feels like your school's own system.
              </p>
              <div className="flex items-center gap-4">
                {form.logoDataUrl ? (
                  <img src={form.logoDataUrl} alt="School logo" className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover shadow-soft" />
                ) : (
                  <span
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    {form.logoInitial}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoFile(e.target.files?.[0])}
                  />
                  <Button type="button" variant="outline" size="sm" icon={<Upload className="h-3.5 w-3.5" />} onClick={() => fileRef.current?.click()}>
                    Upload logo
                  </Button>
                  {form.logoDataUrl && (
                    <Button type="button" variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5" />} onClick={() => setForm({ ...form, logoDataUrl: undefined })}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Input label="School name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-accent/10 p-2.5 text-accent">
              <Palette className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-ink dark:text-white">Academics &amp; Branding</h3>
          </div>
          <div className="space-y-4">
            <Select label="Grading scale" value={form.gradingScale} onChange={(e) => setForm({ ...form, gradingScale: e.target.value as typeof form.gradingScale })}>
              <option value="percentage">Percentage (0–100)</option>
              <option value="letter">Letter Grades (A–D)</option>
              <option value="gpa">GPA (0.0–4.0)</option>
            </Select>
            <Input label="Timezone" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
            <Input label="Attendance cutoff time" type="time" value={form.attendanceCutoffTime} onChange={(e) => setForm({ ...form, attendanceCutoffTime: e.target.value })} />
            <div>
              <p className="label mb-2">Brand color</p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  className="h-11 w-16 cursor-pointer rounded-xl border border-ink/10 dark:border-white/15"
                />
                <span className="text-sm text-graphite">{form.primaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600">
              <Bell className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-ink dark:text-white">Notifications</h3>
          </div>
          <div className="divide-y divide-ink/5 dark:divide-white/10">
            <Switch
              label="Email notifications"
              description="Send email updates for grades, fees and announcements"
              checked={form.emailNotifications}
              onChange={(v) => setForm({ ...form, emailNotifications: v })}
            />
            <Switch
              label="SMS notifications"
              description="Send SMS alerts for urgent announcements"
              checked={form.smsNotifications}
              onChange={(v) => setForm({ ...form, smsNotifications: v })}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-ink dark:text-white">Access</h3>
          </div>
          <Switch
            label="Parent portal access"
            description="Allow parents to log in and view their children's records"
            checked={form.parentPortalEnabled}
            onChange={(v) => setForm({ ...form, parentPortalEnabled: v })}
          />
        </div>
      </div>
    </div>
  )
}
