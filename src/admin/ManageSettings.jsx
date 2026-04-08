import { useEffect, useState } from 'react'
import api from '../lib/api'
import { resolveMediaUrl } from '../lib/media'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'
import { Save } from 'lucide-react'
import { useLang } from '../App'
import { useAdminLang } from './adminI18n'

const EMPTY = {
  site_name_ar:'', site_name_en:'', logo_url:'', favicon_url:'',
  contact_phone:'', contact_email:'', address_ar:'', address_en:'',
  footer_desc_ar:'', footer_desc_en:'',
  social_facebook:'', social_youtube:'', social_linkedin:'', social_x:'',
  home_about_image_url:'', home_about_image_alt_ar:'', home_about_image_alt_en:'',
  about_desc_ar:'', about_desc_en:'',
  vision_ar:'', vision_en:'', mission_ar:'', mission_en:'',
}

export default function ManageSettings() {
  const { refreshSettings } = useLang()
  const { t, isRtl }        = useAdminLang()
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [activeTab, setActiveTab] = useState('identity')

  const load = () => {
    setLoading(true)
    api.get('/settings').then(d=>setForm({...EMPTY,...(d||{})})).catch(()=>setForm(EMPTY)).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const save = async () => {
    setSaving(true)
    try { await api.put('/settings', form); toast.success(t.settingsSaved); refreshSettings?.(); load() }
    catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const F = ({ label, k, dir, placeholder, type='text' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} className="input-field" dir={dir||''} placeholder={placeholder||''}/>
    </div>
  )
  const TA = ({ label, k, rows=4 }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea rows={rows} value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} className="input-field resize-none"/>
    </div>
  )

  const tabs = [
    { id:'identity', label: isRtl ? 'هوية الموقع' : 'Identity' },
    { id:'contact',  label: isRtl ? 'التواصل'    : 'Contact'  },
    { id:'about',    label: isRtl ? 'من نحن'     : 'About'    },
    { id:'social',   label: isRtl ? 'السوشيال'   : 'Social'   },
    { id:'footer',   label: isRtl ? 'التذييل'    : 'Footer'   },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t.manageSiteSettings}</h1>
        <button onClick={save} disabled={saving||loading} className="btn-primary"><Save size={16}/>{saving?t.saving:t.save}</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab===tab.id?'bg-white shadow text-dark':'text-gray-500 hover:text-dark'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? <div className="text-center p-10 text-gray-400">{t.loading}</div> : (
          <>
            {/* FIX: Identity tab */}
            {activeTab==='identity' && (
              <div className="space-y-4">
                <h2 className="font-bold text-dark mb-4">{isRtl ? 'هوية وشعار الموقع' : 'Site Identity & Logo'}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <F label={isRtl?'اسم الموقع (عربي)':'Site Name (Arabic)'} k="site_name_ar"/>
                  <F label={isRtl?'اسم الموقع (إنجليزي)':'Site Name (English)'} k="site_name_en" dir="ltr"/>
                </div>
                <ImageUpload value={form.logo_url||''} onChange={v=>setForm({...form,logo_url:v})} folder="site" label={isRtl?'شعار الموقع (Logo)':'Site Logo'}/>
                <F label={isRtl?'رابط الـ Favicon':'Favicon URL'} k="favicon_url" dir="ltr" placeholder="https://..."/>
              </div>
            )}

            {/* Contact tab */}
            {activeTab==='contact' && (
              <div className="space-y-4">
                <h2 className="font-bold text-dark mb-4">{t.contactInfo}</h2>
                <F label={t.phone} k="contact_phone" dir="ltr"/>
                <F label={t.email} k="contact_email" dir="ltr" type="email"/>
                <div className="grid grid-cols-2 gap-4">
                  <F label={t.addressAr} k="address_ar"/>
                  <F label={t.addressEn} k="address_en" dir="ltr"/>
                </div>
              </div>
            )}

            {/* FIX: About tab */}
            {activeTab==='about' && (
              <div className="space-y-4">
                <h2 className="font-bold text-dark mb-4">{isRtl?'محتوى صفحة من نحن':'About Page Content'}</h2>
                <ImageUpload value={form.home_about_image_url||''} onChange={v=>setForm({...form,home_about_image_url:v})} folder="site" label={isRtl?'صورة قسم من نحن':'About Section Image'}/>
                <div className="grid grid-cols-2 gap-4">
                  <F label={t.altAr} k="home_about_image_alt_ar"/>
                  <F label={t.altEn} k="home_about_image_alt_en" dir="ltr"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TA label={isRtl?'وصف المنظمة (عربي)':'Organization Description (AR)'} k="about_desc_ar" rows={3}/>
                  <TA label={isRtl?'وصف المنظمة (إنجليزي)':'Organization Description (EN)'} k="about_desc_en" rows={3}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TA label={isRtl?'الرؤية (عربي)':'Vision (Arabic)'} k="vision_ar" rows={2}/>
                  <TA label={isRtl?'الرؤية (إنجليزي)':'Vision (English)'} k="vision_en" rows={2}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TA label={isRtl?'الرسالة (عربي)':'Mission (Arabic)'} k="mission_ar" rows={2}/>
                  <TA label={isRtl?'الرسالة (إنجليزي)':'Mission (English)'} k="mission_en" rows={2}/>
                </div>
              </div>
            )}

            {/* Social tab */}
            {activeTab==='social' && (
              <div className="space-y-4">
                <h2 className="font-bold text-dark mb-4">{t.socialLinks}</h2>
                {[{k:'social_facebook',label:'Facebook'},{k:'social_youtube',label:'YouTube'},{k:'social_linkedin',label:'LinkedIn'},{k:'social_x',label:'X (Twitter)'}].map(({k,label})=>(
                  <F key={k} label={label} k={k} dir="ltr" placeholder="https://..."/>
                ))}
              </div>
            )}

            {/* Footer tab */}
            {activeTab==='footer' && (
              <div className="space-y-4">
                <h2 className="font-bold text-dark mb-4">{t.footerText}</h2>
                <TA label={t.footerDescAr} k="footer_desc_ar"/>
                <TA label={t.footerDescEn} k="footer_desc_en"/>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={save} disabled={saving||loading} className="btn-primary"><Save size={16}/>{saving?t.saving:t.saveSettings}</button>
      </div>
    </div>
  )
}
