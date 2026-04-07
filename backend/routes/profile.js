// routes/profile.js  (FIXED)
//
// FIX 9: `current_password` is now always required when changing password.
//         The original code made it optional, meaning any authenticated admin
//         could change their password without proving knowledge of the old one
//         (e.g. if a session token was stolen the attacker could lock out the owner).

const router = require('express').Router()
const bcrypt = require('bcryptjs')
const db     = require('../lib/db')
const auth   = require('../middleware/auth')

// PUT /api/profile/password — change own password (current_password REQUIRED)
router.put('/password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body

    // FIX: both fields are mandatory
    if (!current_password) {
      return res.status(400).json({ error: 'كلمة المرور الحالية مطلوبة' })
    }
    if (!new_password || new_password.length < 8) {
      return res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل' })
    }

    const [rows] = await db.query('SELECT password_hash FROM admins WHERE id=?', [req.admin.id])
    if (!rows.length) return res.status(404).json({ error: 'المشرف غير موجود' })

    const match = await bcrypt.compare(current_password, rows[0].password_hash)
    if (!match) return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' })

    const hash = await bcrypt.hash(new_password, 12)
    await db.query('UPDATE admins SET password_hash=? WHERE id=?', [hash, req.admin.id])
    res.json({ message: 'تم تغيير كلمة المرور بنجاح' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PUT /api/profile — update own display name
router.put('/', auth, async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) return res.status(400).json({ error: 'الاسم مطلوب' })
    await db.query('UPDATE admins SET name=? WHERE id=?', [name.trim(), req.admin.id])
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

module.exports = router
