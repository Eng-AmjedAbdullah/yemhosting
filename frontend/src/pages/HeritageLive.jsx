import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../App'
import api from '../lib/api'
import { MapPin, Clock, Landmark, Sparkles } from 'lucide-react'
import PageHeader from '../components/PageHeader'
export default function HeritageLive() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'tangible')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const isRtl = lang === 'ar'

  useEffect(() => {
    setLoading(true)
    api.get(`/heritage?type=${activeType}`).then(d => setItems(d || [])).catch(() => setItems([])).finally(() => setLoading(false))
  }, [activeType])

  return (
    <main>
      <PageHeader
        title={t.heritage_life_title}
        subtitle={isRtl ? 'اكتشف التراث المادي واللامادي اليمني' : 'Discover Yemeni tangible and intangible heritage'}
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Tabs */}
          <div className="flex gap-2 justify-center mb-8">
            {[
              { key: 'tangible', label: t.nav.tangible, Icon: Landmark },
              { key: 'intangible', label: t.nav.intangible, Icon: Sparkles }
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all duration-200 text-sm ${
                  activeType === key
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-white text-gray-600 hover:bg-primary/10 border border-gray-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map(item => (
                <div key={item.id} className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={item.image_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/800px-Temple_in_Ancient_city_of_Marib.jpg'}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                    <div className="absolute top-3 start-3 bg-primary/90 backdrop-blur text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      {activeType === 'tangible' ? <Landmark size={11} /> : <Sparkles size={11} />}
                      {activeType === 'tangible' ? t.nav.tangible : t.nav.intangible}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-dark text-base leading-snug mb-2">
                      {isRtl ? item.title : (item.title_en || item.title)}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-3">
                      {isRtl ? item.content : (item.content_en || item.content)}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400 border-t border-gray-50 pt-3">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-primary" />
                          {item.location}
                        </span>
                      )}
                      {item.period && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-primary" />
                          {item.period}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && items.length === 0 && (
            <div className="text-center py-16">
              <Landmark size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">{t.no_items}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
