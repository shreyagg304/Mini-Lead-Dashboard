import './App.css'
import LeadsListPage from './pages/LeadsListPage.tsx'
import { Routes, Route , Navigate } from 'react-router-dom'
import LeadDetailPage from './pages/LeadDetailPage.tsx'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/leads" />} />
        <Route path='/leads' element={<LeadsListPage/>} />
        <Route path='/leads/:id' element={<LeadDetailPage />} />
      </Routes>
    </>
  )
}

export default App
