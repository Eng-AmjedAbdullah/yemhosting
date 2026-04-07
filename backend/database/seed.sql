-- ============================================================
-- Yemen Heritage for Peace — Comprehensive Database Seed v3
-- Run this in phpMyAdmin → Select `yemen_heritage` → SQL tab
-- This REPLACES all existing seed data with full content.
-- Admin account is NOT touched (your password stays).
-- ============================================================

USE `yemen_heritage`;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ============================================================
-- 1. SITE SETTINGS — Full organization info AR + EN
-- ============================================================
UPDATE `site_settings` SET
  `site_name_ar`             = 'منظمة تراث اليمن لأجل السلام',
  `site_name_en`             = 'Yemen Heritage for Peace',
  `contact_phone`            = '00967777240900',
  `contact_email`            = 'info@yemenheritagepeace.org',
  `address_ar`               = 'الجمهورية اليمنية – تعز – حوض الأشراف – أمام مدرسة الشعب',
  `address_en`               = 'Republic of Yemen – Taiz – Hawd Al-Ashraf – In front of Al-Sha\'ab School',
  `footer_desc_ar`           = 'منظمة مجتمع مدني غير حكومية تعمل على الحفاظ على التراث الثقافي والعلمي اليمني وتعزيز السلام عبر التعليم والبحث والفعاليات الثقافية.',
  `footer_desc_en`           = 'A non-governmental civil society organization working to preserve Yemeni cultural and scientific heritage and promote peace through education, research, and cultural programs.',
  `social_facebook`          = 'https://www.facebook.com/share/15kSKtN3Rw/',
  `social_youtube`           = 'https://youtube.com/@yemenheritageforpeace',
  `social_linkedin`          = 'https://www.linkedin.com/in/منظمة-تراث-اليمن-لأجل-السلام-6331903aa',
  `social_x`                 = 'https://x.com/yemenheritage26',
  `home_about_image_url`     = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1280px-The_castle_above_Taiz_%288683935588%29.jpg',
  `home_about_image_alt_ar`  = 'قلعة القاهرة التاريخية تطل على مدينة تعز',
  `home_about_image_alt_en`  = 'Historic Al-Qahira Castle overlooking Taiz city',

  -- Full About page description
  `about_desc_ar` = 'منظمة تراث اليمن لأجل السلام منظمةٌ مجتمعيةٌ مدنيةٌ غير حكومية، تأسّست في تعز لتحقيق هدفٍ واحد: صون الحضارة اليمنية العريقة وتوظيفها في خدمة السلام والتنمية المستدامة. تعمل المنظمة على الحفاظ على التراث الثقافي والعلمي اليمني وتعزيز الوعي المجتمعي به من خلال برامج تعليمية، وفعاليات ثقافية، وبحوث علمية تربط الماضي بالحاضر لبناء مستقبلٍ سلميٍّ ومستدام. تنطلق المنظمة من إيمانٍ راسخٍ بأن الحفاظ على الموروث الحضاري اليمني هو حجر الأساس في بناء السلام الاجتماعي وتحقيق التنمية الشاملة.',
  `about_desc_en` = 'Yemen Heritage for Peace is a non-governmental civil society organization founded in Taiz with a single mission: preserving Yemen\'s ancient civilization and leveraging it for peace and sustainable development. The organization works to protect Yemeni cultural and scientific heritage and raise community awareness through educational programs, cultural events, and scientific research that bridges the past and present to build a peaceful and sustainable future. The organization is driven by a firm belief that preserving Yemeni cultural heritage is the cornerstone of building social peace and achieving comprehensive development.',

  -- Vision
  `vision_ar`  = 'بناء مجتمع يمني مزدهر يحتفي بتراثه الغني، يعزّز السلام من خلال العلوم والثقافة، ويبني جسور التواصل بين الأجيال والشعوب.',
  `vision_en`  = 'Building a prosperous Yemeni society that celebrates its rich heritage, promotes peace through science and culture, and builds bridges of communication between generations and peoples.',

  -- Mission
  `mission_ar` = 'تعزيز التراث اليمني في مجالات الثقافة والعلوم من خلال برامج بحثية وعملية تربط الماضي بالمستقبل، لدعم السلام والاستقرار الاجتماعي والاقتصادي في اليمن، بالاعتماد على أساليب علمية دقيقة وشراكات محلية ودولية.',
  `mission_en` = 'Promoting Yemeni heritage in culture and science through research and practical programs that connect the past to the future, to support peace and social and economic stability in Yemen, relying on precise scientific methods and local and international partnerships.'
WHERE `id` = 1;


-- ============================================================
-- 2. HERO SLIDES — 4 slides with real Wikimedia image URLs
-- ============================================================
TRUNCATE TABLE `hero_slides`;

INSERT INTO `hero_slides`
  (`id`, `image_url`, `caption_ar`, `caption_en`, `alt_ar`, `alt_en`, `link_url`, `link_text_ar`, `link_text_en`, `sort_order`, `is_active`) VALUES

(1,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1920px-The_castle_above_Taiz_%288683935588%29.jpg',
 'قلعة القاهرة – تعز، اليمن',
 'Al-Qahira Castle – Taiz, Yemen',
 'قلعة القاهرة التاريخية تطل على مدينة تعز من شامخ قممها',
 'The historic Al-Qahira Castle overlooking Taiz city from its towering heights',
 '/heritage-life?type=tangible', 'اكتشف التراث المادي', 'Explore Tangible Heritage',
 1, 1),

