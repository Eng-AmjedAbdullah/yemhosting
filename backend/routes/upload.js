const router = require('express').Router()
const multer = require('multer')
const auth = require('../middleware/auth')
const { uploadBuffer, deleteFile } = require('../lib/storage')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// POST /api/upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم رفع أي ملف' })
    }

    const folder = (req.body.folder || 'general').replace(/[^a-zA-Z0-9/_-]/g, '_')

    const result = await uploadBuffer({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      folder,
      originalName: req.file.originalname,
    })

    res.json({
      url: result.url,
      path: result.path,
    })
  } catch (e) {
    console.error('Upload failed:', e)
    res.status(500).json({ error: 'فشل رفع الملف: ' + e.message })
  }
})

// DELETE /api/upload
router.delete('/', auth, async (req, res) => {
  try {
    const { url } = req.body || {}
    await deleteFile(url)
    res.json({ success: true })
  } catch (e) {
    console.error('Delete failed:', e)
    res.status(500).json({ error: 'فشل حذف الملف' })
  }
})

module.exports = router