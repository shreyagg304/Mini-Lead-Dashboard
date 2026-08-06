import './App.css'
import LeadsListPage from './pages/LeadsListPage.tsx'
import { Routes, Route , Navigate } from 'react-router-dom'
import LeadDetailPage from './pages/LeadDetailPage.tsx'
import CreateLeadPage from './pages/CreateLeadPage.tsx'
import EditLeadPage from './pages/EditLeadPage.tsx'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { darkTheme, lightTheme } from './theme/theme.ts'
import { useState } from 'react'

function App() {

  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Routes>
        <Route path='/' element={<Navigate to="/leads" />} />
        <Route 
          path='/leads' 
          element={
            <LeadsListPage
              isDark={isDark}
              setIsDark={setIsDark}
            />
          } 
        />
        <Route path='/leads/:id' element={<LeadDetailPage />} />
        <Route path='/leads/new' element={<CreateLeadPage />} />
        <Route path='/leads/:id/edit' element={<EditLeadPage/>} />
      </Routes>
    </ThemeProvider>
    </>
  )
}

export default App
