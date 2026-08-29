import { useState } from 'react'
import { Plus, CalendarRange, Check } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/format'
import type { FieldErrors } from '@/utils/validators'
import { minLength } from '@/utils/validators'
import { cn } from '@/utils/cn'

const statusTone = { active: 'success', upcoming: 'info', closed: 'neutral' } as const

export default function AdminAcademicYears() {
  const { academicYears, setActiveYear, addAcademicYear } = useData()
  const { showToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ label: '', startDate: '', endDate: '' })
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSetActive = (id: string, label: string) => {
    setActiveYear(id)
    showToast({ type: 'success', title: 'Academic year updated', description: `${label} is now the active academic year.` })
  }

  const validate = () => {
    const next: FieldErrors = {}
    if (!minLength(form.label, 4)) next.label = 'Enter a year label, e.g. 2027 / 2028.'
    if (!form.startDate) next.startDate = 'Select a start date.'
    if (!form.endDate) next.endDate = 'Select an end date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    addAcademicYear({
      label: form.label,
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'upcoming',
      terms: [
        { id: `${form.label}-t1`, name: 'Term 1', startDate: form.startDate, endDate: form.startDate },
        { id: `${form.label}-t2`, name: 'Term 2', startDate: form.startDate, endDate: form.startDate },
        { id: `${form.label}-t3`, name: 'Term 3', startDate: form.endDate, endDate: form.endDate },
      ],
    })
    showToast({ type: 'success', title: 'Academic year added', description: `${form.label} was created.` })
    setModalOpen(false)
    setForm({ label: '', startDate: '', endDate: '' })
  }

  return (
    <div>
      <PageHeader
        title="Academic Years"
        description="Plan terms ahead of time and switch the active year without losing history."
        actions={
          <Button onClick={() => setModalOpen(true)} icon={<Plus className="h-4 w-4" />}>
            Add Academic Year
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {academicYears.map((year) => (
          <div key={year.id} className={cn('card p-6', year.status === 'active' && 'border-brand/30 ring-1 ring-brand/20')}>
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-ink/5 p-2.5 text-ink dark:bg-white/10 dark:text-white">
                <CalendarRange className="h-4 w-4" />
              </div>
              <Badge tone={statusTone[year.status]}>{year.status}</Badge>
            </div>
            <p className="text-lg font-semibold text-ink dark:text-white">{year.label}</p>
            <p className="text-xs text-graphite">
              {formatDate(year.startDate)} — {formatDate(year.endDate)}
            </p>
            <div className="mt-4 space-y-2 border-t border-ink/5 pt-4 dark:border-white/10">
              {year.terms.map((term) => (
                <div key={term.id} className="flex items-center justify-between text-xs">
                  <span className="text-ink dark:text-white">{term.name}</span>
                  <span className="text-graphite">
                    {formatDate(term.startDate)} – {formatDate(term.endDate)}
                  </span>
                </div>
              ))}
            </div>
            {year.status !== 'active' && (
              <Button variant="outline" size="sm" className="mt-5 w-full" onClick={() => handleSetActive(year.id, year.label)} icon={<Check className="h-3.5 w-3.5" />}>
                Set as Active Year
              </Button>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Academic Year"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Academic Year</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Label" required placeholder="2027 / 2028" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} error={errors.label} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Start date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} error={errors.startDate} />
            <Input label="End date" type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} error={errors.endDate} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