(2,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shibam_Wadi_Hadhramaut_Yemen.jpg/1920px-Shibam_Wadi_Hadhramaut_Yemen.jpg',
 'مدينة شبام – ناطحات سحاب من الطين',
 'Shibam – The Ancient Skyscrapers of Mud',
 'أبراج شبام الطينية الشاهقة في وادي حضرموت – موقع تراث عالمي يونسكو',
 'The towering mud-brick skyscrapers of Shibam in Wadi Hadhramaut – a UNESCO World Heritage Site',
 '/about', 'عن منظمتنا', 'About Our Organization',
 2, 1),

(3,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1920px-Temple_in_Ancient_city_of_Marib.jpg',
 'معبد مأرب الأثري – حضارة سبأ العريقة',
 'Marib Archaeological Temple – The Ancient Sabaean Civilization',
 'المعبد الأثري في مدينة مأرب القديمة، شاهدٌ على حضارة سبأ',
 'The archaeological temple in the ancient city of Marib, a testament to the Sabaean civilization',
 '/heritage-life?type=tangible', 'اكتشف التراث', 'Discover Heritage',
 3, 1),

(4,
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/1920px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg',
 'رقصة البرع – تراث يمني لا مادي أصيل',
 'Al-Bura\'a Dance – Authentic Yemeni Intangible Heritage',
 'رقصة البرع اليمنية التقليدية بالجنبية – تراث إنساني عالمي',
 'Traditional Yemeni Al-Bura\'a dance with Janbiya – recognized as world intangible heritage',
 '/heritage-life?type=intangible', 'التراث اللامادي', 'Intangible Heritage',
 4, 1);


-- ============================================================
-- 3. NEWS — 6 articles with full content + real images
-- ============================================================
TRUNCATE TABLE `news`;

INSERT INTO `news`
  (`id`, `title`, `title_en`, `content`, `content_en`, `category`, `category_en`, `image_url`, `published`) VALUES

(1,
 'ورشة عمل متخصصة في توثيق التراث المعماري التاريخي بتعز',
 'Specialized Workshop on Documenting Historic Architectural Heritage in Taiz',
 'نظّمت منظمة تراث اليمن لأجل السلام بالتعاون مع جامعة تعز ورشة عمل تفاعلية حول أساليب توثيق التراث المعماري باستخدام التصوير الفوتوغرامتري ثلاثي الأبعاد والمسح بالليزر. شارك في الورشة نخبة من الأكاديميين والباحثين والطلاب من مختلف التخصصات، وتناولت الجلسات أحدث التقنيات الرقمية في الحفاظ على المباني التاريخية وأرشفتها. وأكد المشاركون أهمية التوثيق الرقمي في حماية الموروث المعماري اليمني من الاندثار في ظل الظروف الراهنة، مشيرين إلى أن قلعة القاهرة ومنطقة الحوبان التاريخية في تعز تستحقان الأولوية في مشاريع التوثيق المستقبلية.',
 'The Yemen Heritage for Peace Organization, in cooperation with Taiz University, organized an interactive workshop on architectural heritage documentation methods using 3D photogrammetry and laser scanning. The workshop brought together academics, researchers, and students from various disciplines, covering the latest digital technologies in preserving and archiving historic buildings. Participants emphasized the importance of digital documentation in protecting Yemeni architectural heritage from disappearing under current conditions, noting that Al-Qahira Castle and the historic Hawban area in Taiz deserve priority in future documentation projects.',
 'فعاليات', 'Events',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1280px-The_castle_above_Taiz_%288683935588%29.jpg',
 1),

(2,
 'إطلاق مشروع رقمنة الموروث الشفهي اليمني للأجيال القادمة',
 'Launch of the Yemeni Oral Heritage Digitization Project for Future Generations',
 'أطلقت المنظمة مشروع توثيق الموروث الشفهي اليمني رقمياً، الذي يستهدف تسجيل وحفظ الأمثال الشعبية والحكايات التراثية والأشعار والأغاني الشعبية وموسيقى المقامات اليمنية في أرشيف رقمي مفتوح المصدر. يأتي هذا المشروع استجابةً للخطر المتصاعد الذي يهدد الموروث الشفهي جراء الظروف الاستثنائية التي تمر بها اليمن. ويضم الفريق المنفّذ باحثين ومختصين في اللسانيات وعلم الأجناس الموسيقية وتكنولوجيا المعلومات، ويسعى المشروع خلال مرحلته الأولى إلى توثيق ما لا يقل عن 500 مادة شفهية من محافظتي تعز وإب.',
 'The organization launched a digital documentation project for Yemeni oral heritage, aiming to record and preserve proverbs, folk tales, poetry, folk songs, and Yemeni maqam music in an open-source digital archive. This project comes in response to the growing threat to oral heritage due to the exceptional circumstances Yemen is going through. The executing team includes researchers and specialists in linguistics, ethnomusicology, and information technology. In its first phase, the project aims to document at least 500 oral materials from the governorates of Taiz and Ibb.',
 'مشاريع', 'Projects',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/1280px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg',
 1),

(3,
 'تقرير تحليلي شامل حول أوضاع المواقع الأثرية في محافظة تعز',
 'Comprehensive Analytical Report on the State of Archaeological Sites in Taiz Governorate',
 'أصدرت منظمة تراث اليمن لأجل السلام تقريرها التحليلي السنوي حول أوضاع المواقع الأثرية في محافظة تعز، والذي يرصد ما لا يقل عن 27 موقعاً أثرياً تتفاوت درجات الخطر التي تتهددها بين متوسطة وحرجة. ويوصي التقرير بضرورة إنشاء منظومة رقابة ميدانية دورية، وتفعيل التعاون مع المنظمات الدولية المعنية بالتراث مثل اليونسكو وإيكروم، فضلاً عن تدريب كوادر محلية متخصصة في الحفاظ على الآثار والتوثيق الميداني.',
 'The Yemen Heritage for Peace Organization published its annual analytical report on the state of archaeological sites in Taiz Governorate, documenting no fewer than 27 archaeological sites facing varying degrees of risk ranging from moderate to critical. The report recommends establishing a regular field monitoring system, activating cooperation with international heritage organizations such as UNESCO and ICCROM, and training specialized local teams in heritage conservation and field documentation.',
 'دراسات', 'Studies',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1280px-Temple_in_Ancient_city_of_Marib.jpg',
 1),

