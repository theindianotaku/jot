import { useNavigate } from 'react-router-dom'
import { NotebookPen } from 'lucide-react'
import { TodoEditor } from './TodoEditor'
import { BottomBar } from './BottomBar'
import { useStorageContext } from '../context/StorageContext'
import { getTodayDate, dateToPath } from '../utils/dates'

export function HomePage() {
  const navigate = useNavigate()
  const { loaded, settings, updateSettings, getMostRecentEntry, getEntry, createNewEntry } = useStorageContext()

  if (!loaded) {
    return <div className="loading">Loading...</div>
  }

  const lastEntry = getMostRecentEntry()
  const todayDate = getTodayDate()

  const handleStartNewDay = () => {
    if (!getEntry(todayDate)) {
      createNewEntry(todayDate)
    }
    navigate(dateToPath(todayDate))
  }

  return (
    <div className="page-content">
      {lastEntry ? (
        <>
          <h2 className="standup-title">Daily Standup</h2>
          <div className="editors-container">
            <TodoEditor
              title="Previously"
              nodes={lastEntry.previously}
              onChange={() => {}}
            />
            <TodoEditor
              title="Today"
              nodes={lastEntry.today}
              onChange={() => {}}
            />
          </div>

          <BottomBar
            previously={lastEntry.previously}
            today={lastEntry.today}
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        </>
      ) : (
        <>
          <div className="welcome-state">
            <div className="welcome-icon">
              <NotebookPen size={100} />
            </div>
            <h1 className="welcome-title">
              Ready to <button className="welcome-link" onClick={handleStartNewDay}>jot down your first day</button>?
            </h1>
            <p className="welcome-subtitle">
              Track your daily wins, plan your tasks, and never forget what you accomplished.
            </p>
          </div>

          <BottomBar
            previously={[]}
            today={[]}
            settings={settings}
            onUpdateSettings={updateSettings}
            isEmpty
          />
        </>
      )}
    </div>
  )
}
