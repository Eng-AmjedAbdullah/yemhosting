import { useState, useEffect } from 'react'
import { resolveMediaUrl } from '../lib/media'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Newspaper, Calendar, Users, MessageSquare, Mountain, ExternalLink, Handshake, Images, Settings, Activity, Eye } from 'lucide-react'
import { useAdminLang } from './adminI18n'

export default function Dashboard() {
  const { t, isRtl } = useAdminLang()
  const [stats, setStats] = useState({ news:0, events:0, admins:0, messages:0, heritage:0, partners:0, hero:0, unreadMessages:0 })
  const [recentNews, setRecentNews] = useState([])
  const [recentEvents, setRecentEvents] = useState([])

  useEffect(() => {
    Promise.allSettled([
      api.get('/news/all'),
      api.get('/events/all'),
      api.get('/admins'),
      api.get('/contact'),
      api.get('/heritage/all'),
      api.get('/partners/all'),
      api.get('/hero/all'),
    ]).then(([news, events, admins, msgs, heritage, partners, hero]) => {
      const newsData = news.value || []
      const eventsData = events.value || []
      const messagesData = msgs.value || []

      setStats({
        news: newsData.length,
        events: eventsData.length,
        admins: admins.value?.length || 0,
        messages: messagesData.length,
        heritage: heritage.value?.length || 0,
        partners: partners.value?.length || 0,
        hero: hero.value?.length || 0,
        unreadMessages: messagesData.filter(m => !m.read_status).length,
      })

      setRecentNews(newsData.slice(0, 3))
      setRecentEvents(eventsData.slice(0, 3))
    })
  }, [])

  const cards = [
    { label: t.news, value:stats.news, icon:Newspaper, color:'bg-blue-500', href:'/admin/news' },
    { label: t.events, value:stats.events, icon:Calendar, color:'bg-green-500', href:'/admin/events' },
    { label: t.heritageLife, value:stats.heritage, icon:Mountain, color:'bg-amber-500', href:'/admin/heritage' },
    { label: t.partners, value:stats.partners, icon:Handshake, color:'bg-sky-500', href:'/admin/partners' },
    { label: t.heroSlides, value:stats.hero, icon:Images, color:'bg-teal-500', href:'/admin/hero' },
    { label: t.messages, value:stats.messages, icon:MessageSquare, color:'bg-primary', href:'/admin/messages', badge: stats.unreadMessages },
    { label: t.admins, value:stats.admins, icon:Users, color:'bg-slate-500', href:'/admin/admins' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark flex items-center gap-2">
          <Activity className="text-primary" size={32}/>
          {t.dashboardTitle}
        </h1>
        <p className="text-gray-500 text-sm mt-2">{t.dashboardSubtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        {cards.map((card,i)=>(
          <Link key={i} to={card.href} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary/20 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <card.icon size={20} className="text-white"/>
                </div>
                {card.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{card.badge}</span>
                )}
              </div>
              <div className="text-3xl font-bold text-dark mb-1">{card.value}</div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-dark text-lg">{t.latestNews}</h2>
            <Link to="/admin/news" className="text-primary text-sm hover:underline flex items-center gap-1">
              {t.viewAll} <ExternalLink size={12}/>
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">{t.noNews}</p>
            ) : (
              recentNews.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  {item.image_url && (
                    <img src={resolveMediaUrl(item.image_url)} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0"/>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark text-sm line-clamp-1">{isRtl ? item.title : (item.title_en || item.title)}</h3>
                    <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')}</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {item.published ? t.published : t.draft}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-dark text-lg">{t.upcomingEvents}</h2>
            <Link to="/admin/events" className="text-primary text-sm hover:underline flex items-center gap-1">
              {t.viewAll} <ExternalLink size={12}/>
            </Link>
          </div>
          <div className="space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">{t.noEvents}</p>
            ) : (
              recentEvents.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    item.type === 'event' ? 'bg-blue-100' :
                    item.type === 'seminar' ? 'bg-purple-100' :
                    item.type === 'training' ? 'bg-amber-100' : 'bg-green-100'
                  }`}>
                    <Calendar size={20} className={
                      item.type === 'event' ? 'text-blue-600' :
                      item.type === 'seminar' ? 'text-purple-600' :
                      item.type === 'training' ? 'text-amber-600' : 'text-green-600'
                    }/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-dark text-sm line-clamp-1">{isRtl ? item.title : (item.title_en || item.title)}</h3>
                    <p className="text-xs text-gray-400 mt-1">{item.event_date ? new Date(item.event_date).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US') : t.notSet}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 via-white to-primary/5 rounded-2xl p-6 shadow-sm border border-primary/20">
        <h2 className="font-bold text-dark mb-4 text-lg">{t.quickActions}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/admin/news" className="btn-primary text-sm py-3 justify-center">
            <Newspaper size={16}/>{t.addNews}
          </Link>
          <Link to="/admin/events" className="btn-outline text-sm py-3 justify-center">
            <Calendar size={16}/>{t.addEvent}
          </Link>
          <Link to="/admin/heritage" className="btn-outline text-sm py-3 justify-center">
            <Mountain size={16}/>{t.addHeritage}
          </Link>
          <Link to="/admin/partners" className="btn-outline text-sm py-3 justify-center">
            <Handshake size={16}/>{t.addPartner}
          </Link>
          <Link to="/admin/hero" className="btn-outline text-sm py-3 justify-center">
            <Images size={16}/>{t.addSlide}
          </Link>
          <Link to="/admin/settings" className="btn-outline text-sm py-3 justify-center">
            <Settings size={16}/>{t.siteSettings}
          </Link>
          <Link to="/admin/admins" className="btn-outline text-sm py-3 justify-center">
            <Users size={16}/>{t.addAdmin}
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="btn-outline text-sm py-3 justify-center">
            <Eye size={16}/>{t.viewSite}
          </a>
        </div>
      </div>
    </div>
  )
}