(4,
 'المنظمة تشارك في المؤتمر الدولي للتراث الثقافي في زمن النزاع',
 'Organization Participates in International Conference on Cultural Heritage in Times of Conflict',
 'مثّلت منظمة تراث اليمن لأجل السلام اليمن في المؤتمر الدولي للتراث الثقافي في زمن النزاع المسلح المنعقد بجنيف، حيث قدّمت المنظمة ورقة عمل بعنوان: "أولويات حماية التراث الثقافي اليمني: الواقع والتحديات والحلول". وأكدت الورقة على أهمية تفعيل اتفاقية لاهاي لحماية الممتلكات الثقافية في حالة نزاع مسلح، ودعت إلى تشكيل شبكة حماية إقليمية تضم اليمن ودول الجوار للتصدي لتهريب المقتنيات الأثرية.',
 'Yemen Heritage for Peace represented Yemen at the International Conference on Cultural Heritage in Times of Armed Conflict held in Geneva, where the organization presented a working paper titled: "Priorities for Protecting Yemeni Cultural Heritage: Reality, Challenges and Solutions." The paper emphasized the importance of activating the Hague Convention for the Protection of Cultural Property in Armed Conflict and called for the formation of a regional protection network including Yemen and neighboring countries to combat the smuggling of antiquities.',
 'أخبار', 'News',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sultan_Al_Kathiri_Palace_Seiyun.jpg/1280px-Sultan_Al_Kathiri_Palace_Seiyun.jpg',
 1),

(5,
 'برنامج تدريبي لشباب تعز في مجال الحفاظ على التراث',
 'Training Program for Taiz Youth in Heritage Conservation',
 'نفّذت المنظمة برنامجاً تدريبياً مكثفاً موجّهاً لشريحة الشباب في محافظة تعز تحت عنوان "حُماة التراث"، وذلك بالشراكة مع مركز الشباب والثقافة. أتاح البرنامج لأكثر من 40 شاباً وشابة التعرف على مناهج الحفاظ على التراث الثقافي وتوثيقه، وتدرّبوا على استخدام تطبيقات التصوير الجغرافي وأدوات الأرشفة الرقمية. ويأتي هذا البرنامج ضمن استراتيجية المنظمة لبناء جيل من الشباب المدرّب القادر على حماية الإرث الحضاري اليمني والمضي به نحو المستقبل.',
 'The organization implemented an intensive training program targeting young people in Taiz Governorate under the title "Heritage Guardians," in partnership with the Youth and Culture Center. The program allowed more than 40 young men and women to learn about cultural heritage conservation and documentation methods, and they were trained in using geo-photography applications and digital archiving tools. This program is part of the organization\'s strategy to build a generation of trained youth capable of protecting Yemeni civilizational heritage and carrying it into the future.',
 'برامج', 'Programs',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Socotra_Yemen.jpg/1280px-Socotra_Yemen.jpg',
 1),

(6,
 'شراكة استراتيجية جديدة مع جامعة بريستول البريطانية لدراسة التراث اليمني',
 'New Strategic Partnership with the University of Bristol to Study Yemeni Heritage',
 'وقّعت منظمة تراث اليمن لأجل السلام مذكرة تفاهم مع جامعة بريستول البريطانية في إطار مشروع بحثي مشترك يستهدف دراسة العمارة الطينية التقليدية في محافظتي تعز وحضرموت. يتضمن المشروع إجراء مسح ميداني شامل، وإنتاج مواد أكاديمية منشورة، وتبادل خبرات الحفاظ والصون بين الباحثين اليمنيين والبريطانيين. وتُعدّ هذه الشراكة نموذجاً للتعاون الدولي الهادف إلى توثيق التراث اليمني قبل أن تطاله يد الإهمال أو النسيان.',
 'Yemen Heritage for Peace signed a memorandum of understanding with the University of Bristol as part of a joint research project targeting the study of traditional mud architecture in the governorates of Taiz and Hadhramaut. The project includes conducting a comprehensive field survey, producing published academic materials, and exchanging conservation expertise between Yemeni and British researchers. This partnership is a model for international cooperation aimed at documenting Yemeni heritage before it is lost to neglect or oblivion.',
 'شراكات', 'Partnerships',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shibam_Wadi_Hadhramaut_Yemen.jpg/1280px-Shibam_Wadi_Hadhramaut_Yemen.jpg',
 1);


-- ============================================================
-- 4. EVENTS — 6 events ALL with images and full content
-- ============================================================
TRUNCATE TABLE `events`;

INSERT INTO `events`
  (`id`, `title`, `title_en`, `content`, `content_en`, `type`, `event_date`, `location`, `location_en`, `image_url`, `published`) VALUES

