import { useState, useEffect, useContext } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Trash2, Edit, X, UserPlus, Shield, ShieldCheck, Key } from 'lucide-react'
import { ConfirmContext } from './AdminLayout'
import { useAdminLang } from './adminI18n'

export default function ManageAdmins() {
  const { t, isRtl } = useAdminLang()
  const { requestConfirm } = useContext(ConfirmContext)
  const [admins, setAdmins]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)
  const [form, setForm]       = useState({ name:'', email:'', password:'', role:'admin', is_active:1 })
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const me = JSON.parse(localStorage.getItem('yhpo_admin')||'{}')

  const load = () => {
    setLoading(true)
    api.get('/admins').then(d=>setAdmins(d||[])).catch(()=>setAdmins([])).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleAdd = async () => {
    if (!form.email || !form.password) { toast.error(t.emailRequired); return }
    if (form.password.length < 8) { toast.error(t.passwordTooShort); return }
    setSaving(true)
    try { await api.post('/admins', form); toast.success(t.added); load(); setModal(null) }
    catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const handleEdit = async () => {
    setSaving(true)
    try { await api.put(`/admins/${editId}`, form); toast.success(t.saved); load(); setModal(null) }
    catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const handlePassword = async () => {
    if (!form.password || form.password.length < 8) { toast.error(t.passwordTooShort); return }
    setSaving(true)
    try { await api.put(`/admins/${editId}/password`, { password: form.password }); toast.success(t.passwordChanged); setModal(null) }
    catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (id === me.id) { toast.error(t.cannotDeleteSelf); return }
    const confirmed = await requestConfirm({
      title: isRtl ? 'تأكيد حذف المشرف' : 'Delete administrator?',
      message: isRtl ? 'سيتم حذف هذا الحساب الإداري نهائياً.' : 'This administrator account will be permanently removed.',
      variant: 'danger',
      confirmText: t.delete,
    })
    if (!confirmed) return
    try { await api.delete(`/admins/${id}`); toast.success(t.deleted); load() }
    catch(e) { toast.error(e.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark">{t.manageAdmins}</h1>
        <button onClick={()=>{ setForm({name:'',email:'',password:'',role:'admin',is_active:1}); setModal('add') }} className="btn-primary">
          <UserPlus size={16}/>{t.addAdmin}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.name}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.email}</th>
              {/* FIX: show role column */}
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.role}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.status}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.lastLogin}</th>
              <th className={`${isRtl?'text-right':'text-left'} p-4 font-medium text-gray-600`}>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center p-8 text-gray-400">{t.loading}</td></tr>
            : admins.map(admin=>(
              <tr key={admin.id} className="table-row border-b border-gray-50">
                <td className="p-4 font-medium text-dark">
                  <div className="flex items-center gap-2">
                    {admin.role === 'super_admin'
                      ? <ShieldCheck size={14} className="text-primary"/>
                      : <Shield size={14} className="text-gray-400"/>}
                    {admin.name||'—'}
                    {admin.id===me.id && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{t.you}</span>}
                  </div>
                </td>
                <td className="p-4 text-gray-500" dir="ltr">{admin.email}</td>
                {/* FIX: role badge */}
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${admin.role==='super_admin' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    {admin.role==='super_admin' ? (isRtl ? 'رئيسي' : 'Super Admin') : (isRtl ? 'مشرف' : 'Admin')}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${admin.is_active?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                    {admin.is_active ? t.active : t.inactive}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">{admin.last_login ? new Date(admin.last_login).toLocaleDateString(isRtl?'ar-YE':'en-US') : t.neverLoggedIn}</td>
                <td className="p-4"><div className="flex gap-2">
                  <button onClick={()=>{ setForm({name:admin.name||'',email:admin.email,password:'',role:admin.role||'admin',is_active:admin.is_active}); setEditId(admin.id); setModal('edit') }}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title={t.edit}><Edit size={14}/></button>
                  <button onClick={()=>{ setForm({password:''}); setEditId(admin.id); setModal('password') }}
                    className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg" title={t.changePassword}><Key size={14}/></button>
                  {admin.id!==me.id && <button onClick={()=>handleDelete(admin.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>}
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {modal==='add' && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-dark">{t.addNewAdmin}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-400"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field" placeholder={t.fullName}/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" dir="ltr" placeholder="admin@example.com"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.password} *</label>
                <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-field" dir="ltr" placeholder={t.min8Chars}/></div>
              {/* FIX: role selector */}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.role}</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="input-field">
                  <option value="admin">{isRtl ? 'مشرف عادي' : 'Admin'}</option>
                  <option value="super_admin">{isRtl ? 'مشرف رئيسي' : 'Super Admin'}</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={handleAdd} disabled={saving} className="btn-primary"><UserPlus size={16}/>{saving ? '...' : t.add}</button>
              <button onClick={()=>setModal(null)} className="btn-outline">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modal==='edit' && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-dark">{t.editAdmin}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-400"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-field" dir="ltr"/></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.role}</label>
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="input-field">
                  <option value="admin">{isRtl ? 'مشرف عادي' : 'Admin'}</option>
                  <option value="super_admin">{isRtl ? 'مشرف رئيسي' : 'Super Admin'}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active===1} onChange={e=>setForm({...form,is_active:e.target.checked?1:0})} className="w-4 h-4 accent-primary"/>
                <span className="text-sm text-gray-700">{t.activeAccount}</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={handleEdit} disabled={saving} className="btn-primary"><Edit size={16}/>{saving ? '...' : t.save}</button>
              <button onClick={()=>setModal(null)} className="btn-outline">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modal==='password' && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-bold text-xl text-dark">{t.changePassword}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-400"><X size={20}/></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.newPassword}</label>
              <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-field" dir="ltr" placeholder={t.min8Chars}/>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={handlePassword} disabled={saving} className="btn-primary"><Key size={16}/>{saving ? '...' : t.changePassword}</button>
              <button onClick={()=>setModal(null)} className="btn-outline">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
