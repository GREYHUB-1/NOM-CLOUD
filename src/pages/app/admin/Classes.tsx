import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen, Users, MapPin, GraduationCap, AlertTriangle, CalendarRange } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import StatCard from '@/components/ui/StatCard'
import TimetableGrid from '@/components/dashboard/TimetableGrid'
import type { SchoolClass } from '@/types'
import type { FieldErrors } from '@/utils/validators'
import { minLength } from '@/utils/validators'

export const MAX_CLASS_SIZE = 50

const emptyForm = { name: '', grade: '', section: '', teacherId: '', room: '', capacity: '32' }

export default function AdminClasses() {
  const { classes, teachers, timetables, addClass, updateClass, deleteClass, assignTeacherToClass } = useData()
  const { showToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SchoolClass | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null)
  const [timetableTarget, setTimetableTarget] = useState<SchoolClass | null>(null)

  const openAdd = () => {
    setEditing(null)
    setForm({ ...emptyForm, teacherId: teachers[0]?.id ?? '' })
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (cls: SchoolClass) => {
    setEditing(cls)
    setForm({ name: cls.name, grade: cls.grade, section: cls.section, teacherId: cls.teacherId, room: cls.room, capacity: String(cls.capacity) })
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const next: FieldErrors = {}
    if (!minLength(form.name, 2)) next.name = 'Enter a class name.'
    if (!minLength(form.grade, 1)) next.grade = 'Enter a grade level.'
    if (!minLength(form.section, 1)) next.section = 'Enter a section.'
    if (!form.teacherId) next.teacherId = 'Assign a class teacher.'
    const capacityNum = Number(form.capacity)
    if (!capacityNum || capacityNum < 1) next.capacity = 'Enter a valid class size.'
    else if (capacityNum > MAX_CLASS_SIZE) next.capacity = `Nom Cloud limits each class to a maximum of ${MAX_CLASS_SIZE} students.`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = {
      name: form.name,
      grade: form.grade,
      section: form.section,
      teacherId: form.teacherId,
      room: form.room,
      capacity: Math.min(MAX_CLASS_SIZE, Number(form.capacity) || 32),
      subject: editing?.subject ?? ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'Kiswahili'],
    }
    if (editing) {
      updateClass(editing.id, payload)
      if (payload.teacherId !== editing.teacherId) assignTeacherToClass(payload.teacherId, editing.id)
      showToast({ type: 'success', title: 'Class updated' })
    } else {
      const created = addClass(payload)
      assignTeacherToClass(payload.teacherId, created.id)
      showToast({ type: 'success', title: 'Class created', description: `${form.name} was added.` })
    }
    setModalOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.studentIds.length > 0) {
      showToast({ type: 'warning', title: 'Cannot delete class', description: 'Move or remove enrolled students first.' })
      setDeleteTarget(null)
      return
    }
    deleteClass(deleteTarget.id)
    showToast({ type: 'success', title: 'Class deleted' })
    setDeleteTarget(null)
  }

  const totalStudents = classes.reduce((sum, c) => sum + c.studentIds.length, 0)
  const avgClassSize = classes.length ? Math.round(totalStudents / classes.length) : 0
  const nearCapacity = classes.filter((c) => c.studentIds.length >= Math.min(c.capacity, MAX_CLASS_SIZE) * 0.9).length

  return (
    <div>
      <PageHeader
        title="Classes"
        description={`${classes.length} classes across the school · max ${MAX_CLASS_SIZE} students per class`}
        actions={
          <Button onClick={openAdd} icon={<Plus className="h-4 w-4" />}>
            Add Class
          </Button>
        }
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        <StatCard label="Total Classes" value={classes.length} icon={BookOpen} tint="#0071E3" />
        <StatCard label="Average Class Size" value={avgClassSize} icon={GraduationCap} tint="#34A853" />
        <StatCard label="Nearing Capacity" value={nearCapacity} icon={AlertTriangle} tint="#F59E0B" />
      </div>

      {classes.length === 0 ? (
        <EmptyState icon={BookOpen} title="No classes yet" description="Create your first class to start enrolling students." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => {
            const teacher = teachers.find((t) => t.id === c.teacherId)
            return (
              <div key={c.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-ink dark:text-white">{c.name}</p>
                    <p className="text-xs text-graphite">Grade {c.grade} · Section {c.section}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setTimetableTarget(c)} className="rounded-lg p-2 text-graphite hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white" aria-label="View timetable">
                      <CalendarRange className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-graphite hover:bg-ink/5 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} className="rounded-lg p-2 text-graphite hover:bg-red-500/10 hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs text-graphite">
                  <p className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> {teacher?.name ?? 'Unassigned teacher'}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> {c.room}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-4 dark:border-white/10">
                  <span className="text-xs text-graphite">
                    {c.studentIds.length} / {Math.min(c.capacity, MAX_CLASS_SIZE)} students
                  </span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink/5 dark:bg-white/10">
                    <div
                      className={`h-full rounded-full ${c.studentIds.length >= MAX_CLASS_SIZE ? 'bg-red-500' : 'bg-accent'}`}
                      style={{ width: `${Math.min(100, (c.studentIds.length / Math.min(c.capacity, MAX_CLASS_SIZE)) * 100)}%` }}
                    />
                  </div>
                </div>
                {c.studentIds.length >= MAX_CLASS_SIZE && (
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-red-500">
                    <AlertTriangle className="h-3 w-3" /> Class is full — at the {MAX_CLASS_SIZE}-student maximum
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Class' : 'Add Class'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editing ? 'Save Changes' : 'Create Class'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Class name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Grade 7A" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Grade level" required value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} error={errors.grade} placeholder="7" />
            <Input label="Section" required value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} error={errors.section} placeholder="A" />
          </div>
          <Select label="Class teacher" required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} error={errors.teacherId}>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.subject}
              </option>
            ))}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="Room 102" />
            <Input
              label="Capacity"
              type="number"
              max={MAX_CLASS_SIZE}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              error={errors.capacity}
              hint={`Maximum ${MAX_CLASS_SIZE} students per class`}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${deleteTarget?.name}?`}
        description="This cannot be undone."
        confirmLabel="Delete Class"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Modal
        open={!!timetableTarget}
        onClose={() => setTimetableTarget(null)}
        title={timetableTarget ? `${timetableTarget.name} — Timetable` : undefined}
        description={timetableTarget ? `Taught by ${teachers.find((t) => t.id === timetableTarget.teacherId)?.name ?? 'Unassigned'}` : undefined}
        size="lg"
      >
        {timetableTarget && (
          <TimetableGrid slots={timetables.filter((t) => t.classId === timetableTarget.id)} />
        )}
      </Modal>
    </div>
  )
}
