import { useState, useMemo } from 'react'
import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { Search } from 'lucide-react'
import { formatDateDisplay, matchesSearch, getTodayDate, parseDate } from '../utils/dates'

interface GreetingProps {
  dates: string[]
  currentDate: string | null
  onSelect: (date: string) => void
}

interface GreetingTemplate {
  prefix: string
  suffix: string
}

const TODAY_GREETINGS: GreetingTemplate[] = [
  { prefix: "So what did you do ", suffix: "?" },
  { prefix: "Tell me about ", suffix: "!" },
  { prefix: "How was ", suffix: "?" },
  { prefix: "What's the plan for ", suffix: "?" },
  { prefix: "Let's talk about ", suffix: "!" },
  { prefix: "Ready to capture ", suffix: "?" },
]

const OTHER_DAY_GREETINGS: GreetingTemplate[] = [
  { prefix: "So how was ", suffix: "?" },
  { prefix: "What happened on ", suffix: "?" },
  { prefix: "Let's revisit ", suffix: "!" },
  { prefix: "Looking back at ", suffix: "..." },
  { prefix: "Notes from ", suffix: "" },
]

const EMPTY_STATE_GREETINGS: GreetingTemplate[] = [
  { prefix: "Some say, ", suffix: " is a present!" },
  { prefix: "Every ", suffix: " is a fresh start!" },
  { prefix: "Make ", suffix: " count!" },
]

function formatDateForGreeting(dateStr: string): string {
  const today = getTodayDate()
  if (dateStr === today) {
    return "today"
  }

  const date = parseDate(dateStr)
  const day = date.getDate()
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const suffix = (day > 3 && day < 21) ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th'
  const year = String(date.getFullYear()).slice(-2)

  return `${day}${suffix} ${months[date.getMonth()]} '${year}, ${days[date.getDay()]}`
}

export function Greeting({ dates, currentDate, onSelect }: GreetingProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredDates = dates.filter(date => matchesSearch(date, search))

  const today = getTodayDate()
  const isToday = currentDate === today
  const isEmpty = !currentDate

  // Pick a random greeting based on the date (stable per date)
  const greeting = useMemo(() => {
    if (isEmpty) {
      const seed = new Date().getDate()
      return EMPTY_STATE_GREETINGS[seed % EMPTY_STATE_GREETINGS.length]
    }
    const greetings = isToday ? TODAY_GREETINGS : OTHER_DAY_GREETINGS
    const seed = currentDate.split('-').reduce((a, b) => a + parseInt(b), 0)
    return greetings[seed % greetings.length]
  }, [currentDate, isToday, isEmpty])

  const handleSelect = (date: string) => {
    onSelect(date)
    setOpen(false)
    setSearch('')
  }

  const dateText = isEmpty ? 'today' : formatDateForGreeting(currentDate)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="greeting">
        <span className="greeting-text">{greeting.prefix}</span>
        <Dialog.Trigger asChild>
          <button className="greeting-date-trigger">{dateText}</button>
        </Dialog.Trigger>
        <span className="greeting-text">{greeting.suffix}</span>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="spotlight-overlay" />
        <Dialog.Content className="spotlight-content">
          <Command shouldFilter={false} className="spotlight-command">
            <div className="spotlight-input-wrapper">
              <Search size={20} className="spotlight-search-icon" />
              <Command.Input
                value={search}
                onValueChange={setSearch}
                placeholder="Search dates... (e.g. jan 12, monday)"
                className="spotlight-input"
                autoFocus
              />
            </div>
            <Command.List className="spotlight-list">
              <Command.Empty className="spotlight-empty">No entries found</Command.Empty>
              {filteredDates.map(date => (
                <Command.Item
                  key={date}
                  value={date}
                  onSelect={() => handleSelect(date)}
                  className={`spotlight-item ${date === currentDate ? 'spotlight-item-active' : ''}`}
                >
                  <span>{formatDateDisplay(date)}</span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
