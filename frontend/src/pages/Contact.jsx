import { useState } from 'react'
import { useLang } from '../App'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Send, Phone, Mail, MapPin, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react'
import PageHeader from '../components/PageHeader'

export default function Contact() {
  const { t, lang, settings } = useLang()
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error(lang==='ar'?'يرجى ملء جميع الحقول المطلوبة':'Please fill all required fields'); return
    }
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success(lang==='ar'?'تم إرسال رسالتك بنجاح!':'Message sent successfully!')
      setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    } catch(e) {
      toast.error(e.message||'Error')
    }
    setLoading(false)
  }

  return (
    <main>
      <PageHeader title={t.contact_title} subtitle={lang === 'ar' ? 'يسعدنا تواصلكم معنا' : 'We’d love to hear from you'} />
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">{lang==='ar'?'معلومات التواصل':'Contact Information'}</h2>
            <div className="space-y-4 mb-8">
              {[
                {icon:Phone, label:t.phone, value:settings?.contact_phone || '', href: settings?.contact_phone ? `tel:${settings.contact_phone}` : '#'},
                {icon:Mail, label:t.email, value:settings?.contact_email || '', href: settings?.contact_email ? `mailto:${settings.contact_email}` : '#'},
                {icon:MapPin, label:t.address, value: lang==='ar' ? (settings?.address_ar || t.address_val) : (settings?.address_en || t.address_val), href:'#'},
              ].filter(x => x.value).map((c,i)=>(
                <a key={i} href={c.href} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary/30 transition-colors group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                    <c.icon size={20} className="text-primary group-hover:text-white transition-colors"/>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{c.label}</div>
                    <div className="font-medium text-dark" dir="ltr">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
            <p className="font-semibold text-dark mb-4">{lang==='ar'?'تابعنا على:':'Follow Us:'}</p>
            <div className="flex gap-3">
              {[
                {icon:Facebook, href:settings?.social_facebook, color:'hover:bg-blue-600'},
                {icon:Youtube, href:settings?.social_youtube, color:'hover:bg-red-600'},
                {icon:Linkedin, href:settings?.social_linkedin, color:'hover:bg-blue-700'},
                {icon:Twitter, href:settings?.social_x, color:'hover:bg-black'},
              ].filter(x => x.href).map((s,i)=>(
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className={`w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center ${s.color} hover:text-white hover:border-transparent transition-all shadow-sm`}>
                  <s.icon size={18}/>
                </a>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-dark mb-6">{lang==='ar'?'أرسل رسالة':'Send a Message'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.name_field} *</label>
                  <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" required/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
                  <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" dir="ltr" required/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang==='ar'?'الموضوع':'Subject'}</label>
                <input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="input-field"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.msg_field} *</label>
                <textarea rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="input-field resize-none" required/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading?'...':<><Send size={16}/>{t.send}</>}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