(1,
 'ندوة علمية: دور التراث الثقافي في بناء السلام المستدام',
 'Scientific Seminar: The Role of Cultural Heritage in Building Sustainable Peace',
 'تنظم المنظمة ندوةً علميةً رفيعة المستوى تجمع أكاديميين وباحثين ومختصين من اليمن والمنطقة العربية لمناقشة الدور المحوري للتراث الثقافي في تعزيز قيم السلام والمصالحة المجتمعية. تتضمن الندوة أوراق بحثية متخصصة وجلسات حوارية تفاعلية تتناول تجارب دولية ناجحة في توظيف التراث الثقافي وسيلةً للتعافي المجتمعي بعد النزاعات. كما ستُطلق الندوة توصيات عملية قابلة للتطبيق في السياق اليمني.',
 'The organization is hosting a high-level scientific seminar bringing together academics, researchers, and specialists from Yemen and the Arab region to discuss the pivotal role of cultural heritage in promoting peace values and community reconciliation. The seminar includes specialized research papers and interactive discussion sessions covering successful international experiences in using cultural heritage as a tool for community recovery after conflicts. The seminar will also launch practical recommendations applicable to the Yemeni context.',
 'seminar', '2026-04-10',
 'تعز – قاعة المؤتمرات الكبرى، فندق الجزيرة',
 'Taiz – Grand Conference Hall, Al-Jazira Hotel',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1280px-The_castle_above_Taiz_%288683935588%29.jpg',
 1),

(2,
 'برنامج تدريبي مكثف: مناهج توثيق التراث الرقمي',
 'Intensive Training Program: Digital Heritage Documentation Methods',
 'برنامج تدريبي متخصص مدّته خمسة أيام يستهدف الباحثين والطلاب والعاملين في المجال الثقافي والأثري، ويتناول أحدث أدوات ومناهج التوثيق الرقمي للتراث الثقافي المادي وغير المادي. يشمل البرنامج وحدات تدريبية في: التصوير الفوتوغرامتري ثلاثي الأبعاد، والتصوير بالطائرات المسيّرة لرصد المواقع الأثرية، وإنشاء قواعد البيانات الأثرية، وأدوات الواقع الافتراضي في عرض التراث. ستمنح المنظمة شهادات معتمدة للمتدربين الناجحين.',
 'A specialized five-day training program targeting researchers, students, and professionals in the cultural and archaeological fields, covering the latest tools and methods for digital documentation of tangible and intangible cultural heritage. The program includes training units in: 3D photogrammetry, drone photography for archaeological site monitoring, creating archaeological databases, and virtual reality tools for heritage presentation. The organization will grant accredited certificates to successful trainees.',
 'training', '2026-05-20',
 'عدن – مركز التدريب والتطوير، جامعة عدن',
 'Aden – Training and Development Center, University of Aden',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/1280px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg',
 1),

(3,
 'معرض فني وتوثيقي: روائع التراث المادي اليمني',
 'Art and Documentary Exhibition: Masterpieces of Yemeni Tangible Heritage',
 'يستضيف مركز تعز الثقافي معرضاً فنياً وتوثيقياً استثنائياً يضم أكثر من 150 صورة فوتوغرافية عالية الجودة توثّق المواقع الأثرية والمعالم التاريخية اليمنية، إلى جانب مجموعة من المستنسخات الأثرية المصنوعة بتقنيات الطباعة ثلاثية الأبعاد. يستعرض المعرض حضارات اليمن القديمة: السبئية والمعينية والحميرية والحضرمية، ويضم ركناً خاصاً بتعز وتراثها المعماري الفريد. المعرض مفتوح للعموم ولطلاب المدارس والجامعات.',
 'The Taiz Cultural Center is hosting an exceptional art and documentary exhibition featuring more than 150 high-quality photographs documenting Yemeni archaeological sites and historical landmarks, alongside a collection of archaeological replicas made using 3D printing technology. The exhibition showcases Yemen\'s ancient civilizations: Sabaean, Minaean, Himyarite, and Hadhramaut, and includes a special section dedicated to Taiz and its unique architectural heritage. The exhibition is open to the public and to school and university students.',
 'event', '2026-06-01',
 'تعز – المركز الثقافي',
 'Taiz – Cultural Center',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1280px-Temple_in_Ancient_city_of_Marib.jpg',
 1),

(4,
 'مؤتمر شباب التراث: مبادرات الحفاظ على الهوية الحضارية',
 'Heritage Youth Conference: Initiatives for Preserving Civilizational Identity',
 'يُنظَّم هذا المؤتمر بمشاركة 200 شاب وشابة من مختلف محافظات اليمن للتداول في سبل توظيف طاقة الشباب في خدمة قضايا التراث الثقافي. تتصدّر أجندة المؤتمر ورشُ عمل حول ريادة الأعمال في قطاع التراث، وتجارب الشباب في توثيق الموروث الشفهي، والاستخدام الإبداعي لوسائل التواصل الاجتماعي للترويج للتراث اليمني عالمياً. يختتم المؤتمر بإعلان "منح التراث الشبابية" لدعم مبادرات شبابية واعدة.',
 'This conference is organized with the participation of 200 young men and women from various Yemeni governorates to discuss ways to channel youth energy in service of cultural heritage issues. The conference agenda features workshops on entrepreneurship in the heritage sector, youth experiences in documenting oral heritage, and the creative use of social media to promote Yemeni heritage globally. The conference concludes with the announcement of "Youth Heritage Grants" to support promising youth initiatives.',
 'seminar', '2026-07-15',
 'إب – مركز الثقافة والإبداع الشبابي',
 'Ibb – Youth Culture and Creativity Center',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sultan_Al_Kathiri_Palace_Seiyun.jpg/1280px-Sultan_Al_Kathiri_Palace_Seiyun.jpg',
 1),

