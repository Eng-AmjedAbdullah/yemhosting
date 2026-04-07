-- =============================================
-- Yemen Heritage for Peace Organization
-- MySQL Database Schema  (FIXED v2)
-- =============================================

CREATE DATABASE IF NOT EXISTS yemen_heritage
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE yemen_heritage;

-- ─── Admins ───────────────────────────────────────────────────────────────────
-- FIX 1: Added `role` column so super_admin can be distinguished from regular admin.
--         Without this every admin had equal power to delete / deactivate other admins.
CREATE TABLE IF NOT EXISTS admins (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1)    DEFAULT 1,
  last_login    DATETIME      NULL,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── News ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(500)  NOT NULL,
  title_en    VARCHAR(500),
  content     LONGTEXT,
  content_en  LONGTEXT,
  category    VARCHAR(100)  DEFAULT 'أخبار',
  category_en VARCHAR(100)  DEFAULT 'News',
  image_url   TEXT          COMMENT 'Local uploads path e.g. /uploads/news/filename.jpg',
  published   TINYINT(1)    DEFAULT 1,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Events ───────────────────────────────────────────────────────────────────
-- FIX 2: Added `updated_at` column.
--         The PUT route was already calling `updated_at=NOW()` but the column
--         was missing from the schema, causing silent SQL errors on every update.
CREATE TABLE IF NOT EXISTS events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(500)  NOT NULL,
  title_en    VARCHAR(500),
  content     LONGTEXT,
  content_en  LONGTEXT,
  type        ENUM('event','seminar','project','training') DEFAULT 'event',
  event_date  DATE,
  location    VARCHAR(255),
  location_en VARCHAR(255),
  image_url   TEXT          COMMENT 'Local uploads path e.g. /uploads/news/filename.jpg',
  published   TINYINT(1)    DEFAULT 1,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Heritage Items ───────────────────────────────────────────────────────────
-- FIX 3: Added `updated_at` column (same silent-failure bug as events).
CREATE TABLE IF NOT EXISTS heritage_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(500)  NOT NULL,
  title_en    VARCHAR(500),
  content     LONGTEXT,
  content_en  LONGTEXT,
  type        ENUM('tangible','intangible') DEFAULT 'tangible',
  image_url   TEXT          COMMENT 'Local uploads path e.g. /uploads/news/filename.jpg',
  location    VARCHAR(255),
  period      VARCHAR(100),
  published   TINYINT(1)    DEFAULT 1,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contact Messages ─────────────────────────────────────────────────────────
-- FIX 4: Added `phone` for contact form and `replied_at` for admin tracking.
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255),
  email       VARCHAR(255),
  phone       VARCHAR(50)   NULL COMMENT 'Optional contact phone',
  subject     VARCHAR(500),
  message     TEXT,
  read_status TINYINT(1)    DEFAULT 0,
  replied_at  DATETIME      NULL COMMENT 'Timestamp when admin replied',
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Partners ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  name_en     VARCHAR(255),
  logo_url    TEXT          COMMENT 'Partner logo URL',
  website_url TEXT,
  sort_order  INT           DEFAULT 0,
  is_active   TINYINT(1)    DEFAULT 1,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_partners_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Hero Slides ──────────────────────────────────────────────────────────────
-- FIX 5: Added `link_url`, `link_text_ar`, `link_text_en` so admin can attach
--         a CTA button to any hero slide (was completely missing before).
CREATE TABLE IF NOT EXISTS hero_slides (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  image_url     TEXT          NOT NULL COMMENT 'Hero image URL',
  caption_ar    VARCHAR(500),
  caption_en    VARCHAR(500),
  alt_ar        VARCHAR(500),
  alt_en        VARCHAR(500),
  link_url      VARCHAR(500)  NULL COMMENT 'Optional CTA link URL',
  link_text_ar  VARCHAR(200)  NULL COMMENT 'CTA button label (Arabic)',
  link_text_en  VARCHAR(200)  NULL COMMENT 'CTA button label (English)',
  sort_order    INT           DEFAULT 0,
  is_active     TINYINT(1)    DEFAULT 1,
  created_at    DATETIME      DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hero_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Site Settings ────────────────────────────────────────────────────────────
-- FIX 6: Added site identity fields (logo, favicon, site name) and about/vision/
--         mission text fields so admin can manage all page content from one table.
CREATE TABLE IF NOT EXISTS site_settings (
  id                        INT PRIMARY KEY DEFAULT 1 COMMENT 'Single row table',
  -- Identity
  site_name_ar              VARCHAR(255)  DEFAULT 'منظمة تراث اليمن لأجل السلام',
  site_name_en              VARCHAR(255)  DEFAULT 'Yemen Heritage for Peace',
  logo_url                  TEXT          NULL COMMENT 'Site logo image URL',
  favicon_url               TEXT          NULL COMMENT 'Site favicon URL',
  -- Contact
  contact_phone             VARCHAR(50),
  contact_email             VARCHAR(255),
  address_ar                TEXT,
  address_en                TEXT,
  -- Footer
  footer_desc_ar            TEXT,
  footer_desc_en            TEXT,
  -- Social
  social_facebook           TEXT,
  social_youtube            TEXT,
  social_linkedin           TEXT,
  social_x                  TEXT,
  -- Home About section image
  home_about_image_url      TEXT,
  home_about_image_alt_ar   VARCHAR(500),
  home_about_image_alt_en   VARCHAR(500),
  -- About page content (FIX: was hardcoded in frontend, admin can now edit)
  about_desc_ar             TEXT          NULL,
  about_desc_en             TEXT          NULL,
  vision_ar                 TEXT          NULL,
  vision_en                 TEXT          NULL,
  mission_ar                TEXT          NULL,
  mission_en                TEXT          NULL,
  updated_at                DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ensure singleton row always exists
INSERT IGNORE INTO site_settings (id) VALUES (1);

-- =============================================
-- Run `node seed.js` to insert the default super admin.
-- =============================================
