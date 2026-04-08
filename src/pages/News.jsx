import { useState, useEffect } from 'react'
import { useLang } from '../App'
import api from '../lib/api'
import { resolveMediaUrl } from '../lib/media'
import { Search, Newspaper, Calendar } from 'lucide-react'
import PageHeader from '../components/PageHeader'


export default function News() {
  const { t, lang } = useLang()
  const [news, setNews] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const isRtl = lang === 'ar'

  useEffect(() => {
    api.get('/news?limit=100').then(d => setNews(d || [])).catch(() => setNews([])).finally(() => setLoading(false))
  }, [])

  const filtered = news.filter(n => {
    const title = isRtl ? n.title : (n.title_en || n.title)
    return title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <main>
      <PageHeader
        title={t.nav.news}
        subtitle={isRtl ? 'آخر الأخبار والتحديثات من المنظمة' : 'Latest updates and announcements'}
      >
        <div className="relative max-w-lg mx-auto">
          <Search
            className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
            style={{ [isRtl ? 'right' : 'left']: '14px' }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={isRtl ? 'ابحث في الأخبار...' : 'Search news...'}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-dark placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
            style={{
              paddingLeft: isRtl ? '14px' : '46px',
              paddingRight: isRtl ? '46px' : '14px',
            }}
          />
        </div>
      </PageHeader>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <>
              {search && (
                <p className="text-gray-500 text-sm mb-4 text-center">
                  {isRtl ? `${filtered.length} نتيجة` : `${filtered.length} results`}
                </p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => (
                  <div key={item.id} className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={resolveMediaUrl(item.image_url)|| 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/800px-The_castle_above_Taiz_%288683935588%29.jpg'}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 start-3 text-xs text-white bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                        {isRtl ? item.category : (item.category_en || item.category)}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-dark text-base leading-snug mb-2 line-clamp-2">
                        {isRtl ? item.title : (item.title_en || item.title)}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-3">
                        {isRtl ? item.content : (item.content_en || item.content)}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400 border-t border-gray-50 pt-3">
                        <Calendar size={12} />
                        {new Date(item.created_at).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Newspaper size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">{t.no_items}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
