import { useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { resolveMediaUrl } from '../lib/media'
import ImageUpload from './ImageUpload'
import { Plus, Edit, Trash2, X, Save, Link2 } from 'lucide-react'
import { ConfirmContext } from './AdminLayout'
import { useAdminLang } from './adminI18n'

const EMPTY = {
  image_url: '', caption_ar: '', caption_en: '',
  alt_ar: '', alt_en: '',
  link_url: '', link_text_ar: '', link_text_en: '',   // FIX: CTA fields
  sort_order: 0, is_active: true,
}

export default function ManageHero() {
  const { t, isRtl } = useAdminLang()
  const { requestConfirm } = useContext(ConfirmContext)
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/hero/all').then(d=>setItems(d||[])).catch(()=>setItems([])).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal('form') }
  const openEdit = (item) => {
    setForm({
      image_url: item.image_url||'', caption_ar: item.caption_ar||'', caption_en: item.caption_en||'',
      alt_ar: item.alt_ar||'', alt_en: item.alt_en||'',
      link_url: item.link_url||'', link_text_ar: item.link_text_ar||'', link_text_en: item.link_text_en||'',
      sort_order: item.sort_order||0, is_active: item.is_active!==0,
    })
    setEditId(item.id); setModal('form')
  }

  const handleSave = async () => {
    if (!form.image_url) { toast.error(t.imageRequired); return }
    setSaving(true)
    try {
      const payload = { ...form, sort_order: Number(form.sort_order)||0, is_active: !!form.is_active }
      if (editId) await api.put(`/hero/${editId}`, payload)
      else        await api.post('/hero', payload)
      toast.success(editId ? t.saved : t.added)
      load(); setModal(null)
    } catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const confirmed = await requestConfirm({
      title: isRtl ? 'تأكيد حذف الصورة' : 'Delete slide?',
      message: isRtl ? 'سيتم حذف صورة الواجهة هذه نهائياً.' : 'This hero slide will be permanently removed.',
      variant: 'danger',
      confirmText: t.delete,
    })
    if (!confirmed) return
    try { await api.delete(`/hero/${id}`); toast.success(t.deleted); load() }
    catch(e) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t.manageHero}</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={16}/>{t.addSlide}</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.image}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.caption}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.ctaLink}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.order}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.status}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center p-8 text-gray-400">{t.loading}</td></tr>
            : items.length===0 ? <tr><td colSpan={6} className="text-center p-8 text-gray-400">{t.noSlides}</td></tr>
            : items.map(item=>(
              <tr key={item.id} className="table-row border-b border-gray-50">
                <td className="p-3"><img src={resolveMediaUrl(item.image_url)} alt="" className="w-16 h-12 object-cover rounded-lg"/></td>
                <td className="p-4">
                  <div className="text-dark font-medium line-clamp-1">{isRtl?(item.caption_ar||'—'):(item.caption_en||item.caption_ar||'—')}</div>
                  {item.caption_en && isRtl && <div className="text-xs text-gray-400 line-clamp-1" dir="ltr">{item.caption_en}</div>}
                </td>
                {/* FIX: show CTA link in table */}
                <td className="p-4 text-xs text-gray-500">
                  {item.link_url
                    ? <a href={item.link_url} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1" dir="ltr"><Link2 size={11}/>{item.link_url.slice(0,30)}{item.link_url.length>30?'…':''}</a>
                    : <span className="text-gray-300">—</span>}
                </td>
                <td className="p-4 text-gray-500">{item.sort_order||0}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.is_active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                    {item.is_active?t.active:t.hidden}
                  </span>
                </td>
                <td className="p-4"><div className="flex gap-2">
                  <button onClick={()=>openEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button>
                  <button onClick={()=>handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-dark">{editId?t.editSlide:t.addSlide}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <ImageUpload value={form.image_url} onChange={v=>setForm({...form,image_url:v})} folder="hero" label={t.heroImage}/>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.captionAr}</label>
                  <input value={form.caption_ar} onChange={e=>setForm({...form,caption_ar:e.target.value})} className="input-field"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.captionEn}</label>
                  <input value={form.caption_en} onChange={e=>setForm({...form,caption_en:e.target.value})} className="input-field" dir="ltr"/></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.altAr}</label>
                  <input value={form.alt_ar} onChange={e=>setForm({...form,alt_ar:e.target.value})} className="input-field"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.altEn}</label>
                  <input value={form.alt_en} onChange={e=>setForm({...form,alt_en:e.target.value})} className="input-field" dir="ltr"/></div>
              </div>

              {/* FIX: CTA link fields */}
              <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{t.ctaSection}</p>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.ctaLink}</label>
                  <input value={form.link_url} onChange={e=>setForm({...form,link_url:e.target.value})} className="input-field" dir="ltr" placeholder="https://..."/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.ctaTextAr}</label>
                    <input value={form.link_text_ar} onChange={e=>setForm({...form,link_text_ar:e.target.value})} className="input-field" placeholder={isRtl?'اعرف المزيد':''}/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.ctaTextEn}</label>
                    <input value={form.link_text_en} onChange={e=>setForm({...form,link_text_en:e.target.value})} className="input-field" dir="ltr" placeholder="Learn More"/></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.order}</label>
                  <input type="number" value={form.sort_order} onChange={e=>setForm({...form,sort_order:e.target.value})} className="input-field"/></div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={e=>setForm({...form,is_active:e.target.checked})} className="w-4 h-4 accent-primary"/>
                    <span className="text-sm text-gray-700">{t.activePublic}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={handleSave} disabled={saving} className="btn-primary"><Save size={16}/>{saving?t.saving:t.save}</button>
              <button onClick={()=>setModal(null)} className="btn-outline">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
