// routes/contact.js  (FIXED)
//
// FIX 15: Added `phone` field support (now in schema).
// FIX 16: Added PATCH /:id/unread  — admin can mark a message as unread again.
// FIX 17: Added POST /mark-all-read — admin can clear the unread badge in one click.
// FIX 18: Added GET /unread-count   — lightweight endpoint for notification badges.
// FIX 19: Input validation now rejects obviously malformed emails on public POST.

const router = require('express').Router()
const db     = require('../lib/db')
const auth   = require('../middleware/auth')

// Simple email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// POST /api/contact — public submission
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'يرجى ملء جميع الحقول المطلوبة' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'صيغة البريد الإلكتروني غير صحيحة' })
    }
    await db.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?,?,?,?,?)',
      [name, email, phone || null, subject || null, message]
    )
    res.status(201).json({ message: 'تم إرسال رسالتك بنجاح' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/contact — all messages (admin)
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/contact/unread-count — lightweight badge count (admin)
router.get('/unread-count', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM contact_messages WHERE read_status=0')
    res.json({ count: rows[0]?.count || 0 })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PATCH /api/contact/:id/read — mark single message as read (admin)
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET read_status=1 WHERE id=?', [req.params.id])
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PATCH /api/contact/:id/unread — mark single message as unread (admin)
router.patch('/:id/unread', auth, async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET read_status=0 WHERE id=?', [req.params.id])
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// POST /api/contact/mark-all-read — mark every message as read (admin)
router.post('/mark-all-read', auth, async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET read_status=1 WHERE read_status=0')
    res.json({ message: 'تم تحديد الكل كمقروء' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// DELETE /api/contact/:id (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM contact_messages WHERE id=?', [req.params.id])
    res.json({ message: 'تم الحذف' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

module.exports = router
