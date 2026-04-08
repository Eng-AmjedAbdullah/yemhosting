import { useState, useEffect, useContext } from 'react'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Mail, MailOpen, Trash2, X, CheckCheck, Phone } from 'lucide-react'
import { ConfirmContext } from './AdminLayout'
import { useAdminLang } from './adminI18n'
import { AdminLangContext } from './adminI18n'

export default function ManageMessages() {
  const { t, isRtl }      = useAdminLang()
  const { requestConfirm } = useContext(ConfirmContext)
  const ctx               = useContext(AdminLangContext)
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/contact').then(d=>setMessages(d||[])).catch(()=>setMessages([])).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  const handleRead = async (id) => {
    try { await api.patch(`/contact/${id}/read`, {}); load(); ctx?.fetchUnread?.() } catch {}
  }
  const handleUnread = async (id) => {
    try { await api.patch(`/contact/${id}/unread`, {}); load(); ctx?.fetchUnread?.() } catch {}
  }
  // FIX: mark all as read
  const handleMarkAllRead = async () => {
    try { await api.post('/contact/mark-all-read', {}); toast.success(isRtl ? 'تم تحديد الكل كمقروء' : 'All marked as read'); load(); ctx?.fetchUnread?.() }
    catch(e) { toast.error(e.message) }
  }
  const handleDelete = async (id) => {
    const confirmed = await requestConfirm({
      title: isRtl ? 'تأكيد حذف الرسالة' : 'Delete message?',
      message: isRtl ? 'سيتم حذف هذه الرسالة نهائياً من صندوق الرسائل.' : 'This message will be permanently removed from the inbox.',
      variant: 'danger',
      confirmText: t.delete,
    })
    if (!confirmed) return
    try { await api.delete(`/contact/${id}`); toast.success(t.deleted); load(); setSelected(null); ctx?.fetchUnread?.() }
    catch(e) { toast.error(e.message) }
  }

  const unread = messages.filter(m => !m.read_status).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark">{t.manageMessages}</h1>
          {unread > 0 && (
            <span className="text-sm text-primary mt-1 block">
              {unread} {t.unreadMessages}
            </span>
          )}
        </div>
        {/* FIX: mark all as read button */}
        {unread > 0 && (
          <button onClick={handleMarkAllRead} className="btn-outline text-sm flex items-center gap-2">
            <CheckCheck size={16}/>{isRtl ? 'تحديد الكل كمقروء' : 'Mark All Read'}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? <div className="text-center p-8 text-gray-400">{t.loading}</div>
          : messages.length===0 ? <div className="text-center p-8 text-gray-400">{t.noMessages}</div>
          : messages.map(msg=>(
            <div key={msg.id}
              onClick={()=>{ setSelected(msg); if(!msg.read_status) handleRead(msg.id) }}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors
                ${selected?.id===msg.id ? `bg-primary/5 ${isRtl?'border-e-2 border-e-primary':'border-s-2 border-s-primary'}` : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {msg.read_status ? <MailOpen size={14} className="text-gray-400"/> : <Mail size={14} className="text-primary"/>}
                  <span className={`font-medium text-sm ${msg.read_status?'text-gray-600':'text-dark'}`}>{msg.name}</span>
                  {/* FIX: show phone if available */}
                  {msg.phone && <span className="text-xs text-gray-400 flex items-center gap-0.5" dir="ltr"><Phone size={10}/>{msg.phone}</span>}
                </div>
                <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString(isRtl?'ar-YE':'en-US')}</span>
              </div>
              {msg.subject && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{msg.subject}</p>}
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Detail */}
        {selected ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-dark">{selected.name}</h2>
              <div className="flex gap-2">
                {/* FIX: toggle read/unread */}
                <button
                  onClick={()=>{ selected.read_status ? handleUnread(selected.id) : handleRead(selected.id); setSelected({...selected, read_status: !selected.read_status}) }}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title={selected.read_status ? (isRtl?'تحديد كغير مقروء':'Mark Unread') : (isRtl?'تحديد كمقروء':'Mark Read')}>
                  {selected.read_status ? <Mail size={16}/> : <MailOpen size={16}/>}
                </button>
                <button onClick={()=>handleDelete(selected.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                <button onClick={()=>setSelected(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={16}/></button>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><span className="text-gray-400 w-20">{t.email}:</span>
                <a href={`mailto:${selected.email}`} className="text-primary hover:underline" dir="ltr">{selected.email}</a></div>
              {/* FIX: show phone in detail */}
              {selected.phone && (
                <div className="flex gap-2"><span className="text-gray-400 w-20">{isRtl?'الهاتف:':'Phone:'}</span>
                  <a href={`tel:${selected.phone}`} className="text-primary hover:underline" dir="ltr">{selected.phone}</a></div>
              )}
              {selected.subject && <div className="flex gap-2"><span className="text-gray-400 w-20">{t.subject}:</span><span className="text-dark">{selected.subject}</span></div>}
              <div className="flex gap-2"><span className="text-gray-400 w-20">{t.date}:</span>
                <span>{new Date(selected.created_at).toLocaleString(isRtl?'ar-YE':'en-US')}</span></div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-400 text-xs mb-2">{t.message}:</p>
                <p className="text-dark leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=${isRtl?'رد:':'Re:'} ${selected.subject||''}`}
                className="btn-primary text-sm inline-flex mt-4">↩ {t.reply}</a>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center h-64">
            <p className="text-gray-400 text-sm">{t.selectMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}
