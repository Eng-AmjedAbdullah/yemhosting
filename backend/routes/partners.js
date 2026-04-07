// routes/partners.js  (FIXED)
//
// FIX 23: The public GET / route accepted `?include_inactive=1` from anyone,
//          leaking inactive partners to the public.  Only the admin /all
//          endpoint should return all partners.  Public endpoint is now locked
//          to active partners only.
//
// FIX 24: Added GET /:id (admin) for fetching a single partner for edit forms.

const router = require('express').Router()
const db     = require('../lib/db')
const auth   = require('../middleware/auth')
const { deleteFile } = require('../lib/storage')

// GET /api/partners  (public — active only, no leaking of inactive)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null
    // FIX: removed include_inactive — public always gets active only
    let sql = 'SELECT id, name, name_en, logo_url, website_url, sort_order FROM partners WHERE is_active=1 ORDER BY sort_order ASC, id DESC'
    const params = []
    if (limit && !isNaN(limit)) { sql += ' LIMIT ?'; params.push(limit) }
    const [rows] = await db.query(sql, params)
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/partners/all  (admin — all including inactive)
router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM partners ORDER BY sort_order ASC, id DESC')
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/partners/:id  (admin — single partner)
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM partners WHERE id=?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' })
    res.json(rows[0])
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// POST /api/partners  (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, name_en, logo_url, website_url, sort_order, is_active } = req.body || {}
    if (!name) return res.status(400).json({ error: 'الاسم مطلوب' })
    const [result] = await db.query(
      'INSERT INTO partners (name, name_en, logo_url, website_url, sort_order, is_active) VALUES (?,?,?,?,?,?)',
      [name, name_en||null, logo_url||null, website_url||null, Number(sort_order)||0, is_active === false ? 0 : 1]
    )
    res.status(201).json({ id: result.insertId, message: 'تم الإضافة' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PUT /api/partners/:id  (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, name_en, logo_url, website_url, sort_order, is_active } = req.body || {}
    if (!name) return res.status(400).json({ error: 'الاسم مطلوب' })
    await db.query(
      'UPDATE partners SET name=?, name_en=?, logo_url=?, website_url=?, sort_order=?, is_active=?, updated_at=NOW() WHERE id=?',
      [name, name_en||null, logo_url||null, website_url||null, Number(sort_order)||0, is_active === false ? 0 : 1, req.params.id]
    )
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// DELETE /api/partners/:id  (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT logo_url FROM partners WHERE id=?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' })
    if (rows[0]?.logo_url) await deleteFile(rows[0].logo_url).catch(() => {})
    await db.query('DELETE FROM partners WHERE id=?', [req.params.id])
    res.json({ message: 'تم الحذف' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

module.exports = router
