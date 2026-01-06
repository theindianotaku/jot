import { useState } from 'react'
import { Command } from 'cmdk'
import * as Dialog from '@radix-ui/react-dialog'
import { Search, ChevronDown } from 'lucide-react'
import { formatDateJournal, formatDateDisplay, matchesSearch } from '../utils/dates'

interface DateSelectorProps {
  dates: string[]
  currentDate: string | null
  onSelect: (date: string) => void
}

export function DateSelector({ dates, currentDate, onSelect }: DateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredDates = dates.filter(date => matchesSearch(date, search))

  const handleSelect = (date: string) => {
    onSelect(date)
    setOpen(false)
    setSearch('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="date-selector-trigger">
          <span className="date-selector-text">{currentDate ? formatDateJournal(currentDate) : 'Select a date'}</span>
          <ChevronDown size={18} className="date-selector-chevron" />
        </button>
      </Dialog.Trigger>

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
