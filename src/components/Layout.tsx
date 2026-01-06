import { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, PenLine } from 'lucide-react'
import { Greeting } from './Greeting'
import { useStorageContext } from '../context/StorageContext'
import { getTodayDate, dateToPath } from '../utils/dates'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { loaded, getAllDates, getEntry, createNewEntry } = useStorageContext()

  const todayDate = getTodayDate()
  const todayEntryExists = loaded && getEntry(todayDate) !== null
  const allDates = getAllDates()

  // Get current date from URL if on entry page, or most recent entry if on home
  const pathMatch = location.pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})$/)
  let currentDate: string | null = null
  if (pathMatch) {
    currentDate = `${pathMatch[1]}-${pathMatch[2]}-${pathMatch[3]}`
  } else if (location.pathname === '/' && allDates.length > 0) {
    currentDate = allDates[0] // Most recent entry
  }

  const handleStartNewDay = () => {
    if (!todayEntryExists) {
      createNewEntry(todayDate)
    }
    navigate(dateToPath(todayDate))
  }

  const handleDateSelect = (date: string) => {
    navigate(dateToPath(date))
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <Greeting
            dates={allDates}
            currentDate={currentDate}
            onSelect={handleDateSelect}
          />
        </div>
        <div className="header-right">
          {loaded && !todayEntryExists && allDates.length > 0 && (
            <button className="btn btn-primary" onClick={handleStartNewDay}>
              <Plus size={18} />
              <span>Start New Day</span>
            </button>
          )}
          <button className="logo-btn" onClick={() => navigate('/')} title="Home">
            <PenLine size={20} />
          </button>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  )
}
