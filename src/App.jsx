import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, createContext, useContext } from 'react'
import { Toaster } from 'react-hot-toast'
import { translations } from './lib/i18n'
import api from './lib/api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import News from './pages/News'
import Events from './pages/Events'
import Fields from './pages/Fields'
import HeritageLive from './pages/HeritageLive'
import Contact from './pages/Contact'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import ManageNews from './admin/ManageNews'
import ManageEvents from './admin/ManageEvents'
import ManageHeritage from './admin/ManageHeritage'
import ManageAdmins from './admin/ManageAdmins'
import ManageMessages from './admin/ManageMessages'
import Profile from './admin/Profile'
import ManagePartners from './admin/ManagePartners'
import ManageHero from './admin/ManageHero'
import ManageSettings from './admin/ManageSettings'

export const AppContext = createContext()
export const useLang = () => useContext(AppContext)

export default function App() {
  const [lang, setLang] = useState('ar')
  const t = translations[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const toggleLang = () => setLang(l => l === 'ar' ? 'en' : 'ar')

  const [settings, setSettings] = useState(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  const refreshSettings = async () => {
    setSettingsLoading(true)
    try {
      const s = await api.get('/settings')
      setSettings(s)
    } catch {
      setSettings(null)
    } finally {
      setSettingsLoading(false)
    }
  }

  useEffect(() => {
    refreshSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppContext.Provider value={{ lang, t, dir, toggleLang, settings, settingsLoading, refreshSettings }}>
      <div dir={dir} className={lang === 'ar' ? 'font-ar' : 'font-en'}>
        <BrowserRouter>
          <Toaster
            position="top-center"
            gutter={10}
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '14px 18px',
                maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
                iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
              },
              error: {
                duration: 4500,
                style: {
                  background: '#fff',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
                iconTheme: { primary: '#dc2626', secondary: '#fff' },
              },
            }}
          />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="news" element={<ManageNews />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="heritage" element={<ManageHeritage />} />
              <Route path="partners" element={<ManagePartners />} />
              <Route path="hero" element={<ManageHero />} />
              <Route path="settings" element={<ManageSettings />} />
              <Route path="admins" element={<ManageAdmins />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/fields" element={<Fields />} />
                  <Route path="/heritage-life" element={<HeritageLive />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  )
}
