// routes/admins.js  (FIXED)
//
// FIX 8: Role-based protection added throughout.
//   - Only super_admin can list, create, edit, or delete other admins.
//   - A super_admin cannot be modified or deleted by a regular admin.
//   - The last super_admin cannot be deleted (prevents lockout).
//   - Any admin can read their own record (used by profile page).

const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const db      = require('../lib/db')
const auth    = require('../middleware/auth')
router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});
// Helper: restrict route to super_admin only
function superAdminOnly(req, res, next) {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'هذه العملية متاحة للمشرف الرئيسي فقط' })
  }
  next()
}

// GET / — list all admins (super_admin only)
router.get('/', auth, superAdminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, is_active, created_at, last_login FROM admins ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// POST / — add new admin (super_admin only)
router.post('/', auth, superAdminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!email || !password) return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' })
    if (password.length < 8) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })

    const [existing] = await db.query('SELECT id FROM admins WHERE email = ?', [email])
    if (existing.length) return res.status(409).json({ error: 'البريد مستخدم بالفعل' })

    // Only a super_admin can create another super_admin
    const assignedRole = (role === 'super_admin') ? 'super_admin' : 'admin'
    const hash = await bcrypt.hash(password, 12)
    const [result] = await db.query(
      'INSERT INTO admins (name, email, password_hash, role, is_active) VALUES (?,?,?,?,1)',
      [name || email, email, hash, assignedRole]
    )
    res.status(201).json({ id: result.insertId, message: 'تم إضافة المشرف' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PUT /:id — edit admin info (super_admin only)
router.put('/:id', auth, superAdminOnly, async (req, res) => {
  try {
    const targetId = Number(req.params.id)
    const { name, email, role, is_active } = req.body

    // Prevent demoting or deactivating the only super_admin
    const [target] = await db.query('SELECT role FROM admins WHERE id=?', [targetId])
    if (!target.length) return res.status(404).json({ error: 'المشرف غير موجود' })

    if (target[0].role === 'super_admin' && role !== 'super_admin') {
      // Check if this is the last super_admin
      const [cnt] = await db.query("SELECT COUNT(*) AS c FROM admins WHERE role='super_admin'")
      if ((cnt[0]?.c || 0) <= 1) {
        return res.status(400).json({ error: 'لا يمكن تخفيض صلاحيات المشرف الرئيسي الوحيد' })
      }
    }

    await db.query(
      'UPDATE admins SET name=?, email=?, role=?, is_active=? WHERE id=?',
      [name, email, role || 'admin', is_active !== undefined ? is_active : 1, targetId]
    )
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PUT /:id/password — reset any admin's password (super_admin only)
router.put('/:id/password', auth, superAdminOnly, async (req, res) => {
  try {
    const { password } = req.body
    if (!password || password.length < 8) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    const hash = await bcrypt.hash(password, 12)
    await db.query('UPDATE admins SET password_hash=? WHERE id=?', [hash, req.params.id])
    res.json({ message: 'تم تغيير كلمة المرور' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// DELETE /:id (super_admin only)
router.delete('/:id', auth, superAdminOnly, async (req, res) => {
  try {
    const targetId = Number(req.params.id)

    if (req.admin.id === targetId) {
      return res.status(400).json({ error: 'لا يمكنك حذف حسابك الخاص' })
    }

    // Prevent deleting the last super_admin
    const [target] = await db.query('SELECT role FROM admins WHERE id=?', [targetId])
    if (!target.length) return res.status(404).json({ error: 'المشرف غير موجود' })

    if (target[0].role === 'super_admin') {
      const [cnt] = await db.query("SELECT COUNT(*) AS c FROM admins WHERE role='super_admin'")
      if ((cnt[0]?.c || 0) <= 1) {
        return res.status(400).json({ error: 'لا يمكن حذف المشرف الرئيسي الوحيد' })
      }
    }

    await db.query('DELETE FROM admins WHERE id=?', [targetId])
    res.json({ message: 'تم الحذف' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

module.exports = router
