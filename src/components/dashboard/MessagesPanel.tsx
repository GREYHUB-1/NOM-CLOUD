import { useEffect, useRef, useState } from 'react'
import { Send, Plus, MessageSquare, Search } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import type { MessageThread } from '@/types'
import { formatDateShort, timeAgo } from '@/utils/format'
import { cn } from '@/utils/cn'

interface Recipient {
  id: string
  name: string
  subLabel?: string
  studentId?: string
}

interface MessagesPanelProps {
  currentId: string
  currentName: string
  threads: MessageThread[]
  recipients: Recipient[]
  recipientLabel: string
}

export default function MessagesPanel({ currentId, currentName, threads, recipients, recipientLabel }: MessagesPanelProps) {
  const { sendMessage, createThread } = useData()
  const { showToast } = useToast()

  const sorted = [...threads].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  const [activeId, setActiveId] = useState<string | null>(sorted[0]?.id ?? null)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')
  const [newModalOpen, setNewModalOpen] = useState(false)
  const [newRecipientId, setNewRecipientId] = useState(recipients[0]?.id ?? '')
  const [newSubject, setNewSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const active = sorted.find((t) => t.id === activeId) ?? sorted[0] ?? null

  useEffect(() => {
    if (!activeId && sorted.length > 0) setActiveId(sorted[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted.length])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [active?.messages.length])

  const filteredThreads = sorted.filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()) || t.participantNames.join(' ').toLowerCase().includes(search.toLowerCase()))

  const handleSend = () => {
    if (!active || !draft.trim()) return
    sendMessage(active.id, currentId, currentName, draft.trim())
    setDraft('')
  }

  const handleCreate = () => {
    const recipient = recipients.find((r) => r.id === newRecipientId)
    if (!recipient || !newMessage.trim()) {
      showToast({ type: 'error', title: 'Please write a message and select a recipient.' })
      return
    }
    const thread = createThread({
      participantIds: [currentId, recipient.id],
      participantNames: [currentName, recipient.name],
      subject: newSubject || `Conversation with ${recipient.name}`,
      studentId: recipient.studentId,
      firstMessage: { senderId: currentId, senderName: currentName, body: newMessage.trim() },
    })
    setActiveId(thread.id)
    setNewModalOpen(false)
    setNewSubject('')
    setNewMessage('')
    showToast({ type: 'success', title: 'Message sent', description: `Your message to ${recipient.name} was delivered.` })
  }

  if (recipients.length === 0 && sorted.length === 0) {
    return <EmptyState icon={MessageSquare} title="No conversations yet" description="Messaging will be available once you have classes or children linked to your account." />
  }

  return (
    <div className="card grid overflow-hidden lg:grid-cols-[320px_1fr]" style={{ minHeight: 560 }}>
      <div className="flex flex-col border-b border-ink/5 dark:border-white/10 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 border-b border-ink/5 p-4 dark:border-white/10">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-graphite" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="input py-2 pl-8 text-sm" />
          </div>
          <button
            onClick={() => setNewModalOpen(true)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-600"
            aria-label="New message"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.length === 0 ? (
            <p className="p-6 text-center text-sm text-graphite">No conversations found.</p>
          ) : (
            filteredThreads.map((t) => {
              const other = t.participantNames.find((n) => n !== currentName) ?? t.participantNames[0]
              const lastMsg = t.messages[t.messages.length - 1]
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    'flex w-full items-start gap-3 border-b border-ink/5 px-4 py-3.5 text-left transition-colors dark:border-white/5',
                    active?.id === t.id ? 'bg-accent/5' : 'hover:bg-ink/[0.03] dark:hover:bg-white/5',
                  )}
                >
                  <Avatar name={other} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-ink dark:text-white">{other}</p>
                      <span className="flex-shrink-0 text-[11px] text-graphite">{timeAgo(t.updatedAt)}</span>
                    </div>
                    <p className="truncate text-xs text-graphite">{t.subject}</p>
                    {lastMsg && <p className="mt-0.5 truncate text-xs text-graphite/80">{lastMsg.body}</p>}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="flex min-h-[400px] flex-col">
        {active ? (
          <>
            <div className="border-b border-ink/5 px-5 py-4 dark:border-white/10">
              <p className="font-medium text-ink dark:text-white">{active.participantNames.find((n) => n !== currentName) ?? active.participantNames[0]}</p>
              <p className="text-xs text-graphite">{active.subject}</p>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-5">
              {active.messages.map((m) => {
                const mine = m.senderId === currentId
                return (
                  <div key={m.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        mine ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm bg-ink/5 text-ink dark:bg-white/10 dark:text-white',
                      )}
                    >
                      {m.body}
                    </div>
                    <span className="mt-1 text-[11px] text-graphite">{formatDateShort(m.date)}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-2 border-t border-ink/5 p-4 dark:border-white/10">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Write a message…"
                className="input flex-1"
              />
              <Button onClick={handleSend} icon={<Send className="h-4 w-4" />}>
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState icon={MessageSquare} title="No conversation selected" description="Start a new conversation to see it here." />
          </div>
        )}
      </div>

      <Modal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        title="New Message"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Send Message</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label={recipientLabel} value={newRecipientId} onChange={(e) => setNewRecipientId(e.target.value)}>
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} {r.subLabel ? `— ${r.subLabel}` : ''}
              </option>
            ))}
          </Select>
          <Input label="Subject" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="What's this about?" />
          <Textarea label="Message" required rows={4} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message…" />
        </div>
      </Modal>
    </div>
  )
}
