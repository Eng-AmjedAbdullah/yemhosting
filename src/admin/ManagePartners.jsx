import { useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import { resolveMediaUrl } from '../lib/media'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'
import { Plus, Edit, Trash2, X, Save, Link2 } from 'lucide-react'
import { useAdminLang } from './adminI18n'
import { ConfirmContext } from './AdminLayout'

const EMPTY = {
  name: '',
  name_en: '',
  logo_url: '',
  website_url: '',
  sort_order: 0,
  is_active: true,
}

export default function ManagePartners() {
  const { t, isRtl } = useAdminLang()
  const { requestConfirm } = useContext(ConfirmContext)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/partners/all')
      .then((d) => setItems(d || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('form') }
  const openEdit = (item) => {
    setForm({
      name: item.name || '',
      name_en: item.name_en || '',
      logo_url: item.logo_url || '',
      website_url: item.website_url || '',
      sort_order: item.sort_order || 0,
      is_active: item.is_active !== 0,
    })
    setEditId(item.id)
    setModal('form')
  }

  const handleSave = async () => {
    if (!form.name) { toast.error(t.titleRequired); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order) || 0,
        is_active: !!form.is_active,
      }
      if (editId) await api.put(`/partners/${editId}`, payload)
      else await api.post('/partners', payload)
      toast.success(editId ? t.saved : t.added)
      load(); setModal(null)
    } catch (e) {
      toast.error(e.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    const confirmed = await requestConfirm({
      title: isRtl ? 'تأكيد حذف الشريك' : 'Delete partner?',
      message: isRtl ? 'سيتم حذف هذا الشريك من قائمة الشركاء.' : 'This partner will be removed from the partners list.',
      variant: 'danger',
      confirmText: t.delete,
    })
    if (!confirmed) return
    try {
      await api.delete(`/partners/${id}`)
      toast.success(t.deleted)
      load()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t.managePartners}</h1>
        <button onClick={openAdd} className="btn-primary"><Plus size={16} />{t.addPartner}</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.partnerLogo}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.partnerName}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.order}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.status}</th>
              <th className={`${isRtl ? 'text-right' : 'text-left'} p-4 font-medium text-gray-600`}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-8 text-gray-400">{t.loading}</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-8 text-gray-400">{t.noPartners}</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="table-row border-b border-gray-50">
                  <td className="p-3">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt="" className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                        —
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-dark max-w-xs">
                    <div className="line-clamp-1">{isRtl ? item.name : (item.name_en || item.name)}</div>
                    {item.name_en && isRtl && <div className="text-xs text-gray-400 line-clamp-1" dir="ltr">{item.name_en}</div>}
                    {item.website_url && (
                      <a href={item.website_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1" dir="ltr">
                        <Link2 size={12} /> {item.website_url}
                      </a>
                    )}
                  </td>
                  <td className="p-4 text-gray-500">{item.sort_order || 0}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.is_active ? t.active : t.hidden}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-dark">{editId ? t.editPartner : t.addPartner}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              <ImageUpload value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} folder="partners" label={t.partnerLogo} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.partnerNameAr} *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.partnerNameEn}</label>
                  <input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="input-field" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.websiteUrl}</label>
                <input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="input-field" dir="ltr" placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.order}</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="input-field" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-gray-700">{t.activePublic}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button onClick={handleSave} disabled={saving} className="btn-primary"><Save size={16} />{saving ? t.saving : t.save}</button>
              <button onClick={() => setModal(null)} className="btn-outline">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
