/**
 * storage.js
 * Local file-system storage utilities.
 * Replaces the old Supabase storage integration.
 *
 * Uploaded files live in:  backend/uploads/<folder>/<timestamp>_<safename>
 * They are served publicly at:  /uploads/<folder>/<timestamp>_<safename>
 */

const fs   = require('fs')
const path = require('path')

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

/**
 * Ensure an upload sub-directory exists (created lazily on first use).
 * @param {string} folder  e.g. "news", "events", "general"
 * @returns {string}  Absolute path to the sub-directory
 */
function ensureFolder(folder) {
  const dir = path.join(UPLOADS_DIR, folder)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return dir
}

/**
 * Delete a locally-uploaded file by its public URL.
 * Safe to call even if the file no longer exists.
 *
 * @param {string|null} publicUrl  e.g. "/uploads/news/1712345678_photo.jpg"
 */
async function deleteFile(publicUrl) {
  try {
    if (!publicUrl) return
    // Accept both full URLs and relative paths
    const relativePath = publicUrl.replace(/^https?:\/\/[^/]+/, '')
    if (!relativePath.startsWith('/uploads/')) return
    const abs = path.join(UPLOADS_DIR, '..', relativePath)
    if (fs.existsSync(abs)) fs.unlinkSync(abs)
  } catch (e) {
    console.error('Storage delete error:', e.message)
  }
}

module.exports = { ensureFolder, deleteFile, UPLOADS_DIR }