(5,
 'مشروع ميداني: مسح وتوثيق مواقع الحضارة السبئية في مأرب',
 'Field Project: Survey and Documentation of Sabaean Civilization Sites in Marib',
 'ينفّذ الفريق الميداني للمنظمة حملة مسح شاملة للمواقع الأثرية المرتبطة بالحضارة السبئية في محيط مأرب، وذلك بالتعاون مع هيئة الآثار والمتاحف والمركز الإسباني للبحوث الأثرية. يهدف المشروع إلى رصد حالة المواقع وتوثيق ما تعرّضت له من أضرار، وإعداد خارطة أثرية رقمية تفصيلية. ومن المتوقع أن يُسفر عن إنتاج تقرير علمي موثّق يُوزَّع على المنظمات الدولية المعنية لدعم جهود الحماية والصون.',
 'The organization\'s field team is carrying out a comprehensive survey of archaeological sites related to the Sabaean civilization around Marib, in cooperation with the Antiquities and Museums Authority and the Spanish Center for Archaeological Research. The project aims to monitor the condition of sites, document damages they have suffered, and prepare a detailed digital archaeological map. It is expected to produce a documented scientific report that will be distributed to relevant international organizations to support protection and conservation efforts.',
 'project', '2026-08-10',
 'مأرب – المواقع الأثرية المحيطة بمدينة مأرب القديمة',
 'Marib – Archaeological sites surrounding the ancient city of Marib',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1280px-Temple_in_Ancient_city_of_Marib.jpg',
 1),

(6,
 'ورشة عمل: الحرف اليدوية التقليدية اليمنية — صون وتطوير',
 'Workshop: Traditional Yemeni Handicrafts — Preservation and Development',
 'تنظّم المنظمة ورشة عمل تجمع حرفيين تقليديين ومختصين في التراث وروّاد أعمال شباب لبحث آفاق الحفاظ على الحرف اليدوية اليمنية الأصيلة وتطوير سلاسل قيمتها الاقتصادية. تشمل الحرف المستهدفة: الخوصيات، والأواني الفخارية، والمشغولات الفضية، والنسيج التقليدي، والجنابي المزخرفة. وتهدف الورشة إلى ربط الحرفيين بالأسواق المحلية والدولية، وتطوير نماذج عمل مستدامة تحفظ هذا الإرث الحضاري وتُمكّن أصحابه اقتصادياً.',
 'The organization is holding a workshop bringing together traditional craftspeople, heritage specialists, and young entrepreneurs to explore prospects for preserving authentic Yemeni handicrafts and developing their economic value chains. Target crafts include: palm frond weaving, pottery, silverwork, traditional weaving, and decorated Janbiya daggers. The workshop aims to connect artisans to local and international markets and develop sustainable business models that preserve this civilizational heritage and economically empower its practitioners.',
 'training', '2026-09-05',
 'تعز – مركز تنمية المرأة والأسرة',
 'Taiz – Women and Family Development Center',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Socotra_Yemen.jpg/1280px-Socotra_Yemen.jpg',
 1);


-- ============================================================
-- 5. HERITAGE ITEMS — Tangible (6) + Intangible (5)
-- ============================================================
TRUNCATE TABLE `heritage_items`;

-- ── Tangible ─────────────────────────────────────────────
INSERT INTO `heritage_items`
  (`id`, `title`, `title_en`, `content`, `content_en`, `type`, `image_url`, `location`, `period`, `published`) VALUES

(1,
 'قلعة القاهرة التاريخية – تعز',
 'Al-Qahira Historic Castle – Taiz',
 'تقع قلعة القاهرة على ذروة جبل يطل على مدينة تعز بارتفاع يبلغ نحو 2800 متر فوق سطح البحر، وهي من أبرز القلاع والحصون في اليمن والجزيرة العربية. يعود تأسيسها إلى الدولة الرسولية في القرن الثالث عشر الميلادي، وقد شهدت توسّعات وترميمات متعاقبة في عهد الدولة الطاهرية. تتميز القلعة بأسوارها الضخمة وأبراجها الدفاعية وقصورها الملكية وخزاناتها المائية الكبيرة التي كانت تُؤمّن المياه للمحاصرين. تُعدّ القلعة اليوم من أبرز المعالم السياحية والأثرية في تعز.',
 'Al-Qahira Castle sits atop a mountain overlooking Taiz city at an elevation of approximately 2,800 meters above sea level, and is one of the most prominent castles and fortresses in Yemen and the Arabian Peninsula. Its founding dates back to the Rasulid State in the 13th century AD, and it underwent successive expansions and restorations during the Tahirid State era. The castle is distinguished by its massive walls, defensive towers, royal palaces, and large water cisterns that once secured water for those besieged within. Today the castle is one of the most prominent tourist and archaeological landmarks in Taiz.',
 'tangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/1280px-The_castle_above_Taiz_%288683935588%29.jpg',
 'تعز، اليمن', 'القرن 13 – 15 م',
 1),

(2,
 'مدينة شبام – ناطحات سحاب الطين (تراث عالمي يونسكو)',
 'Shibam – The Mud-Brick Skyscrapers (UNESCO World Heritage)',
 'تُعدّ مدينة شبام في وادي حضرموت أقدم مدن الناطحات السحاب في التاريخ، إذ تضم نحو 500 مبنى شاهق من الطين يبلغ ارتفاع أعلاها 11 طابقاً. تأسّست المدينة منذ أكثر من 2000 عام، وقد عُرفت بأسماء: "مانهاتن الصحراء" و"بابل الجزيرة العربية". أُدرجت المدينة على قائمة التراث العالمي لليونسكو عام 1982م. تمثّل شبام نموذجاً معمارياً استثنائياً في التكيّف مع البيئة الصحراوية، حيث وفّرت ناطحاتها السحابية الطينية الحماية من الغزوات وكفالت استخداماً أمثل للأراضي الزراعية الشحيحة.',
 'The city of Shibam in Wadi Hadhramaut is considered the oldest city of skyscrapers in history, containing approximately 500 tall mud-brick buildings reaching up to 11 stories at their tallest. The city was founded more than 2,000 years ago and has been known by names including "Manhattan of the Desert" and "Babylon of the Arabian Peninsula." The city was inscribed on the UNESCO World Heritage List in 1982. Shibam represents an exceptional architectural model of adaptation to the desert environment, where its mud skyscrapers provided protection from invasions and ensured optimal use of scarce agricultural land.',
 'tangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shibam_Wadi_Hadhramaut_Yemen.jpg/1280px-Shibam_Wadi_Hadhramaut_Yemen.jpg',
 'وادي حضرموت، اليمن', 'القرن 3 ق.م – العصر الحديث',
 1),

