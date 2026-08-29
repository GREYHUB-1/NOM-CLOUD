import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import PageHeader from '@/components/ui/PageHeader'
import AttendanceMarker from '@/components/dashboard/AttendanceMarker'

export default function AdminAttendance() {
  const { classes } = useData()
  const { currentUser } = useAuth()

  return (
    <div>
      <PageHeader title="Attendance" description="Mark or review attendance for any class across the school." />
      <AttendanceMarker classes={classes} markedBy={currentUser?.id ?? 'admin'} />
    </div>
  )
}
