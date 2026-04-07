// routes/hero.js  (FIXED)
//
// FIX 20: Added `link_url`, `link_text_ar`, `link_text_en` to INSERT/UPDATE
//          so admin can attach optional CTA buttons to hero slides.
// FIX 21: Added GET /:id  so admin panel can fetch a single slide for editing.
// FIX 22: Public GET / now guards against NaN limit value.

const router = require('express').Router()
const db     = require('../lib/db')
const auth   = require('../middleware/auth')
const { deleteFile } = require('../lib/storage')

// GET /api/hero  (public — active slides only)
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null
    let sql = 'SELECT * FROM hero_slides WHERE is_active=1 ORDER BY sort_order ASC, id DESC'
    const params = []
    if (limit && !isNaN(limit)) { sql += ' LIMIT ?'; params.push(limit) }
    const [rows] = await db.query(sql, params)
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/hero/all  (admin — all slides including inactive)
router.get('/all', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_slides ORDER BY sort_order ASC, id DESC')
    res.json(rows)
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /api/hero/:id  (admin — single slide)
router.get('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_slides WHERE id=?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' })
    res.json(rows[0])
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// POST /api/hero  (admin)
router.post('/', auth, async (req, res) => {
  try {
    const { image_url, caption_ar, caption_en, alt_ar, alt_en,
            link_url, link_text_ar, link_text_en,
            sort_order, is_active } = req.body || {}
    if (!image_url) return res.status(400).json({ error: 'الصورة مطلوبة' })
    const [result] = await db.query(
      `INSERT INTO hero_slides
         (image_url, caption_ar, caption_en, alt_ar, alt_en,
          link_url, link_text_ar, link_text_en, sort_order, is_active)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [image_url, caption_ar||null, caption_en||null, alt_ar||null, alt_en||null,
       link_url||null, link_text_ar||null, link_text_en||null,
       Number(sort_order) || 0, is_active === false ? 0 : 1]
    )
    res.status(201).json({ id: result.insertId, message: 'تم الإضافة' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// PUT /api/hero/:id  (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const { image_url, caption_ar, caption_en, alt_ar, alt_en,
            link_url, link_text_ar, link_text_en,
            sort_order, is_active } = req.body || {}
    if (!image_url) return res.status(400).json({ error: 'الصورة مطلوبة' })
    await db.query(
      `UPDATE hero_slides
       SET image_url=?, caption_ar=?, caption_en=?, alt_ar=?, alt_en=?,
           link_url=?, link_text_ar=?, link_text_en=?,
           sort_order=?, is_active=?, updated_at=NOW()
       WHERE id=?`,
      [image_url, caption_ar||null, caption_en||null, alt_ar||null, alt_en||null,
       link_url||null, link_text_ar||null, link_text_en||null,
       Number(sort_order) || 0, is_active === false ? 0 : 1, req.params.id]
    )
    res.json({ message: 'تم التحديث' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// DELETE /api/hero/:id  (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT image_url FROM hero_slides WHERE id=?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'غير موجود' })
    if (rows[0]?.image_url) await deleteFile(rows[0].image_url).catch(() => {})
    await db.query('DELETE FROM hero_slides WHERE id=?', [req.params.id])
    res.json({ message: 'تم الحذف' })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

module.exports = router