(3,
 'مدينة صنعاء القديمة – تراث عالمي يونسكو',
 'Old City of Sana\'a – UNESCO World Heritage',
 'المدينة القديمة في صنعاء من أقدم المدن المأهولة بالسكان في العالم، إذ يمتد تاريخها لأكثر من 2500 عام. أُدرجت في قائمة التراث العالمي لليونسكو عام 1986م. تتميز المدينة بعمارتها الإسلامية الفريدة التي تتجلى في منازلها البرجية المزيّنة بالنوافذ البيضاء الملوّنة بالجصّ الأبيض "القمريات"، ومساجدها التاريخية التي يصل عددها إلى 103 مساجد، وحماماتها الشعبية ودورها التاريخية. تمثّل المدينة القديمة لصنعاء شاهداً حيّاً على حضارة إسلامية يمنية راسخة وعميقة الجذور.',
 'The Old City of Sana\'a is one of the oldest continuously inhabited cities in the world, with a history spanning more than 2,500 years. It was inscribed on the UNESCO World Heritage List in 1986. The city is distinguished by its unique Islamic architecture, manifested in its tower houses adorned with white alabaster-decorated windows "qamariyat," its 103 historic mosques, popular bathhouses, and historic residences. The Old City of Sana\'a represents a living testament to a deeply rooted Yemeni Islamic civilization.',
 'tangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Old_City_of_Sana%27a.jpg/1280px-Old_City_of_Sana%27a.jpg',
 'صنعاء، اليمن', 'ما قبل الإسلام – العصر الحديث',
 1),

(4,
 'معبد أوام (محرم بلقيس) – مأرب',
 'Awwam Temple (Mahram Bilqis) – Marib',
 'معبد أوام، المعروف شعبياً بـ"محرم بلقيس"، معبدٌ سبئي عريق يقع على بُعد نحو خمسة كيلومترات جنوب غرب مدينة مأرب. بُني المعبد لتكريم الإله القمري "المقه" إله سبأ الكبير، ويعود تاريخه إلى القرن السابع قبل الميلاد على أقل تقدير. يضم المعبد قاعة ذات خمسة أعمدة حجرية بيضاوية شاهقة تُعدّ من أبرز علامات المعبد، فضلاً عن ردهة ضخمة ومنطقة دفن ملكية. جرى التنقيب في المعبد في فترات مختلفة من القرن العشرين، وأسفرت الحفريات عن آلاف الكتابات واللقى الأثرية السبئية النفيسة.',
 'Awwam Temple, popularly known as "Mahram Bilqis," is an ancient Sabaean temple located about five kilometers southwest of Marib city. The temple was built to honor the lunar deity "Almaqah," the great god of Saba, dating back to at least the 7th century BC. The temple features a hall with five tall elliptical stone columns that are among its most prominent landmarks, along with a large vestibule and a royal burial area. The temple has been excavated in various periods of the 20th century, and the excavations yielded thousands of Sabaean inscriptions and precious archaeological finds.',
 'tangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Temple_in_Ancient_city_of_Marib.jpg/1280px-Temple_in_Ancient_city_of_Marib.jpg',
 'مأرب، اليمن', 'القرن 7 ق.م – 300 م',
 1),

(5,
 'جزيرة سقطرى – ممرات حيوانية نادرة (تراث عالمي)',
 'Socotra Island – Rare Biodiversity Corridors (World Heritage)',
 'جزيرة سقطرى في خليج عدن معزولة جغرافياً بما جعلها موئلاً لأكثر من 825 نوعاً من النباتات، يفوق ثلثها ثلث نسبة 37% من نسبة التوطن العالمي. أُدرجت على قائمة التراث الطبيعي العالمي لليونسكو عام 2008م. تشتهر الجزيرة بشجرة دم الأخوين "Dracaena cinnabari" ذات الشكل الفطري المميز، وبأنواعها النباتية والحيوانية الفريدة التي لا وجود لها في أي مكان آخر على كوكب الأرض. تمثّل سقطرى تراثاً طبيعياً وثقافياً بالغ الأهمية، ويحمل سكانها الأصليون لغة سقطرية خاصة غير مكتوبة تُعدّ كنزاً لسانياً نادراً.',
 'Socotra Island in the Gulf of Aden is geographically isolated in a way that has made it a haven for more than 825 plant species, with over 37% of them being endemic to the island. It was inscribed on the UNESCO Natural World Heritage List in 2008. The island is famous for the dragon blood tree "Dracaena cinnabari" with its distinctive mushroom-like shape, and for unique plant and animal species found nowhere else on Earth. Socotra represents natural and cultural heritage of the utmost importance, and its indigenous population carries a special unwritten Socotri language considered a rare linguistic treasure.',
 'tangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Socotra_Yemen.jpg/1280px-Socotra_Yemen.jpg',
 'سقطرى، اليمن', 'الطبيعة البكر',
 1),

