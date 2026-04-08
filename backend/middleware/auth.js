// middleware/auth.js  (FIXED)
//
// FIX 7: The original middleware only decoded the JWT but never verified the
//         admin is still active in the database.  A deactivated admin kept full
//         access until their token expired (up to 7 days).
//         Now we do a lightweight DB lookup on every protected request.

const jwt = require('jsonwebtoken')
const db  = require('../lib/db')

module.exports = async function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح' })
  }

  const token = header.split(' ')[1]
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'رمز الجلسة غير صالح أو منتهي الصلاحية' })
  }

  try {
    // Verify admin still exists and is still active in DB
    const [rows] = await db.query(
      'SELECT id, email, name, role, is_active FROM admins WHERE id = ?',
      [decoded.id]
    )
    if (!rows.length || !rows[0].is_active) {
      return res.status(401).json({ error: 'الحساب غير نشط أو تم حذفه' })
    }
    // Attach full, up-to-date admin object (includes role)
    req.admin = rows[0]
    next()
  } catch {
    return res.status(500).json({ error: 'خطأ في التحقق من الهوية' })
  }
}
