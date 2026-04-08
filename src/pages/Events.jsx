import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../App'
import api from '../lib/api'
import { resolveMediaUrl } from '../lib/media'
import {
  Calendar,
  MapPin,
  BookOpen,
  GraduationCap,
  Briefcase,
  Search,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'

const TYPE_LABELS = {
  event: { ar: 'فعالية', en: 'Event' },
  seminar: { ar: 'ندوة', en: 'Seminar' },
  project: { ar: 'مشروع', en: 'Project' },
  training: { ar: 'تدريب', en: 'Training' },
}

const TYPE_COLORS = {
  event: 'bg-blue-50 text-blue-700 border-blue-100',
  seminar: 'bg-purple-50 text-purple-700 border-purple-100',
  project: 'bg-green-50 text-green-700 border-green-100',
  training: 'bg-amber-50 text-amber-700 border-amber-100',
}

const TYPE_ICONS = {
  event: Calendar,
  seminar: BookOpen,
  project: Briefcase,
  training: GraduationCap,
}

function formatEventDate(value, isRtl) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString(isRtl ? 'ar-YE' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Events() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [activeType, setActiveType] = useState(searchParams.get('type') || 'all')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const isRtl = lang === 'ar'

  useEffect(() => {
    let cancelled = false

    async function loadEvents() {
      setLoading(true)
      try {
        const data = await api.get('/events')
        if (!cancelled) {
          setEvents(Array.isArray(data) ? data : [])
        }
      } catch {
        if (!cancelled) {
          setEvents([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return events.filter((item) => {
      const matchesType = activeType === 'all' || item.type === activeType

      const title = isRtl ? item.title : (item.title_en || item.title || '')
      const location = isRtl ? item.location : (item.location_en || item.location || '')
      const normalizedSearch = search.trim().toLowerCase()

      const matchesSearch =
        !normalizedSearch ||
        title?.toLowerCase().includes(normalizedSearch) ||
        location?.toLowerCase().includes(normalizedSearch)

      return matchesType && matchesSearch
    })
  }, [events, activeType, search, isRtl])

  const tabs = [
    { key: 'all', label: isRtl ? 'الكل' : 'All' },
    { key: 'event', label: isRtl ? 'فعاليات' : 'Events' },
    { key: 'seminar', label: t.nav.seminars },
    { key: 'project', label: t.nav.projects },
    { key: 'training', label: isRtl ? 'تدريب' : 'Training' },
  ]

  return (
    <main>
      <PageHeader
        title={t.nav.activities}
        subtitle={
          isRtl
            ? 'فعاليات وندوات ومشاريع وبرامج تدريبية'
            : 'Events, seminars, projects and training programs'
        }
      >
        <div className="relative max-w-lg mx-auto">
          <Search
            className="absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
            style={{ [isRtl ? 'right' : 'left']: '14px' }}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isRtl ? 'ابحث في الفعاليات...' : 'Search events...'}
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
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeType === tab.key
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-white text-gray-600 hover:bg-primary/10 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl h-56 animate-pulse border border-gray-100"
                />
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
                {filtered.map((item) => {
                  const Icon = TYPE_ICONS[item.type] || Calendar
                  const colorClass = TYPE_COLORS[item.type] || TYPE_COLORS.event
                  const typeLabel = isRtl
                    ? (TYPE_LABELS[item.type]?.ar || item.type)
                    : (TYPE_LABELS[item.type]?.en || item.type)

                  const imageSrc = resolveMediaUrl(item.image_url)
                  const title = isRtl ? item.title : (item.title_en || item.title)
                  const location = isRtl ? item.location : (item.location_en || item.location)
                  const content = isRtl ? item.content : (item.content_en || item.content)
                  const formattedDate = formatEventDate(item.event_date, isRtl)

                  return (
                    <div
                      key={item.id}
                      className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
                    >
                      {imageSrc ? (
                        <div className="relative overflow-hidden h-44">
                          <img
                            src={imageSrc}
                            alt={title || typeLabel}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                          <span
                            className={`absolute top-3 start-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass}`}
                          >
                            {typeLabel}
                          </span>
                        </div>
                      ) : (
                        <div className="h-44 flex items-center justify-center bg-gray-100 text-gray-400">
                          <Icon size={28} />
                        </div>
                      )}

                      <div className="p-5">
                        {!imageSrc && (
                          <span
                            className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${colorClass}`}
                          >
                            {typeLabel}
                          </span>
                        )}

                        <h3 className="font-bold text-dark text-base leading-snug mb-3">
                          {title}
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                          {formattedDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-primary" />
                              {formattedDate}
                            </span>
                          )}

                          {location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-primary" />
                              {location}
                            </span>
                          )}
                        </div>

                        {content && (
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {content}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">{t.no_items}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}