import { useLang } from '../App'
import PageHeader from '../components/PageHeader'
import {
  Eye,
  Target,
  HeartHandshake,
  FlaskConical,
  ShieldCheck,
  Users,
} from 'lucide-react'

export default function About() {
  const { t, lang } = useLang()
  const isRtl = lang === 'ar'

  const values = isRtl
    ? [
        { Icon: HeartHandshake, label: 'السلام', desc: 'نعمل من أجل مجتمع يمني يسوده السلام والتعاون.' },
        { Icon: FlaskConical, label: 'الابتكار العلمي', desc: 'توظيف العلم والتكنولوجيا لخدمة التراث والإنسان.' },
        { Icon: ShieldCheck, label: 'الشفافية والاستدامة', desc: 'الالتزام بالحوكمة الرشيدة والمساءلة واستدامة الأثر.' },
        { Icon: Users, label: 'المشاركة المجتمعية', desc: 'إشراك المجتمع المحلي في صون الهوية والتراث.' },
      ]
    : [
        { Icon: HeartHandshake, label: 'Peace', desc: 'Working towards a society of peace and cooperation.' },
        { Icon: FlaskConical, label: 'Scientific Innovation', desc: 'Using science and technology to serve heritage and people.' },
        { Icon: ShieldCheck, label: 'Transparency & Sustainability', desc: 'Good governance, accountability, and sustainable impact.' },
        { Icon: Users, label: 'Community Participation', desc: 'Engaging local communities in preserving identity and heritage.' },
      ]

  const goals = isRtl
    ? t.goals_list
    : [
        'Contributing to educational development and building a sustainable research system that promotes peace and international cooperation.',
        'Protecting, preserving, and reviving cultural heritage and promoting Yemeni intellectual property rights.',
        'Contributing to environmental preservation and protecting it from pollution and climate impacts.',
        'Supporting sustainable tourism development with economic and social benefits while ensuring equality.',
        'Working alongside local and international partners to achieve Sustainable Development Goals.',
      ]

  return (
    <main>
      <PageHeader
        title={t.nav.about}
        subtitle={
          isRtl
            ? 'منظمة مجتمع مدني غير حكومية تأسّست في تعز لصون الحضارة اليمنية العريقة وتوظيفها في خدمة السلام والتنمية المستدامة.'
            : 'A non-governmental civil society organization founded in Taiz to preserve Yemen&apos;s ancient civilization and leverage it for peace and sustainable development.'
        }
      />

      {/* WHO WE ARE */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="section-title mb-4 text-start">{isRtl ? 'من نحن' : 'Who We Are'}</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                {isRtl
                  ? 'منظمة مجتمع مدني غير حكومية تعمل على الحفاظ على التراث الثقافي والعلمي اليمني وتعزيز الوعي المجتمعي به من خلال برامج تعليمية وفعاليات ثقافية وبحوث علمية تربط الماضي بالحاضر لبناء مستقبل سلمي ومستدام.'
                  : 'A non-governmental civil society organization working to preserve Yemeni cultural and scientific heritage, raising community awareness through educational programs, cultural activities, and research that connects the past with the present to build a peaceful and sustainable future.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {isRtl
                  ? 'تعمل المنظمة بالشراكة مع الجهات المحلية والدولية لتعزيز حماية التراث، ودعم المبادرات التي تخدم المعرفة والثقافة والسلام.'
                  : 'We collaborate with local and international partners to protect heritage and support initiatives that advance knowledge, culture, and peace.'}
              </p>
            </div>

            <div className="relative">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1280px-The_castle_above_Taiz_%288683935588%29.jpg"
                alt={isRtl ? 'قلعة القاهرة التاريخية تطل على مدينة تعز' : 'Historic Al-Qahira Castle overlooking Taiz city'}
                className="rounded-2xl shadow-lg h-72 w-full object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -start-4 bg-primary text-white rounded-2xl p-4 shadow-xl">
                <p className="text-xs text-white/80">{isRtl ? 'من أجل' : 'For'}</p>
                <p className="font-bold text-sm">{isRtl ? 'التراث والسلام' : 'Heritage & Peace'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
              <Eye size={22} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-3">{t.vision}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{t.vision_text}</p>
          </div>
          <div className="bg-primary rounded-2xl p-6 text-white shadow-lg">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Target size={22} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t.mission}</h3>
            <p className="text-white/90 leading-relaxed text-sm">{t.mission_text}</p>
          </div>
        </div>
      </section>

      {/* GOALS */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="section-title mb-8">{t.goals}</h2>
          <div className="space-y-3 text-start">
            {goals.map((goal, i) => (
              <div
                key={i}
                className="flex gap-3 items-start bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 rounded-xl p-5 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm shadow-primary/20">
                  {i + 1}
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="section-title mb-8">{t.values}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <v.Icon size={20} className="text-primary" />
                </div>
                <div className="font-bold mb-2 text-dark">{v.label}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}