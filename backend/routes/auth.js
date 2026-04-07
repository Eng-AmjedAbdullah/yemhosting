// routes/auth.js  (FIXED)
//
// FIX 28: JWT payload now includes `role` field so the frontend knows whether the
//          logged-in admin is a super_admin without an extra API round-trip.
//          Without this, the admin panel couldn't show/hide super_admin-only UI.
//
// FIX 29: /me now returns `role` field as well.

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const db     = require('../lib/db')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' })

    const [rows] = await db.query('SELECT * FROM admins WHERE email = ? AND is_active = 1', [email])
    if (!rows.length) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })

    const admin = rows[0]
    const match = await bcrypt.compare(password, admin.password_hash)
    if (!match) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' })

    // FIX: include `role` in the JWT payload
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    )

    await db.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id])

    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    // FIX: return `role` field
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at, last_login FROM admins WHERE id = ?',
      [req.admin.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'المشرف غير موجود' })
    res.json(rows[0])
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

module.exports = router
