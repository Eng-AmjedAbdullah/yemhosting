import { useState, useEffect } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Save, Eye, EyeOff } from 'lucide-react'
import { useAdminLang } from './adminI18n'

export default function Profile() {
  const { t, isRtl } = useAdminLang()
  const [admin, setAdmin] = useState(null)
  const [nameForm, setNameForm] = useState({ name:'' })
  const [pwdForm, setPwdForm] = useState({ current_password:'', new_password:'', confirm:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)

  useEffect(() => {
    api.get('/auth/me').then(d=>{ setAdmin(d); setNameForm({name:d.name||''}) }).catch(()=>{})
  }, [])

  const handleUpdateName = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/profile', { name: nameForm.name })
      localStorage.setItem('yhpo_admin', JSON.stringify({...admin, name:nameForm.name}))
      toast.success(t.nameUpdated)
    } catch(e) { toast.error(e.message) }
    setSaving(false)
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwdForm.new_password !== pwdForm.confirm) { toast.error(t.passwordsNotMatch); return }
    if (pwdForm.new_password.length < 6) { toast.error(t.passwordShort); return }
    setSavingPwd(true)
    try {
      await api.put('/profile/password', { current_password: pwdForm.current_password, new_password: pwdForm.new_password })
      toast.success(t.passwordChanged)
      setPwdForm({ current_password:'', new_password:'', confirm:'' })
    } catch(e) { toast.error(e.message) }
    setSavingPwd(false)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-dark mb-6">{t.myProfile}</h1>

      {/* Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-dark mb-4">{t.accountInfo}</h2>
        {admin && <div className="space-y-2 text-sm text-gray-600 mb-6">
          <div><span className="text-gray-400 w-32 inline-block">{t.email}:</span><span dir="ltr">{admin.email}</span></div>
          <div><span className="text-gray-400 w-32 inline-block">{t.lastLogin}:</span><span>{admin.last_login ? new Date(admin.last_login).toLocaleString(isRtl ? 'ar-YE' : 'en-US') : '—'}</span></div>
          <div><span className="text-gray-400 w-32 inline-block">{t.createdAt}:</span><span>{new Date(admin.created_at).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')}</span></div>
        </div>}
        <form onSubmit={handleUpdateName} className="flex gap-3">
          <input value={nameForm.name} onChange={e=>setNameForm({name:e.target.value})} className="input-field flex-1" placeholder={t.name}/>
          <button type="submit" disabled={saving} className="btn-primary py-2 px-4"><Save size={16}/>{saving ? '...' : t.save}</button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-dark mb-4">{t.changePassword}</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.currentPassword}</label>
            <input type="password" value={pwdForm.current_password} onChange={e=>setPwdForm({...pwdForm,current_password:e.target.value})} className="input-field" dir="ltr"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.newPassword}</label>
            <div className="relative">
              <input type={showPwd?'text':'password'} value={pwdForm.new_password} onChange={e=>setPwdForm({...pwdForm,new_password:e.target.value})} className={`input-field ${isRtl ? 'ps-10' : 'pe-10'}`} dir="ltr"/>
              <button type="button" onClick={()=>setShowPwd(s=>!s)} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'start-3' : 'end-3'} text-gray-400 hover:text-primary`}>
                {showPwd?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">{t.confirmPassword}</label>
            <input type="password" value={pwdForm.confirm} onChange={e=>setPwdForm({...pwdForm,confirm:e.target.value})} className="input-field" dir="ltr"/></div>
          <button type="submit" disabled={savingPwd} className="btn-primary"><Save size={16}/>{savingPwd ? t.changingPassword : t.changePassword}</button>
        </form>
      </div>
    </div>
  )
}