(6,
 'قصر سيئون التاريخي – حضرموت',
 'Seiyun Historic Palace – Hadhramaut',
 'قصر سيئون أو "قصر المكلا" أحد أبرز نماذج العمارة الحضرمية التقليدية، بُني في القرن الثامن عشر الميلادي ليكون قصراً لسلاطين الكثيري. تميّز القصر بواجهته البيضاء الناصعة المشيّدة من الطين والجص المبيّض، ويضم أبراجاً ضخمة وقاعات فسيحة تشهد على مجد الدولة الكثيرية. حُوّل القصر لاحقاً إلى متحف يضم مقتنيات تاريخية نفيسة توثّق تاريخ حضرموت ويمن القرن الماضي، وقد أُعيد ترميمه عدة مرات للحفاظ عليه للأجيال القادمة.',
 'Seiyun Palace, also known as "Al-Mukalla Palace," is one of the most prominent examples of traditional Hadhramaut architecture, built in the 18th century AD to serve as a palace for the sultans of Kathiri. The palace is distinguished by its gleaming white facade constructed from mud and whitewashed plaster, featuring massive towers and spacious halls that bear witness to the glory of the Kathiri State. The palace was later converted into a museum housing precious historical artifacts documenting the history of Hadhramaut and Yemen over the past century, and has been restored several times to preserve it for future generations.',
 'tangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Sultan_Al_Kathiri_Palace_Seiyun.jpg/1280px-Sultan_Al_Kathiri_Palace_Seiyun.jpg',
 'سيئون، حضرموت', 'القرن 18 م',
 1),

-- ── Intangible ────────────────────────────────────────────
(7,
 'رقصة البرع – التراث الإنساني اللامادي (يونسكو)',
 'Al-Bura\'a Dance – UNESCO Intangible Cultural Heritage',
 'رقصة البرع اليمنية فنٌّ أدائي تقليدي فريد يجمع الشعر والغناء والرقص والموسيقى في آنٍ واحد. تؤدَّى الرقصة في المناسبات الاجتماعية الكبرى كالأعراس والأعياد الوطنية والاحتفالات الشعبية. يقف الراقص حاملاً جنبيته ويؤدي حركات رشيقة منسجمة مع إيقاع الطبول والمزامير. أدرجت منظمة اليونسكو رقصة البرع في قائمة التراث الثقافي غير المادي للإنسانية عام 2014م، تقديراً لقيمتها الاجتماعية والثقافية وما تحمله من دلالات السلام والتآخي بين أبناء الوطن.',
 'The Yemeni Al-Bura\'a dance is a unique traditional performing art that combines poetry, singing, dance, and music simultaneously. The dance is performed at major social occasions such as weddings, national holidays, and popular celebrations. The dancer stands holding his Janbiya dagger and performs graceful movements in harmony with the rhythm of drums and flutes. UNESCO inscribed Al-Bura\'a dance on the List of Intangible Cultural Heritage of Humanity in 2014, in recognition of its social and cultural value and the messages of peace and brotherhood it carries.',
 'intangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/1280px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg',
 'اليمن – منتشرة في كل المحافظات', 'موروث متجدد',
 1),

(8,
 'القهوة اليمنية والقشر – أصل القهوة في العالم',
 'Yemeni Coffee and Qishr – The Origin of Coffee in the World',
 'يمتلك اليمن مكانةً تاريخيةً فريدة بوصفه الموطن الأصلي لزراعة البن وصناعة القهوة في العالم. ويُعدّ الموخا أو المخا، الميناء اليمني التاريخي، أول من صدّر القهوة إلى العالم في القرن الخامس عشر الميلادي. يتميز البن اليمني بأصناف نفيسة كالمطري والحرازي والبرعي والدوائري. أما القشر فهو مشروب تقليدي فريد يُعدّ من قشور ثمرة البن المجفّفة مع البهارات ويُقدّم ساخناً. يمثّل البن والقشر اليوم موروثاً ثقافياً غذائياً يتوارثه اليمنيون جيلاً بعد جيل، ويُعرّفون به ضيوفهم تعبيراً عن الكرم والأصالة.',
 'Yemen holds a unique historical position as the original homeland of coffee cultivation and the coffee industry in the world. Mocha (Al-Mukha), the historic Yemeni port, was the first to export coffee to the world in the 15th century AD. Yemeni coffee is distinguished by prized varieties such as Mattari, Harazi, Bura\'i, and Dawa\'iri. Qishr is a unique traditional drink made from dried coffee bean husks with spices, served hot. Coffee and Qishr today represent a culinary cultural heritage passed down by Yemenis from generation to generation, introduced to guests as an expression of generosity and authenticity.',
 'intangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/A_small_cup_of_coffee.JPG/1280px-A_small_cup_of_coffee.JPG',
 'اليمن – خاصة مناطق إب وحراز وريمة', 'القرن 15 م حتى اليوم',
 1),

(9,
 'الشعر الزامل – فن شعبي يمني أصيل',
 'Al-Zamil Poetry – Authentic Yemeni Folk Art',
 'الزامل فن شعري غنائي جماعي يمني أصيل، يؤدّيه شعراء يتبادلون فيه المدح والفخر والحكمة أمام الجموع. يتميز الزامل بأنه يُنظَم ارتجالاً في الغالب، ويعتمد على البحور الشعرية الصافية والإيقاع المتدفق والصور الشعرية البليغة. يُعدّ الزامل وسيلةً تعبيريةً مميزة في المناسبات الاجتماعية اليمنية: الأفراح، وملتقيات القبائل، والمناسبات الوطنية. يحمل الزامل قيماً إنسانية سامية من الشجاعة والكرم وصون العِرض، ويُعدّ مرآةً صادقةً للشخصية اليمنية وقيمها المتجذّرة.',
 'Al-Zamil is an authentic Yemeni collective lyrical poetic art form performed by poets who exchange praise, pride, and wisdom before crowds. Al-Zamil is distinguished by being composed mostly improvised, relying on pure poetic meters, flowing rhythm, and eloquent poetic imagery. Al-Zamil is a distinctive expressive medium at Yemeni social occasions: weddings, tribal gatherings, and national events. Al-Zamil carries noble human values of courage, generosity, and honor, and is considered a true mirror of the Yemeni personality and its deeply rooted values.',
 'intangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/The_castle_above_Taiz_%288683935588%29.jpg/800px-The_castle_above_Taiz_%288683935588%29.jpg',
 'اليمن – منتشر في كل المحافظات', 'موروث ضارب في القدم',
 1),

