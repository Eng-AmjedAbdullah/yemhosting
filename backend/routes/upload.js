/**
 * routes/upload.js
 * Handles image uploads to the local uploads/ directory.
 * Files are accessible at  GET /uploads/<folder>/<filename>
 */

const router  = require('express').Router()
const multer  = require('multer')
const path    = require('path')
const auth    = require('../middleware/auth')
const { ensureFolder, deleteFile } = require('../lib/storage')

// ── Multer: disk storage ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = (req.body.folder || 'general').replace(/[^a-z0-9_-]/gi, '_')
    const dir = ensureFolder(folder)
    cb(null, dir)
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, `${Date.now()}_${safeName}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

// POST /api/upload  (admin only) ─────────────────────────────────────────────
router.post('/', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع أي ملف' })

    const folder = (req.body.folder || 'general').replace(/[^a-z0-9_-]/gi, '_')
    // Return a root-relative URL that the frontend can use directly
    const url = `/uploads/${folder}/${req.file.filename}`
    res.json({ url })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'فشل رفع الملف: ' + e.message })
  }
})

// DELETE /api/upload  (admin only) ───────────────────────────────────────────
router.delete('/', auth, async (req, res) => {
  try {
    const { url } = req.body
    await deleteFile(url)
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ error: 'فشل حذف الملف' })
  }
})

module.exports = router
