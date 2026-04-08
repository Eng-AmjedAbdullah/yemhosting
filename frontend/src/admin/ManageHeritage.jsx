import { useState, useEffect, useContext } from 'react'
import api from '../lib/api'
import { resolveMediaUrl } from '../lib/media'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'
import { ConfirmContext } from './AdminLayout'
import { useAdminLang } from './adminI18n'

const EMPTY = { title:'', title_en:'', content:'', content_en:'', type:'tangible', image_url:'', location:'', period:'', published:true }

export default function ManageHeritage() {
  const { t, isRtl } = useAdminLang()
  const { requestConfirm } = useContext(ConfirmContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/heritage/all').then(d=>setItems(d||[])).catch(()=>setItems([])).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (item) => {
    setForm({ title:item.title||'', title_en:item.title_en||'', content:item.content||'', content_en:item.content_en||'',
      type:item.type||'tangible', image_url:item.image_url||'', location:item.location||'', period:item.period||'', published:item.published!==0 })
    setEditId(item.id); setModal(true)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error(t.titleRequired); return }
    setSaving(true)
    try {
      if (editId) await api.put(`/heritage/${editId}`, form)
      else await api.post('/heritage', form)
      toast.success(editId ? t.saved : t.added); load(); setModal(false)
    } catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const confirmed = await requestConfirm({
      title: isRtl ? 'تأكيد حذف العنصر' : 'Delete heritage item?',
      message: isRtl ? 'سيتم حذف هذا العنصر التراثي نهائياً.' : 'This heritage item will be permanently removed.',
      variant: 'danger',
      confirmText: t.delete,
    })
    if (!confirmed) return
    try { await api.delete(`/heritage/${id}`); toast.success(t.deleted); load() }
    catch(e) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t.manageHeritage}</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={16}/>{t.addHeritage}</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.image}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.title}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.eventType}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.location}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="text-center p-8 text-gray-400">{t.loading}</td></tr>
            : items.length===0 ? <tr><td colSpan={5} className="text-center p-8 text-gray-400">{t.noHeritage}</td></tr>
            : items.map(item=>(
              <tr key={item.id} className="table-row border-b border-gray-50">
                <td className="p-3">{item.image_url && <img src={resolveMediaUrl(item.image_url)} alt="" className="w-12 h-12 object-cover rounded-lg"/>}</td>
                <td className="p-4 font-medium text-dark max-w-xs">
                  <div className="line-clamp-1">{isRtl ? item.title : (item.title_en || item.title)}</div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.type==='tangible'?'bg-amber-100 text-amber-700':'bg-purple-100 text-purple-700'}`}>
                    {item.type==='tangible' ? t.tangible : t.intangible}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-xs">{item.location||'—'}</td>
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
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal-box">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-dark">{editId ? t.editHeritage : t.addHeritageItem}</h2>
              <button onClick={()=>setModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUpload value={form.image_url} onChange={v=>setForm({...form,image_url:v})} folder="heritage" label={t.heritageImage}/>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.titleAr} *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="input-field"/></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.titleEn}</label><input value={form.title_en} onChange={e=>setForm({...form,title_en:e.target.value})} className="input-field" dir="ltr"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.eventType}</label>
                  <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input-field">
                    <option value="tangible">{t.tangible}</option>
                    <option value="intangible">{t.intangible}</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.period}</label><input value={form.period} onChange={e=>setForm({...form,period:e.target.value})} className="input-field" placeholder={t.periodPlaceholder}/></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.location}</label><input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} className="input-field" placeholder={t.locationPlaceholder}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.descriptionAr}</label><textarea rows={3} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="input-field resize-none"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.descriptionEn}</label><textarea rows={3} value={form.content_en} onChange={e=>setForm({...form,content_en:e.target.value})} className="input-field resize-none" dir="ltr"/></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})} className="w-4 h-4 accent-primary"/>
                <span className="text-sm text-gray-700">{t.published}</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={handleSave} disabled={saving} className="btn-primary"><Save size={16}/>{saving ? t.saving : t.save}</button>
              <button onClick={()=>setModal(false)} className="btn-outline">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