(10,
 'الجنبية اليمنية – رمز الهوية الوطنية',
 'The Yemeni Janbiya – Symbol of National Identity',
 'الجنبية خنجر يمني تقليدي ذو حدٍّ مزدوج ومقبضٍ منحوت بعناية فائقة، تُصنَع مقابضه من قرون الغزلان أو الروك أو العظام المنقوشة. تُعدّ الجنبية رمز الهوية والرجولة والشرف في الثقافة اليمنية، ويرتديها الرجل في المناسبات الرسمية والاحتفالية. تتفاوت قيمة الجنبية تبعاً لجودة المادة المصنوعة منها ودقة الحرفية، وقد تبلغ قيمة بعض أنواعها آلاف الدولارات. توارث صنّاع الجنبية حرفتهم جيلاً بعد جيل، ويُعدّ صانع الجنبية "السمسار" شخصيةً محوريةً في المجتمع اليمني التقليدي.',
 'The Janbiya is a traditional Yemeni double-edged dagger with a carefully carved handle made from rhinoceros horn, gazelle horn, or engraved bone. The Janbiya is a symbol of identity, manhood, and honor in Yemeni culture, worn by men at official and celebratory occasions. The value of a Janbiya varies according to the quality of the material it is made from and the precision of the craftsmanship, with some types reaching thousands of dollars in value. Janbiya makers have passed their craft down from generation to generation, and the Janbiya maker "Al-Simsar" is a central figure in traditional Yemeni society.',
 'intangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg/800px-Janbiya_Dance%2C_Yemen_%2811041030075%29.jpg',
 'اليمن – تعز وصنعاء وحجة', 'آلاف السنين',
 1),

(11,
 'موسيقى الصنعاني – مقامات الروح اليمنية',
 'Sana\'ani Music – Maqamat of the Yemeni Soul',
 'الأغنية الصنعانية أو موسيقى المقامات الصنعانية من أرقى الموروثات الموسيقية في المنطقة العربية وأكثرها أصالةً وثراءً. تعتمد على مقامات موسيقية خاصة ومتميزة تختلف في أسسها النغمية عن سائر الموسيقى العربية. يُؤدّى الغناء الصنعاني في جلسات "المقيل" الشهيرة، حيث يجتمع الأصدقاء بعد الظهر في جو من الألفة والمودة. من أبرز مقاماته: الحجاز والدُّمياطي والعُشيران والصبا والنهاوند. وقد أثّرت الموسيقى الصنعانية في الموسيقى العربية والعثمانية عبر التاريخ.',
 'Sana\'ani song, or Sana\'ani maqam music, is one of the most refined and richly authentic musical heritages in the Arab region. It relies on distinctive musical maqamat that differ in their tonal foundations from other Arab music. Sana\'ani singing is performed in the famous "maqyal" sessions, where friends gather in the afternoon in an atmosphere of familiarity and affection. Among its most prominent maqamat are: Hijaz, Dumyati, Ushayran, Saba, and Nahawand. Sana\'ani music has influenced Arab and Ottoman music throughout history.',
 'intangible',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Old_City_of_Sana%27a.jpg/1280px-Old_City_of_Sana%27a.jpg',
 'صنعاء وسائر المحافظات اليمنية', 'القرن 9 م حتى اليوم',
 1);


-- ============================================================
-- 6. PARTNERS — 7 partners with logos where available
-- ============================================================
TRUNCATE TABLE `partners`;

INSERT INTO `partners`
  (`id`, `name`, `name_en`, `logo_url`, `website_url`, `sort_order`, `is_active`) VALUES

(1,
 'الهيئة العامة للآثار والمتاحف – تعز',
 'General Authority for Antiquities and Museums – Taiz',
 NULL,
 NULL,
 1, 1),

(2,
 'جامعة تعز',
 'Taiz University',
 NULL,
 'https://tu.edu.ye/',
 2, 1),

(3,
 'المركز الإسباني للبحوث العلمية (CSIC)',
 'Spanish National Research Council (CSIC)',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/CSIC_logo.svg/320px-CSIC_logo.svg.png',
 'https://www.csic.es/',
 3, 1),

(4,
 'منظمة تراث من أجل السلام',
 'Heritage for Peace',
 NULL,
 'https://www.heritageforpeace.org/',
 4, 1),

(5,
 'جامعة بريستول – المملكة المتحدة',
 'University of Bristol – United Kingdom',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/University_of_Bristol_logo.svg/400px-University_of_Bristol_logo.svg.png',
 'https://www.bristol.ac.uk/',
 5, 1),

(6,
 'منظمة اليونسكو',
 'UNESCO',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/UNESCO_logo.svg/320px-UNESCO_logo.svg.png',
 'https://www.unesco.org/',
 6, 1),

(7,
 'المجلس الدولي للمتاحف (ICOM)',
 'International Council of Museums (ICOM)',
 NULL,
 'https://icom.museum/',
 7, 1);


-- ============================================================
-- Done!
-- ============================================================
SET foreign_key_checks = 1;
SELECT 'Yemen Heritage DB seed complete ✅' AS status;
