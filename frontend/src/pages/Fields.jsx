import { useSearchParams } from 'react-router-dom'
import { useLang } from '../App'
import { resolveMediaUrl } from '../lib/media'
import { Mountain, BookOpen, Leaf, FlaskConical, GraduationCap } from 'lucide-react'
import PageHeader from '../components/PageHeader'

const FIELDS_DATA = {
  heritage: {
    icon: Mountain,
    color: 'from-amber-500 to-orange-600',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1280px-The_castle_above_Taiz_%288683935588%29.jpg',
    desc_ar: 'يُعدّ التراث المعماري والأثري اليمني من أغنى وأعرق التراثات في المنطقة. تعمل المنظمة على توثيق وصون المواقع والمباني التاريخية من خلال الدراسات الميدانية والتوثيق الرقمي والشراكات البحثية.',
    desc_en: 'Yemeni architectural and archaeological heritage is among the richest in the region. The organization works to document and preserve historic sites through field studies, digital documentation, and research partnerships.',
  },
  studies: {
    icon: FlaskConical,
    color: 'from-primary to-primary-dark',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1280px-Temple_in_Ancient_city_of_Marib.jpg',
    desc_ar: 'تُنجز المنظمة دراسات وبحوث علمية متخصصة في مجالات التراث والثقافة والتاريخ، وتُصدر تقارير تحليلية وأوراق بحثية تُسهم في إثراء المعرفة وصنع السياسات.',
    desc_en: 'The organization conducts specialized scientific studies and research in heritage, culture, and history, publishing analytical reports and research papers.',
  },
  training: {
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/1280px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg',
    desc_ar: 'تُنظّم المنظمة برامج تدريبية متخصصة تهدف إلى بناء قدرات الكوادر الوطنية في مجالات التراث والتوثيق والبحث العلمي، مع التركيز على فئة الشباب وتمكينهم.',
    desc_en: 'The organization runs specialized training programs to build national capacities in heritage documentation and scientific research, focusing on youth empowerment.',
  },
  culture: {
    icon: BookOpen,
    color: 'from-purple-500 to-violet-600',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Socotra_Yemen.jpg/1280px-Socotra_Yemen.jpg',
    desc_ar: 'تُعزز المنظمة الهوية الثقافية اليمنية من خلال الفعاليات الثقافية والفنية والأدبية، وتدعم المبدعين والفنانين المحليين وتوفر منصات لإبراز الموروث الثقافي اليمني.',
    desc_en: 'The organization promotes Yemeni cultural identity through cultural, artistic, and literary events, supporting local creators and providing platforms to showcase Yemeni cultural heritage.',
  },
  environment: {
    icon: Leaf,
    color: 'from-green-500 to-emerald-600',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shibam_Wadi_Hadhramaut_Yemen.jpg/1280px-Shibam_Wadi_Hadhramaut_Yemen.jpg',
    desc_ar: 'تعمل المنظمة على الحفاظ على البيئة الطبيعية اليمنية وتعزيز السياحة التراثية المستدامة، وتنفذ مبادرات لحماية المناطق الطبيعية والسياحية ذات القيمة التراثية.',
    desc_en: 'The organization works to preserve Yemen\'s natural environment and promote sustainable heritage tourism, implementing initiatives to protect natural and heritage tourism areas.',
  },
}

export default function Fields() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const active = searchParams.get('f') || 'heritage'
  const field = FIELDS_DATA[active] || FIELDS_DATA.heritage

  const tabs = [
    { key: 'heritage', label: t.nav.heritage_field },
    { key: 'studies', label: t.nav.studies },
    { key: 'training', label: t.nav.training },
    { key: 'culture', label: t.nav.culture },
    { key: 'environment', label: t.nav.environment },
  ]

  return (
    <main>
      <PageHeader title={t.fields_title} subtitle={lang === 'ar' ? 'مجالات عمل المنظمة وبرامجها' : 'The organization’s focus areas and programs'} />
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tabs.map(tab => (
              <a key={tab.key} href={`/fields?f=${tab.key}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active===tab.key?'bg-primary text-white shadow-md':'bg-white text-gray-600 hover:bg-primary/10 border border-gray-200'}`}>
                {tab.label}
              </a>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img src={field.img} alt="" className="rounded-2xl shadow-xl h-72 w-full object-cover" />
            <div>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${field.color} flex items-center justify-center mb-4`}>
                <field.icon size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-dark mb-3">
                {tabs.find(t => t.key === active)?.label}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {lang==='ar' ? field.desc_ar : field.desc_en}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
