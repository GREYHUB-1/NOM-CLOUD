import { useData } from '@/context/DataContext'
import { useSelectedChild } from '@/hooks/useSelectedChild'
import PageHeader from '@/components/ui/PageHeader'
import AnnouncementBoard from '@/components/dashboard/AnnouncementBoard'

export default function ParentAnnouncements() {
  const { classes, announcements } = useData()
  const { selectedChild } = useSelectedChild()

  const visible = announcements.filter(
    (a) =>
      a.audience === 'all' ||
      a.audience === 'parents' ||
      a.audience === 'students' ||
      (a.audience === 'class' && a.classId === selectedChild?.classId),
  )

  return (
    <div>
      <PageHeader title="Announcements" description="News and updates from your school." />
      <AnnouncementBoard
        audienceOptions={[]}
        classes={classes}
        authorName=""
        authorRole="parent"
        visibleAnnouncements={visible}
        canManage={() => false}
      />
    </div>
  )
}
