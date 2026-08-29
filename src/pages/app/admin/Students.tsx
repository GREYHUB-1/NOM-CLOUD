import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Users } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import PageHeader from '@/components/ui/PageHeader'
import SearchInput from '@/components/ui/SearchInput'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import type { Student } from '@/types'
import type { FieldErrors } from '@/utils/validators'
import { minLength } from '@/utils/validators'
import { formatDate } from '@/utils/format'

const MAX_CLASS_SIZE = 50

const emptyForm = {
  name: '',
  admissionNo: '',
  classId: '',
  gender: 'Male' as 'Male' | 'Female',
  dateOfBirth: '',
  parentId: '',
  newParentName: '',
  newParentEmail: '',
  newParentPhone: '',
}

export default function AdminStudents() {
  const { students, classes, parents, addStudent, updateStudent, deleteStudent } = useData()
  const { showToast } = useToast()

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [parentMode, setParentMode] = useState<'existing' | 'new'>('existing')
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) || s.admissionNo.toLowerCase().includes(search.toLowerCase())
      const matchesClass = classFilter === 'all' || s.classId === classFilter
      return matchesSearch && matchesClass
    })
  }, [students, search, classFilter])

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm, classId: classes[0]?.id ?? '' })
    setParentMode('existing')
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (student: Student) => {
    setEditing(student)
    setForm({
      name: student.name,
      admissionNo: student.admissionNo,
      classId: student.classId,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      parentId: student.parentId,
      newParentName: '',
      newParentEmail: '',
      newParentPhone: '',
    })
    setParentMode('existing')
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const next: FieldErrors = {}
    if (!minLength(form.name, 2)) next.name = 'Enter the student\'s full name.'
    if (!minLength(form.admissionNo, 2)) next.admissionNo = 'Enter an admission number.'
    if (!form.classId) next.classId = 'Select a class.'
    else {
      const targetClass = classes.find((c) => c.id === form.classId)
      const movingIntoClass = !editing || editing.classId !== form.classId
      if (targetClass && movingIntoClass && targetClass.studentIds.length >= MAX_CLASS_SIZE) {
        next.classId = `${targetClass.name} is full — Nom Cloud limits classes to ${MAX_CLASS_SIZE} students.`
      }
    }
    if (!form.dateOfBirth) next.dateOfBirth = 'Select a date of birth.'
    if (parentMode === 'existing' && !form.parentId) next.parentId = 'Select a parent/guardian.'
    if (parentMode === 'new' && !minLength(form.newParentName, 2)) next.newParentName = 'Enter the parent\'s name.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    if (editing) {
      updateStudent(editing.id, {
        name: form.name,
        admissionNo: form.admissionNo,
        classId: form.classId,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        parentId: parentMode === 'existing' ? form.parentId : editing.parentId,
      })
      showToast({ type: 'success', title: 'Student updated', description: `${form.name}'s details were saved.` })
    } else {
      addStudent({
        name: form.name,
        admissionNo: form.admissionNo,
        classId: form.classId,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        parentId: parentMode === 'existing' ? form.parentId : '',
        newParent:
          parentMode === 'new'
            ? { name: form.newParentName, email: form.newParentEmail, phone: form.newParentPhone }
            : undefined,
      })
      showToast({ type: 'success', title: 'Student enrolled', description: `${form.name} was added to the school.` })
    }
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteStudent(deleteTarget.id)
    showToast({ type: 'success', title: 'Student removed', description: `${deleteTarget.name} was removed from Nom Cloud.` })
    setDeleteTarget(null)
  }

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${students.length} students enrolled across ${classes.length} classes`}
        actions={
          <Button onClick={openAdd} icon={<Plus className="h-4 w-4" />}>
            Add Student
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name or admission no…" className="sm:w-80" />
        <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="sm:w-56">
          <option value="all">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try adjusting your search or filters, or add a new student to get started."
          action={
            <Button onClick={openAdd} size="sm" icon={<Plus className="h-4 w-4" />}>
              Add Student
            </Button>
          }
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-ink/5 text-left text-xs text-graphite dark:border-white/10">
                <th className="px-5 py-3.5 font-medium">Student</th>
                <th className="px-5 py-3.5 font-medium">Admission No.</th>
                <th className="px-5 py-3.5 font-medium">Class</th>
                <th className="px-5 py-3.5 font-medium">Guardian</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const cls = classes.find((c) => c.id === s.classId)
                const parent = parents.find((p) => p.id === s.parentId)
                return (
                  <tr key={s.id} className="border-b border-ink/5 last:border-b-0 dark:border-white/5">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} color={s.avatarColor} size="sm" />
                        <div>
                          <p className="font-medium text-ink dark:text-white">{s.name}</p>
                          <p className="text-xs text-graphite">
                            {s.gender} · {formatDate(s.dateOfBirth)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-graphite">{s.admissionNo}</td>
                    <td className="px-5 py-3.5 text-graphite">{cls?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-graphite">{parent?.name ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={s.status === 'active' ? 'success' : 'neutral'}>{s.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(s)} className="rounded-lg p-2 text-graphite hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="rounded-lg p-2 text-graphite hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Student' : 'Add Student'}
        description="Student records sync instantly across teacher and parent views."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Add Student'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input
              label="Admission number"
              required
              value={form.admissionNo}
              onChange={(e) => setForm({ ...form, admissionNo: e.target.value })}
              error={errors.admissionNo}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Class" required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} error={errors.classId}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as 'Male' | 'Female' })}>
              <option>Male</option>
              <option>Female</option>
            </Select>
          </div>
          <Input
            label="Date of birth"
            type="date"
            required
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            error={errors.dateOfBirth}
          />

          <div>
            <p className="label mb-2">Parent / Guardian</p>
            <div className="mb-3 inline-flex rounded-full bg-ink/5 p-1 dark:bg-white/10">
              <button
                type="button"
                onClick={() => setParentMode('existing')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${parentMode === 'existing' ? 'bg-white shadow-soft dark:bg-white/10' : 'text-graphite'}`}
              >
                Existing Parent
              </button>
              <button
                type="button"
                onClick={() => setParentMode('new')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${parentMode === 'new' ? 'bg-white shadow-soft dark:bg-white/10' : 'text-graphite'}`}
              >
                New Parent
              </button>
            </div>
            {parentMode === 'existing' ? (
              <Select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} error={errors.parentId}>
                <option value="">Select a parent…</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.email}
                  </option>
                ))}
              </Select>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder="Parent full name"
                  value={form.newParentName}
                  onChange={(e) => setForm({ ...form, newParentName: e.target.value })}
                  error={errors.newParentName}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    placeholder="Parent email"
                    type="email"
                    value={form.newParentEmail}
                    onChange={(e) => setForm({ ...form, newParentEmail: e.target.value })}
                  />
                  <Input placeholder="Parent phone" value={form.newParentPhone} onChange={(e) => setForm({ ...form, newParentPhone: e.target.value })} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Remove ${deleteTarget?.name}?`}
        description="This will permanently remove the student's record, including attendance and grade history."
        confirmLabel="Remove Student"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
