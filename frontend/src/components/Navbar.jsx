import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../App'
import { resolveMediaUrl } from '../lib/media'
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  ShieldCheck,
  Phone,
  Mail,
  Facebook,
  Youtube,
  Linkedin,
} from 'lucide-react'

const DEFAULT_LOGO = '/logo.png'

// Custom X (Twitter) icon since lucide's Twitter icon may not display correctly
const XIcon = ({ size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Navbar() {
  const { t, dir, toggleLang, settings } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState(null)
  const [logoSrc, setLogoSrc] = useState(DEFAULT_LOGO)

  const navigate = useNavigate()
  const location = useLocation()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDrop(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    setLogoSrc(resolveMediaUrl(settings?.logo_url?.trim() || '') || DEFAULT_LOGO)
  }, [settings?.logo_url])

  const navBg =
    !isHome || scrolled
      ? 'bg-dark/95 backdrop-blur-md shadow-lg shadow-black/25'
      : 'bg-transparent'

  const dropdowns = useMemo(
    () => ({
      activities: [
        { label: t.nav.events, href: '/events' },
        { label: t.nav.seminars, href: '/events?type=seminar' },
        { label: t.nav.projects, href: '/events?type=project' },
      ],
      fields: [
        { label: t.nav.heritage_field, href: '/fields?f=heritage' },
        { label: t.nav.studies, href: '/fields?f=studies', parent: t.nav.science },
        { label: t.nav.training, href: '/fields?f=training', parent: t.nav.science },
        { label: t.nav.culture, href: '/fields?f=culture' },
        { label: t.nav.environment, href: '/fields?f=environment' },
      ],
      heritage_life: [
        { label: t.nav.tangible, href: '/heritage-life?type=tangible' },
        { label: t.nav.intangible, href: '/heritage-life?type=intangible' },
      ],
    }),
    [t]
  )

  const isActiveQueryLink = (to) => {
    if (!to) return false
    const [path, qs] = String(to).split('?')

    const pathActive =
      location.pathname === path ||
      (path !== '/' && location.pathname.startsWith(path + '/'))

    if (!qs) return pathActive

    const target = new URLSearchParams(qs)
    const current = new URLSearchParams(location.search)
    for (const [k, v] of target.entries()) {
      if (current.get(k) !== v) return false
    }
    return pathActive
  }

  const dropdownActive = (key) =>
    (dropdowns[key] || []).some((it) => isActiveQueryLink(it.href))

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      {/* Top bar */}
      <div className="border-b border-white/10 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-400">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <Phone size={14} className="text-primary" />
              <span dir="ltr">{settings?.contact_phone || ''}</span>
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} className="text-primary" />
              <span dir="ltr">{settings?.contact_email || ''}</span>
            </span>
          </div>

          <div className="flex gap-3 items-center">
            {settings?.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
            )}
            {settings?.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            )}
            {settings?.social_linkedin && (
              <a href={settings.social_linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            )}
            {settings?.social_x && (
              <a href={settings.social_x} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors" aria-label="X">
                <XIcon size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img
            src={logoSrc}
            alt={settings?.site_name_en || settings?.site_name_ar || 'Yemen Heritage for Peace'}
            className="h-11 w-auto drop-shadow-md"
            onError={(e) => {
              if (e.currentTarget.src !== window.location.origin + DEFAULT_LOGO) {
                setLogoSrc(DEFAULT_LOGO)
              }
            }}
          />
          <div className="hidden sm:block">
            <div className="text-white font-bold text-sm leading-tight">
              {settings?.site_name_ar || 'منظمة تراث اليمن'}
            </div>
            <div className="text-primary text-xs">
              {settings?.site_name_en || 'Yemen Heritage for Peace'}
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-3" style={{ direction: dir }}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t.nav.home}
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t.nav.about}
          </NavLink>

          <NavLink to="/news" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t.nav.news}
          </NavLink>

          <DropMenu
            label={t.nav.activities}
            items={dropdowns.activities}
            open={openDrop === 'activities'}
            onToggle={() => setOpenDrop((o) => (o === 'activities' ? null : 'activities'))}
            active={dropdownActive('activities')}
          />

          <DropMenu
            label={t.nav.fields}
            items={dropdowns.fields}
            open={openDrop === 'fields'}
            onToggle={() => setOpenDrop((o) => (o === 'fields' ? null : 'fields'))}
            active={dropdownActive('fields')}
          />

          <DropMenu
            label={t.nav.heritage_life}
            items={dropdowns.heritage_life}
            open={openDrop === 'heritage_life'}
            onToggle={() => setOpenDrop((o) => (o === 'heritage_life' ? null : 'heritage_life'))}
            active={dropdownActive('heritage_life')}
          />

          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t.nav.contact}
          </NavLink>
        </div>

        <div className="hidden xl:flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-white/90 hover:text-primary transition-colors text-sm py-1.5 px-3 rounded-lg border border-white/20 hover:border-primary/50"
          >
            <Globe size={14} />
            <span>{t.nav.lang}</span>
          </button>

          <button
            onClick={() => navigate('/admin/login')}
            className="flex items-center gap-1.5 text-white/90 hover:text-primary transition-colors text-sm py-1.5 px-3 rounded-lg border border-white/20 hover:border-primary/50"
          >
            <ShieldCheck size={14} />
            <span>{t.nav.admin}</span>
          </button>
        </div>

        <button className="xl:hidden text-white p-2" onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="xl:hidden bg-dark/98 backdrop-blur-md border-t border-white/10 px-4 pb-4 max-h-[80vh] overflow-y-auto">
          {[
            { label: t.nav.home, href: '/' },
            { label: t.nav.about, href: '/about' },
            { label: t.nav.news, href: '/news' },
            { label: t.nav.events, href: '/events' },
            { label: t.nav.fields, href: '/fields' },
            { label: t.nav.heritage_life, href: '/heritage-life' },
            { label: t.nav.contact, href: '/contact' },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={[
                'block py-3 border-b border-white/5 transition-colors',
                isActiveQueryLink(item.href) ? 'text-primary font-semibold' : 'text-white/90 hover:text-primary',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex gap-3 mt-4">
            <button onClick={toggleLang} className="flex-1 btn-outline py-2 text-sm justify-center">
              {t.nav.lang}
            </button>
            <button onClick={() => navigate('/admin/login')} className="flex-1 btn-primary py-2 text-sm justify-center">
              {t.nav.admin}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

function DropMenu({ label, items, open, onToggle, active }) {
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && open) onToggle()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onToggle])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className={`nav-link ${active ? 'active' : ''} flex items-center gap-1`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="dropdown-menu">
          {items.map((item, i) => (
            <Link key={i} to={item.href} className="dropdown-item">
              {item.parent && <span className="text-primary/60 text-xs block">{item.parent} /</span>}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}