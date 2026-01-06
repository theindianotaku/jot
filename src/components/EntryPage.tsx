import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { TodoEditor } from './TodoEditor'
import { BottomBar } from './BottomBar'
import { useStorageContext } from '../context/StorageContext'
import { pathToDate } from '../utils/dates'
import { DailyEntry, TodoNode } from '../types'

export function EntryPage() {
  const { year, month, day } = useParams()
  const {
    loaded,
    settings,
    updateSettings,
    getEntry,
    saveEntry,
    createNewEntry,
  } = useStorageContext()

  const [entry, setEntry] = useState<DailyEntry | null>(null)

  const currentDate = year && month && day ? pathToDate(year, month, day) : null

  useEffect(() => {
    if (!loaded || !currentDate) return

    const existingEntry = getEntry(currentDate)
    if (existingEntry) {
      setEntry(existingEntry)
    } else {
      setEntry({
        date: currentDate,
        previously: [],
        today: [],
      })
    }
  }, [loaded, currentDate, getEntry])

  const handleStartEntry = useCallback(() => {
    if (!currentDate) return

    const existingEntry = getEntry(currentDate)
    if (existingEntry) {
      setEntry(existingEntry)
    } else {
      const newEntry = createNewEntry(currentDate)
      setEntry(newEntry)
    }
  }, [currentDate, getEntry, createNewEntry])

  const handlePreviouslyChange = useCallback(
    (nodes: TodoNode[]) => {
      if (!entry) return
      const updated = { ...entry, previously: nodes }
      setEntry(updated)
      saveEntry(updated)
    },
    [entry, saveEntry]
  )

  const handleTodayChange = useCallback(
    (nodes: TodoNode[]) => {
      if (!entry) return
      const updated = { ...entry, today: nodes }
      setEntry(updated)
      saveEntry(updated)
    },
    [entry, saveEntry]
  )

  if (!loaded) {
    return <div className="loading">Loading...</div>
  }

  const isNewEntry = currentDate ? !getEntry(currentDate) : false

  return (
    <div className="page-content">
      {isNewEntry && (
        <div className="entry-empty-state">
          <p>No entry for this date yet.</p>
          <button className="start-entry-btn" onClick={handleStartEntry}>
            Start Entry
          </button>
        </div>
      )}

      {entry && !isNewEntry && (
        <>
          <h2 className="standup-title">Daily Standup</h2>
          <div className="editors-container">
            <TodoEditor
              title="Previously"
              nodes={entry.previously}
              onChange={handlePreviouslyChange}
            />
            <TodoEditor
              title="Today"
              nodes={entry.today}
              onChange={handleTodayChange}
            />
          </div>

          <BottomBar
            previously={entry.previously}
            today={entry.today}
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        </>
      )}
    </div>
  )
}
