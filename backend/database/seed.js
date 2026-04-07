// seed.js  (FIXED)
// FIX 30: Seeds the `role` column — first admin is now `super_admin`.
// FIX 31: Seeds the new site_settings columns (site_name_ar/en, about/vision/mission text).
// FIX 32: ensureTables() is now in sync with the fixed schema (updated_at on events +
//          heritage, phone on contact_messages, link_url on hero_slides, identity fields
//          on site_settings).

require('dotenv').config()
const bcrypt = require('bcryptjs')
const db     = require('../lib/db')

async function ensureTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(255) NOT NULL,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role          ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
      is_active     TINYINT(1) DEFAULT 1,
      last_login    DATETIME NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(500) NOT NULL,
      title_en VARCHAR(500), content LONGTEXT, content_en LONGTEXT,
      category VARCHAR(100) DEFAULT 'أخبار', category_en VARCHAR(100) DEFAULT 'News',
      image_url TEXT, published TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(500) NOT NULL,
      title_en VARCHAR(500), content LONGTEXT, content_en LONGTEXT,
      type ENUM('event','seminar','project','training') DEFAULT 'event',
      event_date DATE, location VARCHAR(255), location_en VARCHAR(255),
      image_url TEXT, published TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS heritage_items (
      id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(500) NOT NULL,
      title_en VARCHAR(500), content LONGTEXT, content_en LONGTEXT,
      type ENUM('tangible','intangible') DEFAULT 'tangible',
      image_url TEXT, location VARCHAR(255), period VARCHAR(100),
      published TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255),
      phone VARCHAR(50) NULL, subject VARCHAR(500), message TEXT,
      read_status TINYINT(1) DEFAULT 0, replied_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id INT PRIMARY KEY,
      site_name_ar VARCHAR(255) DEFAULT 'منظمة تراث اليمن لأجل السلام',
      site_name_en VARCHAR(255) DEFAULT 'Yemen Heritage for Peace',
      logo_url TEXT NULL, favicon_url TEXT NULL,
      contact_phone VARCHAR(64) NULL, contact_email VARCHAR(255) NULL,
      address_ar VARCHAR(500) NULL, address_en VARCHAR(500) NULL,
      footer_desc_ar TEXT NULL, footer_desc_en TEXT NULL,
      social_facebook VARCHAR(500) NULL, social_youtube VARCHAR(500) NULL,
      social_linkedin VARCHAR(500) NULL, social_x VARCHAR(500) NULL,
      home_about_image_url TEXT NULL,
      home_about_image_alt_ar VARCHAR(255) NULL, home_about_image_alt_en VARCHAR(255) NULL,
      about_desc_ar TEXT NULL, about_desc_en TEXT NULL,
      vision_ar TEXT NULL, vision_en TEXT NULL,
      mission_ar TEXT NULL, mission_en TEXT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS partners (
      id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL,
      name_en VARCHAR(255) NULL, logo_url TEXT NULL, website_url TEXT NULL,
      sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_partners_active_sort (is_active, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS hero_slides (
      id INT AUTO_INCREMENT PRIMARY KEY, image_url TEXT NOT NULL,
      caption_ar VARCHAR(255) NULL, caption_en VARCHAR(255) NULL,
      alt_ar VARCHAR(255) NULL, alt_en VARCHAR(255) NULL,
      link_url VARCHAR(500) NULL, link_text_ar VARCHAR(200) NULL, link_text_en VARCHAR(200) NULL,
      sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_hero_active_sort (is_active, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)
}

async function seedAdmin() {
  const adminName  = process.env.ADMIN_NAME     || 'المشرف الرئيسي'
  const adminEmail = process.env.ADMIN_EMAIL    || 'admin@yemenheritagepeace.org'
  const adminPass  = process.env.ADMIN_PASSWORD || 'ChangeMeStrong!2025'

  const [rows] = await db.query('SELECT id FROM admins WHERE email=?', [adminEmail])
  if (rows.length) return

  const hash = await bcrypt.hash(adminPass, 12)
  // FIX: seed as super_admin
  await db.query(
    'INSERT INTO admins (name, email, password_hash, role, is_active) VALUES (?,?,?,?,1)',
    [adminName, adminEmail, hash, 'super_admin']
  )
  console.log(`✅ Super admin created: ${adminEmail}`)
}

async function seedSettings() {
  await db.query('INSERT INTO site_settings (id) VALUES (1) ON DUPLICATE KEY UPDATE id=id')
  const [rows] = await db.query('SELECT * FROM site_settings WHERE id=1')
  const s = rows[0] || {}

  const next = {
    site_name_ar: s.site_name_ar || 'منظمة تراث اليمن لأجل السلام',
    site_name_en: s.site_name_en || 'Yemen Heritage for Peace',
    contact_phone:  s.contact_phone  || '00967777240900',
    contact_email:  s.contact_email  || 'info@yemenheritagepeace.org',
    address_ar:     s.address_ar     || 'اليمن',
    address_en:     s.address_en     || 'Yemen',
    footer_desc_ar: s.footer_desc_ar || 'منظمة مجتمع مدني تعمل على صون التراث اليمني وبناء جسور السلام.',
    footer_desc_en: s.footer_desc_en || 'A civil society organization preserving Yemeni heritage and building bridges for peace.',
    social_facebook: s.social_facebook || 'https://www.facebook.com/share/15kSKtN3Rw/',
    social_youtube:  s.social_youtube  || 'https://youtube.com/@yemenheritageforpeace',
    social_linkedin: s.social_linkedin || 'https://www.linkedin.com/in/منظمة-تراث-اليمن-لأجل-السلام-6331903aa',
    social_x:        s.social_x        || 'https://x.com/yemenheritage26',
    home_about_image_url:    s.home_about_image_url    || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sultan_Al_Kathiri_Palace_Seiyun.jpg/1920px-Sultan_Al_Kathiri_Palace_Seiyun.jpg',
    home_about_image_alt_ar: s.home_about_image_alt_ar || 'قصر سيئون التاريخي في حضرموت',
    home_about_image_alt_en: s.home_about_image_alt_en || 'Historic Seiyun Palace in Hadhramaut',
    about_desc_ar: s.about_desc_ar || 'منظمة تراث اليمن لأجل السلام منظمة مجتمع مدني غير حكومية تأسست لتحقيق هدف واحد: صون الحضارة اليمنية العريقة وتوظيفها في خدمة السلام والتنمية.',
    about_desc_en: s.about_desc_en || 'Yemen Heritage for Peace is a non-governmental civil society organization established with one goal: preserving Yemen\'s ancient civilization and leveraging it for peace and development.',
    vision_ar:  s.vision_ar  || 'يمن يحافظ على تراثه الحضاري ويوظّفه لبناء مستقبل مستدام قائم على السلام والتعاون الدولي.',
    vision_en:  s.vision_en  || 'A Yemen that preserves its cultural heritage and uses it to build a sustainable future founded on peace and international cooperation.',
    mission_ar: s.mission_ar || 'صون التراث اليمني وتوثيقه وتعزيز قيم السلام عبر التعليم والبحث العلمي والشراكات الدولية.',
    mission_en: s.mission_en || 'Preserving and documenting Yemeni heritage and promoting peace values through education, research, and international partnerships.',
  }

  await db.query(
    `UPDATE site_settings SET
      site_name_ar=?, site_name_en=?,
      contact_phone=?, contact_email=?, address_ar=?, address_en=?,
      footer_desc_ar=?, footer_desc_en=?,
      social_facebook=?, social_youtube=?, social_linkedin=?, social_x=?,
      home_about_image_url=?, home_about_image_alt_ar=?, home_about_image_alt_en=?,
      about_desc_ar=?, about_desc_en=?,
      vision_ar=?, vision_en=?,
      mission_ar=?, mission_en=?
    WHERE id=1`,
    [
      next.site_name_ar, next.site_name_en,
      next.contact_phone, next.contact_email, next.address_ar, next.address_en,
      next.footer_desc_ar, next.footer_desc_en,
      next.social_facebook, next.social_youtube, next.social_linkedin, next.social_x,
      next.home_about_image_url, next.home_about_image_alt_ar, next.home_about_image_alt_en,
      next.about_desc_ar, next.about_desc_en,
      next.vision_ar, next.vision_en,
      next.mission_ar, next.mission_en,
    ]
  )
  console.log('✅ Settings seeded (id=1)')
}

async function seedHeroSlides() {
  const [cnt] = await db.query('SELECT COUNT(*) AS c FROM hero_slides')
  if ((cnt[0]?.c || 0) > 0) return

  const slides = [
    { image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/3840px-The_castle_above_Taiz_%288683935588%29.jpg', caption_ar: 'قلعة القاهرة – تعز', caption_en: 'Al-Qahira Castle – Taiz', alt_ar: 'قلعة القاهرة', alt_en: 'Al-Qahira Castle', sort_order: 1 },
    { image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Shibam_Wadi_Hadhramaut_Yemen.jpg', caption_ar: 'مدينة شبام – حضرموت', caption_en: 'Shibam – Hadhramaut', alt_ar: 'مبانٍ شبام الطينية', alt_en: 'Shibam mud-brick buildings', sort_order: 2 },
    { image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Socotra_Yemen.jpg/2560px-Socotra_Yemen.jpg', caption_ar: 'جزيرة سقطرى', caption_en: 'Socotra Island', alt_ar: 'منظر سقطرى', alt_en: 'Socotra landscape', sort_order: 3 },
  ]

  for (const s of slides) {
    await db.query(
      'INSERT INTO hero_slides (image_url,caption_ar,caption_en,alt_ar,alt_en,sort_order,is_active) VALUES (?,?,?,?,?,?,1)',
      [s.image_url, s.caption_ar, s.caption_en, s.alt_ar, s.alt_en, s.sort_order]
    )
  }
  console.log(`✅ Hero slides seeded: ${slides.length}`)
}

async function seedPartners() {
  const [cnt] = await db.query('SELECT COUNT(*) AS c FROM partners')
  if ((cnt[0]?.c || 0) > 0) return

  const partners = [
    { name: 'الهيئة العامة للآثار والمتاحف - تعز', name_en: 'General Authority for Antiquities - Taiz', logo_url: null, website_url: null, sort_order: 1 },
    { name: 'جامعة تعز', name_en: 'Taiz University', logo_url: null, website_url: null, sort_order: 2 },
    { name: 'المركز الإسباني للبحوث', name_en: 'CSIC – Spanish Research Center', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/CSIC_logo.svg/320px-CSIC_logo.svg.png', website_url: 'https://www.csic.es/', sort_order: 3 },
    { name: 'تراث من أجل السلام', name_en: 'Heritage for Peace', logo_url: null, website_url: null, sort_order: 4 },
    { name: 'جامعة بريستول', name_en: 'University of Bristol', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/University_of_Bristol_logo.svg/400px-University_of_Bristol_logo.svg.png', website_url: 'https://www.bristol.ac.uk/', sort_order: 5 },
  ]

  for (const p of partners) {
    await db.query(
      'INSERT INTO partners (name,name_en,logo_url,website_url,sort_order,is_active) VALUES (?,?,?,?,?,1)',
      [p.name, p.name_en, p.logo_url, p.website_url, p.sort_order]
    )
  }
  console.log(`✅ Partners seeded: ${partners.length}`)
}

async function seedNewsAndEvents() {
  const [nc] = await db.query('SELECT COUNT(*) AS c FROM news')
  if ((nc[0]?.c || 0) === 0) {
    const newsItems = [
      { title: 'ورشة عمل حول توثيق التراث المعماري في تعز', title_en: 'Workshop on Architectural Heritage Documentation in Taiz', category: 'فعاليات', category_en: 'Events', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1920px-The_castle_above_Taiz_%288683935588%29.jpg', content: 'نظّمت المنظمة ورشة عمل تفاعلية حول أساليب توثيق التراث المعماري باستخدام أدوات رقمية حديثة.', content_en: 'The organization held an interactive workshop on documenting architectural heritage using modern digital tools.' },
      { title: 'إطلاق مشروع توثيق الموروث الشفهي اليمني', title_en: 'Launch of Digital Yemeni Oral Heritage Project', category: 'مشاريع', category_en: 'Projects', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/1920px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg', content: 'مشروع يهدف إلى توثيق الروايات والأغاني الشعبية وحفظها في أرشيف رقمي للأجيال القادمة.', content_en: 'A project aiming to document stories and folk songs and preserve them in a digital archive for future generations.' },
      { title: 'تقرير حول احتياجات حماية المواقع الأثرية', title_en: 'Report on Protection Needs of Archaeological Sites', category: 'دراسات', category_en: 'Studies', image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1920px-Temple_in_Ancient_city_of_Marib.jpg', content: 'أصدرت المنظمة تقريراً حول المواقع الأثرية واحتياجاتها العاجلة للحماية والتوثيق.', content_en: 'The organization published a report on archaeological sites and their urgent protection needs.' },
    ]
    for (const n of newsItems) {
      await db.query(
        'INSERT INTO news (title,title_en,content,content_en,category,category_en,image_url,published) VALUES (?,?,?,?,?,?,?,1)',
        [n.title, n.title_en, n.content, n.content_en, n.category, n.category_en, n.image_url]
      )
    }
    console.log(`✅ News seeded: ${newsItems.length}`)
  }

  const [ec] = await db.query('SELECT COUNT(*) AS c FROM events')
  if ((ec[0]?.c || 0) === 0) {
    const eventItems = [
      { title: 'ندوة: دور التراث في بناء السلام', title_en: 'Seminar: Role of Heritage in Peacebuilding', type: 'seminar', event_date: '2026-04-10', location: 'تعز، اليمن', location_en: 'Taiz, Yemen', image_url: null },
      { title: 'برنامج تدريبي: توثيق التراث الرقمي', title_en: 'Training: Digital Heritage Documentation', type: 'training', event_date: '2026-06-15', location: 'عدن، اليمن', location_en: 'Aden, Yemen', image_url: null },
      { title: 'معرض: التراث المادي اليمني', title_en: 'Exhibition: Yemeni Tangible Heritage', type: 'event', event_date: '2026-05-01', location: 'عبر الإنترنت', location_en: 'Online', image_url: null },
    ]
    for (const e of eventItems) {
      await db.query(
        'INSERT INTO events (title,title_en,content,content_en,type,event_date,location,location_en,image_url,published) VALUES (?,?,?,?,?,?,?,?,?,1)',
        [e.title, e.title_en, null, null, e.type, e.event_date, e.location, e.location_en, e.image_url]
      )
    }
    console.log(`✅ Events seeded: ${eventItems.length}`)
  }
}

async function main() {
  console.log('🌱 Seeding database...')
  await ensureTables()
  await seedAdmin()
  await seedSettings()
  await seedHeroSlides()
  await seedPartners()
  await seedNewsAndEvents()
  console.log('✅ Done.')
  process.exit(0)
}

main().catch((e) => {
  console.error('❌ Seed failed:', e)
  process.exit(1)
})
