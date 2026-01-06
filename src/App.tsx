import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StorageProvider } from './context/StorageContext'
import { Layout } from './components/Layout'
import { EntryPage } from './components/EntryPage'
import { HomePage } from './components/HomePage'
import { getTodayDate, dateToPath } from './utils/dates'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <StorageProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/today" element={<Navigate to={dateToPath(getTodayDate())} replace />} />
            <Route path="/new" element={<Navigate to={dateToPath(getTodayDate())} replace />} />
            <Route path="/:year/:month/:day" element={<EntryPage />} />
          </Routes>
        </Layout>
      </StorageProvider>
    </BrowserRouter>
  )
}

export default App
