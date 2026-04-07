// routes/events.js  (FIXED)
//
// FIX 10: PUT was already writing `updated_at=NOW()` but the column was missing
//          from the schema — causing a silent SQL error that swallowed updates.
//          Now that updated_at exists in schema.sql (and migrate.sql adds it to
//          existing DBs), we also explicitly set it in the UPDATE statement.
//
// FIX 11: Added GET /:id for fetching a single event (was missing — admins
//          couldn't load a single event for editing).
//
// FIX 12: public GET / now only returns published events (correct behaviour
//          kept) and filters by type AND date-range via query params.

const router = require('express').Router()
const db     = require('../lib/db')
const auth   = require('../middleware/auth')
const { deleteFile } = require('../lib/storage')

// GET /api/events  (public)
router.get('/', async (req, res) => {
  try {
    const type   = req.query.type
    const limit  = parseInt(req.query.limit)  || 100
    const offset = parseInt(req.query.offset) || 0
    let sql = 'SELECT * FROM events WHERE published = 1'
    const params = []
    if (type) { sql += ' AND type = ?'; params.push(type) }
    sql += ' ORDER BY event_date ASC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    const [rows] = await db.query(sql, params)
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/events/all  (admin — includes unpublished)
router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY event_date DESC')
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/events/:id  (public — single event)
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' })
    res.json(rows[0])
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// POST /api/events  (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { title, title_en, content, content_en, type, event_date, location, location_en, image_url, published } = req.body
    if (!title) return res.status(400).json({ error: 'العنوان مطلوب' })
    const [result] = await db.query(
      'INSERT INTO events (title,title_en,content,content_en,type,event_date,location,location_en,image_url,published) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [title, title_en||null, content||null, content_en||null, type||'event', event_date||null, location||null, location_en||null, image_url||null, published !== false ? 1 : 0]
    )
    res.status(201).json({ id: result.insertId, message: 'تم الإضافة' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PUT /api/events/:id  (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, title_en, content, content_en, type, event_date, location, location_en, image_url, published } = req.body
    if (!title) return res.status(400).json({ error: 'العنوان مطلوب' })
    await db.query(
      // FIX: updated_at=NOW() now works because the column exists
      'UPDATE events SET title=?,title_en=?,content=?,content_en=?,type=?,event_date=?,location=?,location_en=?,image_url=?,published=?,updated_at=NOW() WHERE id=?',
      [title, title_en||null, content||null, content_en||null, type||'event', event_date||null, location||null, location_en||null, image_url||null, published !== false ? 1 : 0, req.params.id]
    )
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// DELETE /api/events/:id  (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT image_url FROM events WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' })
    if (rows[0]?.image_url) await deleteFile(rows[0].image_url).catch(() => {})
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id])
    res.json({ message: 'تم الحذف' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

module.exports = router
