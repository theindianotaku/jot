import { useCallback, useEffect, useState } from 'react'
import { DailyEntry, AppSettings, TodoNode } from '../types'

const ENTRIES_KEY = 'daily-standup-entries'
const SETTINGS_KEY = 'daily-standup-settings'

const DEFAULT_SETTINGS: AppSettings = {
  copyPreviousEntry: true,
  exportFormat: 'slack-default',
}

export function useStorage() {
  const [entries, setEntries] = useState<Record<string, DailyEntry>>({})
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem(ENTRIES_KEY)
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries))
      }

      const storedSettings = localStorage.getItem(SETTINGS_KEY)
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) })
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
    setLoaded(true)
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
    }
  }, [entries, loaded])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    }
  }, [settings, loaded])

  const getEntry = useCallback(
    (date: string): DailyEntry | null => {
      return entries[date] || null
    },
    [entries]
  )

  const saveEntry = useCallback((entry: DailyEntry) => {
    setEntries(prev => ({
      ...prev,
      [entry.date]: entry,
    }))
  }, [])

  const deleteEntry = useCallback((date: string) => {
    setEntries(prev => {
      const next = { ...prev }
      delete next[date]
      return next
    })
  }, [])

  const getAllDates = useCallback((): string[] => {
    return Object.keys(entries).sort().reverse()
  }, [entries])

  const getMostRecentEntry = useCallback(
    (beforeDate?: string): DailyEntry | null => {
      const dates = getAllDates()
      for (const date of dates) {
        if (!beforeDate || date < beforeDate) {
          return entries[date]
        }
      }
      return null
    },
    [entries, getAllDates]
  )

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  const createNewEntry = useCallback(
    (date: string): DailyEntry => {
      let previously: TodoNode[] = []

      if (settings.copyPreviousEntry) {
        const mostRecent = getMostRecentEntry(date)
        if (mostRecent) {
          // Deep clone the today section as previously
          previously = JSON.parse(JSON.stringify(mostRecent.today))
        }
      }

      const entry: DailyEntry = {
        date,
        previously,
        today: [],
      }

      saveEntry(entry)
      return entry
    },
    [settings.copyPreviousEntry, getMostRecentEntry, saveEntry]
  )

  return {
    loaded,
    entries,
    settings,
    getEntry,
    saveEntry,
    deleteEntry,
    getAllDates,
    getMostRecentEntry,
    updateSettings,
    createNewEntry,
  }
}
