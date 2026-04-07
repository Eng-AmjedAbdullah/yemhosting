-- =============================================
-- migrate.sql  — Safe migration for existing Yemen Heritage DBs
-- Run this ONCE on any database created with the OLD schema.sql
-- All statements use IF NOT EXISTS / IF EXISTS so they are safe to re-run.
-- =============================================

USE yemen_heritage;

-- ── 1. admins: add `role` column ─────────────────────────────────────────────
ALTER TABLE admins
  ADD COLUMN IF NOT EXISTS role ENUM('super_admin','admin') NOT NULL DEFAULT 'admin'
    AFTER password_hash;

-- Promote the oldest admin to super_admin (the original seeded admin)
UPDATE admins
  SET role = 'super_admin'
  WHERE id = (SELECT id FROM (SELECT MIN(id) AS id FROM admins) t);

-- ── 2. events: add `updated_at` ──────────────────────────────────────────────
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS updated_at DATETIME
    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    AFTER created_at;

-- Back-fill existing rows
UPDATE events SET updated_at = created_at WHERE updated_at IS NULL;

-- ── 3. heritage_items: add `updated_at` ──────────────────────────────────────
ALTER TABLE heritage_items
  ADD COLUMN IF NOT EXISTS updated_at DATETIME
    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    AFTER created_at;

UPDATE heritage_items SET updated_at = created_at WHERE updated_at IS NULL;

-- ── 4. contact_messages: add `phone` and `replied_at` ────────────────────────
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS phone      VARCHAR(50) NULL COMMENT 'Optional contact phone' AFTER email,
  ADD COLUMN IF NOT EXISTS replied_at DATETIME    NULL COMMENT 'Timestamp admin replied' AFTER read_status;

-- ── 5. hero_slides: add CTA link columns ─────────────────────────────────────
ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS link_url     VARCHAR(500) NULL COMMENT 'Optional CTA link' AFTER alt_en,
  ADD COLUMN IF NOT EXISTS link_text_ar VARCHAR(200) NULL COMMENT 'CTA label Arabic'  AFTER link_url,
  ADD COLUMN IF NOT EXISTS link_text_en VARCHAR(200) NULL COMMENT 'CTA label English' AFTER link_text_ar;

-- ── 6. site_settings: add identity + content columns ─────────────────────────
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS site_name_ar VARCHAR(255) DEFAULT 'منظمة تراث اليمن لأجل السلام' AFTER id,
  ADD COLUMN IF NOT EXISTS site_name_en VARCHAR(255) DEFAULT 'Yemen Heritage for Peace'       AFTER site_name_ar,
  ADD COLUMN IF NOT EXISTS logo_url     TEXT NULL COMMENT 'Site logo URL'    AFTER site_name_en,
  ADD COLUMN IF NOT EXISTS favicon_url  TEXT NULL COMMENT 'Favicon URL'      AFTER logo_url,
  ADD COLUMN IF NOT EXISTS about_desc_ar TEXT NULL AFTER home_about_image_alt_en,
  ADD COLUMN IF NOT EXISTS about_desc_en TEXT NULL AFTER about_desc_ar,
  ADD COLUMN IF NOT EXISTS vision_ar    TEXT NULL AFTER about_desc_en,
  ADD COLUMN IF NOT EXISTS vision_en    TEXT NULL AFTER vision_ar,
  ADD COLUMN IF NOT EXISTS mission_ar   TEXT NULL AFTER vision_en,
  ADD COLUMN IF NOT EXISTS mission_en   TEXT NULL AFTER mission_ar;

-- ── 7. Add indexes that were missing ─────────────────────────────────────────
-- (CREATE INDEX IF NOT EXISTS is not supported in MySQL < 8.0.20; use procedure)
CALL sys.execute_prepared_stmt(
  'CREATE INDEX idx_news_published ON news (published, created_at)'
) IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='news' AND INDEX_NAME='idx_news_published');
-- Note: index creation errors are non-fatal; ignore if your MySQL version raises them.

SELECT 'Migration complete. All columns added safely.' AS status;
