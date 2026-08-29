import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, GraduationCap, Mail, Phone } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import type { Teacher } from '@/types'
import type { FieldErrors } from '@/utils/validators'
import { isValidEmail, minLength } from '@/utils/validators'

const emptyForm = { name: '', email: '', phone: '', subject: '' }

export default function AdminTeachers() {
  const { teachers, classes, addTeacher, updateTeacher, deleteTeacher } = useData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null)

  const filtered = useMemo(
    () =>
      teachers.filter(
        (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase()),
      ),
    [teachers, search],
  )

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher)
    setForm({ name: teacher.name, email: teacher.email, phone: teacher.phone, subject: teacher.subject })
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const next: FieldErrors = {}
    if (!minLength(form.name, 2)) next.name = 'Enter the teacher\'s full name.'
    if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!minLength(form.subject, 2)) next.subject = 'Enter the subject taught.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editing) {
      updateTeacher(editing.id, form)
      showToast({ type: 'success', title: 'Teacher updated', description: `${form.name}'s profile was saved.` })
    } else {
      addTeacher(form)
      showToast({ type: 'success', title: 'Teacher added', description: `${form.name} was added to the staff directory.` })
    }
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteTeacher(deleteTarget.id)
    showToast({ type: 'success', title: 'Teacher removed' })
    setDeleteTarget(null)
  }

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${teachers.length} teaching staff members`}
        actions={
          <Button onClick={openAdd} icon={<Plus className="h-4 w-4" />}>
            Add Teacher
          </Button>
        }
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name or subject…" className="mb-6 sm:w-80" />

      {filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No teachers found" description="Try a different search, or add a new teacher." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const teacherClasses = classes.filter((c) => t.classIds.includes(c.id))
            return (
              <div key={t.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} color={t.avatarColor} />
                    <div>
                      <p className="font-medium text-ink dark:text-white">{t.name}</p>
                      <p className="text-xs text-graphite">{t.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(t)} className="rounded-lg p-2 text-graphite hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(t)} className="rounded-lg p-2 text-graphite hover:bg-red-500/10 hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-xs text-graphite">
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {t.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {t.phone}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {teacherClasses.length === 0 ? (
                    <Badge tone="neutral">No classes assigned</Badge>
                  ) : (
                    teacherClasses.map((c) => (
                      <Badge key={c.id} tone="info">
                        {c.name}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Teacher' : 'Add Teacher'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Teacher'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input
            label="Email address"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input
              label="Subject taught"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              error={errors.subject}
            />
          </div>
          {editing && (
            <p className="rounded-xl bg-ink/5 px-4 py-3 text-xs text-graphite dark:bg-white/5">
              Manage this teacher's class assignments from the Classes page.
            </p>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Remove ${deleteTarget?.name}?`}
        description="Their assigned classes will become unassigned. This action cannot be undone."
        confirmLabel="Remove Teacher"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
