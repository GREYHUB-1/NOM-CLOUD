import {
  Users,
  GraduationCap,
  Wallet,
  CalendarCheck,
  Bell,
  Search,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Settings,
  School,
  Megaphone,
  BarChart3,
  CalendarRange,
  FileClock,
  TrendingUp,
} from 'lucide-react'
import BrowserFrame from '@/components/marketing/BrowserFrame'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Students' },
  { icon: GraduationCap, label: 'Teachers' },
  { icon: BookOpen, label: 'Classes' },
  { icon: ClipboardList, label: 'Attendance' },
  { icon: FileClock, label: 'Exams' },
  { icon: Wallet, label: 'Fees' },
  { icon: Megaphone, label: 'Announcements' },
  { icon: BarChart3, label: 'Reports' },
  { icon: CalendarRange, label: 'Academic Years' },
  { icon: Settings, label: 'Settings' },
]

const stats = [
  { label: 'Students', value: '1,284', delta: '+3.2%', tint: '#0071E3', icon: Users },
  { label: 'Teachers', value: '86', delta: '+1.1%', tint: '#FF5A1F', icon: GraduationCap },
  { label: 'Attendance Today', value: '96.4%', delta: '+0.8%', tint: '#34A853', icon: CalendarCheck },
  { label: 'Fees Collected', value: '$42,180', delta: '+12.4%', tint: '#A855F7', icon: Wallet },
]

// A smooth SVG polyline used as an animated "live" trend line.
const linePoints = [18, 34, 24, 46, 38, 58, 48, 66, 54, 74, 62, 80]
function toPath(points: number[], w: number, h: number) {
  const stepX = w / (points.length - 1)
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * stepX).toFixed(1)} ${(h - (p / 100) * h).toFixed(1)}`)
    .join(' ')
}

export default function AdminDashboardMock() {
  const path = toPath(linePoints, 260, 88)

  return (
    <BrowserFrame url="app.nomcloud.academy/admin">
      <div className="flex h-[440px] text-[11px] sm:h-[480px]">
        <aside className="hidden w-48 flex-col overflow-y-auto border-r border-ink/5 bg-white p-4 dark:border-white/10 dark:bg-[#141416] sm:flex">
          <div className="mb-6 flex items-center gap-2 px-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
              <School className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-ink dark:text-white">Nom Cloud</span>
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors ${
                  item.active ? 'bg-brand/10 text-brand font-medium' : 'text-graphite'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
            ))}
          </nav>
          <div className="mt-auto rounded-xl bg-mist p-3 dark:bg-white/5">
            <p className="font-medium text-ink dark:text-white">Term 1 · 2026</p>
            <p className="mt-0.5 text-graphite">Active academic year</p>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink dark:text-white">Good morning, Admin</p>
              <p className="text-graphite">Nom Cloud Demo Academy · Live overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-graphite dark:bg-white/10 sm:flex">
                <Search className="h-3 w-3" /> Search
              </div>
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 dark:bg-white/10">
                <Bell className="h-3.5 w-3.5 text-graphite" />
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="relative overflow-hidden rounded-xl border border-ink/5 bg-white p-3 dark:border-white/10 dark:bg-[#141416]">
                <div className="mb-2 flex items-center justify-between">
                  <div className="inline-flex rounded-lg p-1.5" style={{ backgroundColor: `${s.tint}1A`, color: s.tint }}>
                    <s.icon className="h-3 w-3" />
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600">{s.delta}</span>
                </div>
                <p className="font-semibold text-ink dark:text-white">{s.value}</p>
                <p className="text-graphite">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-5">
            <div className="relative overflow-hidden rounded-xl border border-ink/5 bg-white p-4 dark:border-white/10 dark:bg-[#141416] sm:col-span-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-ink dark:text-white">Enrollment &amp; Attendance Trend</p>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> Updating live
                </span>
              </div>
              <p className="mb-2 text-graphite">Last 12 school days</p>
              <div className="relative h-24 w-full overflow-hidden sm:h-28">
                <svg viewBox="0 0 260 88" preserveAspectRatio="none" className="h-full w-full">
                  <defs>
                    <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0071E3" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#0071E3" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`${path} L 260 88 L 0 88 Z`} fill="url(#fillGrad)" />
                  <path
                    d={path}
                    fill="none"
                    stroke="#0071E3"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="600"
                    className="animate-draw-line"
                  />
                  <circle cx="260" cy="8" r="4" fill="#0071E3" className="animate-pulse-dot" />
                </svg>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent dark:from-[#141416]" />
              </div>
            </div>

            <div className="rounded-xl border border-ink/5 bg-white p-4 dark:border-white/10 dark:bg-[#141416] sm:col-span-2">
              <p className="mb-3 font-medium text-ink dark:text-white">Today&apos;s Activity</p>
              <ul className="space-y-2.5">
                {[
                  { icon: Users, label: '3 new students enrolled', tint: '#0071E3' },
                  { icon: Wallet, label: '$1,240 fees collected', tint: '#34A853' },
                  { icon: Megaphone, label: 'Announcement sent to Grade 6', tint: '#FF5A1F' },
                ].map((a) => (
                  <li key={a.label} className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${a.tint}1A`, color: a.tint }}>
                      <a.icon className="h-3 w-3" />
                    </span>
                    <span className="leading-snug text-ink dark:text-white">{a.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  )
}
