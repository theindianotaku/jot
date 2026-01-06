import { createContext, useContext, ReactNode } from 'react'
import { useStorage } from '../hooks/useStorage'

type StorageContextType = ReturnType<typeof useStorage>

const StorageContext = createContext<StorageContextType | null>(null)

export function StorageProvider({ children }: { children: ReactNode }) {
  const storage = useStorage()

  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorageContext() {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorageContext must be used within StorageProvider')
  }
  return context
}
