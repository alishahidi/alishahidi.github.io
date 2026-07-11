export type ResumeLang = 'en' | 'fa';

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  skills: string[];
}

export interface ResumeEducation {
  degree: string;
  school: string;
  period: string;
  note?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
  note?: string;
}

export interface ResumeProject {
  title: string;
  description: string;
  stack: string[];
}

export interface ResumeContent {
  dir: 'ltr' | 'rtl';
  name: string;
  title: string;
  contact: {
    website: string;
    websiteUrl: string;
    email: string;
    phone: string;
    phoneDisplay: string;
    github: string;
    githubUrl: string;
    linkedin: string;
    linkedinUrl: string;
    location: string;
  };
  labels: {
    summary: string;
    experience: string;
    projects: string;
    projectsNote: string;
    education: string;
    skills: string;
    softSkills: string;
    languages: string;
    personal: string;
    skillsUsed: string;
  };
  summary: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  skillGroups: SkillGroup[];
  softSkills: string[];
  languages: string[];
  personal: string[];
}

export const resume: Record<ResumeLang, ResumeContent> = {
  en: {
    dir: 'ltr',
    name: 'Ali Shahidi',
    title: 'Backend Developer — Java & Spring Boot',
    contact: {
      website: 'alishahidi.net',
      websiteUrl: 'https://alishahidi.net',
      email: 'alishahidi1376@gmail.com',
      phone: '+989354162611',
      phoneDisplay: '+98 935 416 2611',
      github: 'github.com/alishahidi',
      githubUrl: 'https://github.com/alishahidi',
      linkedin: 'linkedin.com/in/alishahidi',
      linkedinUrl: 'https://linkedin.com/in/alishahidi',
      location: 'Tehran, Iran',
    },
    labels: {
      summary: 'Profile',
      experience: 'Experience',
      projects: 'Selected Projects',
      projectsNote: 'Private / under NDA — described at a high level, without client or product names.',
      education: 'Education',
      skills: 'Technical Skills',
      softSkills: 'Strengths',
      languages: 'Languages',
      personal: 'Personal',
      skillsUsed: 'Skills',
    },
    summary: [
      'Backend software engineer specializing in Java and Spring Boot, focused on designing and implementing distributed server-side systems, software architecture, and scalable, reliable services — with particular attention to data structures and how the components of a system communicate.',
      'I work across the full backend stack: microservices and event-driven architecture, relational and geospatial data, messaging and streaming, and the infrastructure that runs it. Stability, extensibility, and precision of design come first — my aim is to build systems that don\'t merely work, but that teams can depend on with confidence.',
    ],
    experience: [
      {
        role: 'Java Software Developer',
        company: 'Navashgaran Asr Parseh',
        period: 'Feb 2024 — Present',
        bullets: [
          'Develop, maintain, and optimize enterprise-scale backend services with Java and Spring Boot.',
          'Design and implement RESTful APIs for high-traffic production systems.',
          'Contribute to layered, service-oriented architecture design.',
          'Drive the migration of data from legacy systems to modern data structures.',
          'Collaborate closely with backend, database, and infrastructure teams.',
          'Share technical leadership through code review, technical decision-making, and mentoring of junior and mid-level developers; serve as tech lead on parts of the project.',
          'Prioritize scalability, stability, and maintainability across production systems.',
        ],
        skills: ['Java', 'Spring Boot', 'Backend Architecture', 'Data Migration'],
      },
      {
        role: 'Backend Developer (Intern)',
        company: 'Neshan Maps',
        period: 'Aug 2023 — Sep 2023',
        bullets: [
          'Joined the backend team as a formal intern, contributing to backend services for live product features.',
          'Gained hands-on experience with microservices architecture.',
          'Implemented caching and data management with Redis.',
          'Completed Neshan\'s specialized backend bootcamp, adopting professional development workflows and production practices.',
        ],
        skills: ['Backend Development', 'Redis', 'Microservices', 'REST API', 'Git'],
      },
      {
        role: 'Software Developer (Frontend Focus)',
        company: 'LaunchingMax',
        period: 'Feb 2023 — Jul 2023',
        bullets: [
          'Built user interfaces for organizational web applications with React.js and HTML5.',
          'Implemented web pages and integrated them with backend APIs.',
          'Collaborated closely with the backend team in a team-oriented environment.',
          'Enhanced UI/UX and contributed to the product development process in a company setting.',
        ],
        skills: ['React.js', 'HTML5', 'JavaScript', 'Frontend Development', 'Teamwork'],
      },
      {
        role: 'PHP Developer',
        company: 'Freelance',
        period: 'Jul 2019 — Feb 2023',
        bullets: [
          'Developed web applications and backend systems with PHP and Laravel.',
          'Designed and implemented backend logic and database interactions.',
          'Applied MVC architecture to build modular, maintainable components.',
          'Built user interfaces with HTML, CSS, and Bootstrap alongside the backend.',
          'Designed and implemented Apantos, a custom PHP framework focused on security, modularity, and ease of development.',
          'Delivered independent projects end to end — from requirements analysis through implementation to final delivery.',
        ],
        skills: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'System Design', 'MVC'],
      },
    ],
    projects: [
      {
        title: 'Enterprise Backend Framework & Code-Generation Platform',
        description:
          'A modular Spring Boot framework and CLI code generator that scaffolds production-ready services with security, persistence, caching, messaging, workflow, and observability wired in — a shared foundation that accelerates delivery across teams.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud', 'Multi-module Maven (BOM + 20+ modules)', 'OAuth2 / OIDC', 'Redis', 'RabbitMQ', 'Resilience4j', 'Camunda'],
      },
      {
        title: 'Real-Time Fleet GPS Tracking & Navigation Platform',
        description:
          'Real-time ingestion of vehicle telemetry over TCP/UDP with live position streaming to interactive maps, geofencing, rules-based alerting, and trip analytics for managing large fleets.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud Gateway', 'Netty', 'PostgreSQL / PostGIS', 'RabbitMQ', 'Redis', 'WebSocket', 'MinIO', 'React / Next.js', 'MapLibre'],
      },
      {
        title: 'Visual Content Design Studio (Canvas Editor)',
        description:
          'A browser-based design studio (Canva/Figma-style) for composing social posts, stories, and menu layouts from reusable widgets, with a server-side render/export pipeline and multi-channel publishing on a contract-first microservices platform.',
        stack: ['Java 21', 'Spring Boot', 'OpenAPI / gRPC (contract-first)', 'Apache Kafka (Outbox / Saga)', 'PostgreSQL (db-per-service)', 'ClickHouse', 'Elasticsearch', 'Kubernetes / Helm', 'Next.js'],
      },
      {
        title: 'Multi-Channel Social-Media Management & Analytics Platform',
        description:
          'A multi-tenant platform that unifies inbound conversations across channels, with scheduled publishing, rule-driven automation, and engagement/sentiment analytics over high-volume message data.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud Gateway', 'PostgreSQL / PostGIS', 'ScyllaDB', 'Redis', 'RabbitMQ', 'Camunda BPM', 'Python / FastAPI', 'React'],
      },
      {
        title: 'Online Learning / Academy Platform',
        description:
          'An event-driven e-learning platform with course catalog, enrollment, payments, verifiable certificates, and CMS-managed content across dedicated user, catalog, commerce, content, media, and notification services.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud (Eureka, Config, Gateway)', 'PostgreSQL', 'RabbitMQ', 'MinIO', 'JWT / RBAC', 'Docker'],
      },
      {
        title: 'E-commerce Platform (Specialty Retail)',
        description:
          'A production e-commerce backend built as Spring Boot microservices behind an API gateway, serving a customer storefront, a self-service panel, and an administrative back office.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud (Eureka, Config, Gateway)', 'PostgreSQL', 'RabbitMQ', 'Redis', 'MinIO'],
      },
      {
        title: 'Zero-Trust Internal Network Access Gateway',
        description:
          'A split-tunnel, least-privilege access gateway that exposes only explicitly granted internal services at stable virtual addresses, with a reconcile loop that renders WireGuard peers, NAT/firewall rules, and DNS zones from database state.',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'WireGuard', 'nftables', 'CoreDNS', 'JWT', 'Docker', 'React', 'Electron'],
      },
      {
        title: 'Assistive Hands-Free Interaction System (IoT + Computer Vision)',
        description:
          'A privacy-first assistive system that fuses head-motion (IMU) and webcam eye/gaze tracking into calibrated input events, enabling hands-free computer and smart-home control for people with limited mobility.',
        stack: ['Python', 'MQTT', 'OpenCV', 'MediaPipe', 'NumPy', 'PySerial', 'Arduino / C++ (BNO085 IMU)', 'Event-driven services'],
      },
    ],
    education: [
      {
        degree: 'B.Sc. Computer Engineering',
        school: 'Islamic Azad University, Tehran',
        period: '2025 — Present',
      },
      {
        degree: 'B.Sc. Computer Engineering',
        school: 'Khayyam University, Mashhad',
        period: '2022 — 2025',
        note: 'Withdrew after relocating to Tehran.',
      },
    ],
    skillGroups: [
      {
        label: 'Languages',
        items: ['Java', 'SQL', 'TypeScript / JavaScript', 'PHP', 'Python'],
      },
      {
        label: 'Backend & Frameworks',
        items: ['Spring Boot', 'Spring Cloud', 'Hibernate / JPA', 'REST & gRPC APIs', 'WebSocket', 'Netty', 'Laravel'],
      },
      {
        label: 'Concurrency & Performance',
        items: [
          'Multithreading & concurrency',
          'JVM performance tuning',
          'Garbage collection',
          'Caching (Redis / Redisson)',
          'Connection pooling',
          'Resilience4j',
        ],
        note: 'Building thread-safe, high-throughput services and profiling them under production load.',
      },
      {
        label: 'Architecture & Design',
        items: [
          'Microservices',
          'API gateway',
          'Event-driven (Outbox / Saga)',
          'Domain-driven design',
          'Database-per-service',
          'System design',
          'Design patterns',
          'Data migration',
        ],
      },
      {
        label: 'Databases & Geospatial',
        items: ['PostgreSQL', 'PostGIS', 'Oracle DB', 'PL/SQL', 'MySQL', 'Redis', 'ScyllaDB / Cassandra', 'Elasticsearch', 'ClickHouse', 'GPS navigation'],
      },
      {
        label: 'Messaging & Streaming',
        items: ['RabbitMQ', 'Apache Kafka', 'MQTT', 'WebSocket / STOMP'],
      },
      {
        label: 'DevOps & Infrastructure',
        items: ['Linux', 'Docker', 'Kubernetes (Helm / Argo CD)', 'CI/CD (Jenkins)', 'Git', 'MikroTik networking', 'Proxmox / ESXi', 'MinIO / object storage', 'Observability (Prometheus / Zipkin)'],
        note: 'Linux as the primary environment — plus on-prem server provisioning, MikroTik networking, and Proxmox/ESXi virtualization.',
      },
      {
        label: 'Practices & Tooling',
        items: ['Unit & integration testing (JUnit, Testcontainers)', 'Code review', 'Prompt engineering', 'LLM-assisted development'],
      },
    ],
    softSkills: [
      'Problem solving',
      'Analytical thinking',
      'Ownership & accountability',
      'Effective teamwork',
      'Composure under pressure',
      'Focus in demanding conditions',
    ],
    languages: ['Persian (native)', 'English (intermediate)'],
    personal: [
      'Born 2004',
      'Based in Tehran',
      'Military service: educational exemption',
      'Single',
    ],
  },

  fa: {
    dir: 'rtl',
    name: 'علی شهیدی',
    title: 'توسعه‌دهنده بک‌اند — Java و Spring Boot',
    contact: {
      website: 'alishahidi.net',
      websiteUrl: 'https://alishahidi.net',
      email: 'alishahidi1376@gmail.com',
      phone: '+989354162611',
      phoneDisplay: '+98 935 416 2611',
      github: 'github.com/alishahidi',
      githubUrl: 'https://github.com/alishahidi',
      linkedin: 'linkedin.com/in/alishahidi',
      linkedinUrl: 'https://linkedin.com/in/alishahidi',
      location: 'تهران، ایران',
    },
    labels: {
      summary: 'درباره من',
      experience: 'تجربه‌های کاری',
      projects: 'پروژه‌های منتخب',
      projectsNote: 'خصوصی / تحت عدم‌افشا — بدون ذکر نام کارفرما یا محصول و در سطح کلی توضیح داده شده‌اند.',
      education: 'سوابق تحصیلی',
      skills: 'مهارت‌های فنی',
      softSkills: 'نقاط قوت',
      languages: 'زبان‌ها',
      personal: 'اطلاعات شخصی',
      skillsUsed: 'مهارت‌ها',
    },
    summary: [
      'مهندس نرم‌افزار بک‌اند با تخصص در Java و Spring Boot؛ متمرکز بر طراحی و پیاده‌سازی سیستم‌های توزیع‌شدهٔ سمت سرور، معماری نرم‌افزار و ساخت سرویس‌های مقیاس‌پذیر و قابل‌اعتماد، با توجه ویژه به ساختارهای داده و نحوه‌ی ارتباط اجزای مختلف سیستم.',
      'در سراسر لایه‌های بک‌اند کار می‌کنم: میکروسرویس و معماری رویدادمحور، دادهٔ رابطه‌ای و مکان‌محور، پیام‌رسانی و استریمینگ، و زیرساختی که آن‌ها را اجرا می‌کند. پایداری، قابلیت توسعه و دقت در طراحی در اولویت نخست‌اند — هدفم ساختن سیستم‌هایی است که نه‌فقط کار کنند، بلکه بتوان با اطمینان به آن‌ها تکیه کرد.',
    ],
    experience: [
      {
        role: 'توسعه‌دهنده نرم‌افزار جاوا (Java Software Developer)',
        company: 'ناوشگران عصر پارسه',
        period: 'بهمن ۱۴۰۲ تا اکنون',
        bullets: [
          'توسعه، نگهداری و بهینه‌سازی سرویس‌های بک‌اند در مقیاس سازمانی با Java و Spring Boot.',
          'طراحی و پیاده‌سازی APIهای RESTful برای سیستم‌های پرترافیک در محیط Production.',
          'مشارکت در طراحی معماری لایه‌ای و سرویس‌محور.',
          'راهبری مهاجرت داده از سیستم‌های Legacy به ساختارهای داده‌ی مدرن.',
          'همکاری نزدیک با تیم‌های بک‌اند، پایگاه‌داده و زیرساخت.',
          'مشارکت در راهبری فنی از طریق Code Review، تصمیم‌گیری‌های فنی و منتورینگ توسعه‌دهندگان junior و mid-level؛ ایفای نقش Tech Lead در بخش‌هایی از پروژه.',
          'اولویت‌دادن به مقیاس‌پذیری، پایداری و قابلیت نگهداری در سراسر سیستم‌های Production.',
        ],
        skills: ['Java', 'Spring Boot', 'Backend Architecture', 'Data Migration'],
      },
      {
        role: 'توسعه‌دهنده بک‌اند (کارآموز)',
        company: 'Neshan Maps',
        period: 'مرداد ۱۴۰۲ تا شهریور ۱۴۰۲',
        bullets: [
          'فعالیت در تیم بک‌اند در قالب کارآموزی رسمی و مشارکت در توسعه‌ی سرویس‌های بک‌اند برای قابلیت‌های واقعی محصول.',
          'کسب تجربه‌ی عملی با معماری Microservices.',
          'پیاده‌سازی کش و مدیریت داده با Redis.',
          'گذراندن بوت‌کمپ تخصصی بک‌اند نشان و به‌کارگیری فرآیندهای حرفه‌ای توسعه و شیوه‌های محیط Production.',
        ],
        skills: ['Backend Development', 'Redis', 'Microservices', 'REST API', 'Git'],
      },
      {
        role: 'توسعه‌دهنده نرم‌افزار (Software Developer — Frontend Focus)',
        company: 'LaunchingMax',
        period: 'بهمن ۱۴۰۱ تا تیر ۱۴۰۲',
        bullets: [
          'توسعه‌ی رابط کاربری وب‌اپلیکیشن‌های سازمانی با React.js و HTML5.',
          'پیاده‌سازی صفحات وب و یکپارچه‌سازی آن‌ها با APIهای بک‌اند.',
          'همکاری نزدیک با تیم بک‌اند در محیطی تیمی.',
          'بهبود تجربه و رابط کاربری (UI/UX) و مشارکت در فرآیند توسعه‌ی محصول در ساختار شرکتی.',
        ],
        skills: ['React.js', 'HTML5', 'JavaScript', 'Frontend Development', 'کار تیمی'],
      },
      {
        role: 'توسعه‌دهنده PHP (PHP Developer)',
        company: 'فریلنسر',
        period: 'تیر ۱۳۹۸ تا بهمن ۱۴۰۱',
        bullets: [
          'توسعه‌ی وب‌اپلیکیشن‌ها و سیستم‌های بک‌اند با PHP و Laravel.',
          'طراحی و پیاده‌سازی منطق بک‌اند و تعامل با پایگاه‌داده.',
          'به‌کارگیری معماری MVC برای ساخت ماژول‌های قابل‌توسعه و قابل‌نگهداری.',
          'توسعه‌ی رابط کاربری با HTML، CSS و Bootstrap در کنار بک‌اند.',
          'طراحی و پیاده‌سازی فریم‌ورک اختصاصی PHP با نام Apantos، متمرکز بر امنیت، ماژولار بودن و سادگی توسعه.',
          'انجام پروژه‌های مستقل به‌صورت سرتاسری — از تحلیل نیازمندی‌ها تا پیاده‌سازی و تحویل نهایی.',
        ],
        skills: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'طراحی سیستم', 'معماری MVC'],
      },
    ],
    projects: [
      {
        title: 'فریم‌ورک بک‌اند سازمانی و پلتفرم تولید کد',
        description:
          'فریم‌ورک ماژولار مبتنی بر Spring Boot به‌همراه ابزار CLI تولید کد که سرویس‌های آمادهٔ Production را با امنیت، پایداری داده، کش، پیام‌رسانی، workflow و مشاهده‌پذیریِ از پیش‌آماده می‌سازد؛ بنیانی مشترک برای تسریع توسعه در تیم‌ها.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud', 'Maven چندماژولی (BOM + ۲۰+ ماژول)', 'OAuth2 / OIDC', 'Redis', 'RabbitMQ', 'Resilience4j', 'Camunda'],
      },
      {
        title: 'پلتفرم بلادرنگ ردیابی GPS و ناوبری ناوگان',
        description:
          'دریافت بلادرنگ داده‌های تله‌متری خودرو روی TCP/UDP، پخش زندهٔ موقعیت روی نقشهٔ تعاملی، geofencing، هشداردهی مبتنی بر قواعد و تحلیل سفر برای مدیریت ناوگان‌های بزرگ.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud Gateway', 'Netty', 'PostgreSQL / PostGIS', 'RabbitMQ', 'Redis', 'WebSocket', 'MinIO', 'React / Next.js', 'MapLibre'],
      },
      {
        title: 'استودیوی طراحی محتوای بصری (ویرایشگر بوم)',
        description:
          'استودیوی طراحی مبتنی بر وب (به سبک Canva/Figma) برای ساخت پست، استوری و منو از ویجت‌های قابل‌استفادهٔ مجدد، با خط‌لولهٔ رندر/خروجی سمت سرور و انتشار چندکاناله روی پلتفرم میکروسرویسِ قرارداد-محور.',
        stack: ['Java 21', 'Spring Boot', 'OpenAPI / gRPC (قرارداد-محور)', 'Apache Kafka (Outbox / Saga)', 'PostgreSQL (پایگاه‌داده به‌ازای هر سرویس)', 'ClickHouse', 'Elasticsearch', 'Kubernetes / Helm', 'Next.js'],
      },
      {
        title: 'پلتفرم مدیریت و تحلیل چندکانالهٔ شبکه‌های اجتماعی',
        description:
          'پلتفرم چنداجاره‌ای که مکالمات ورودی از کانال‌های مختلف را یکپارچه می‌کند؛ به‌همراه انتشار زمان‌بندی‌شده، اتوماسیون مبتنی بر قواعد و تحلیل تعامل/احساسات روی داده‌های پرحجم پیام.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud Gateway', 'PostgreSQL / PostGIS', 'ScyllaDB', 'Redis', 'RabbitMQ', 'Camunda BPM', 'Python / FastAPI', 'React'],
      },
      {
        title: 'پلتفرم آموزش آنلاین (آکادمی)',
        description:
          'پلتفرم رویدادمحور آموزش آنلاین با کاتالوگ دوره، ثبت‌نام، پرداخت، صدور گواهیِ قابل‌راستی‌آزمایی و مدیریت محتوا در سرویس‌های دامنه‌ای مجزا.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud (Eureka، Config، Gateway)', 'PostgreSQL', 'RabbitMQ', 'MinIO', 'JWT / RBAC', 'Docker'],
      },
      {
        title: 'پلتفرم فروشگاهی (خرده‌فروشی تخصصی)',
        description:
          'بک‌اند فروشگاهی در مقیاس Production به‌صورت میکروسرویس‌های Spring Boot پشت API Gateway — ویترین فروشگاه، پنل خودخدمتِ مشتری و بخش مدیریت.',
        stack: ['Java 21', 'Spring Boot', 'Spring Cloud (Eureka، Config، Gateway)', 'PostgreSQL', 'RabbitMQ', 'Redis', 'MinIO'],
      },
      {
        title: 'دروازهٔ دسترسی امن به شبکهٔ داخلی (Zero-Trust)',
        description:
          'دروازهٔ دسترسی با کمینه‌دسترسی که تنها سرویس‌های داخلیِ صریحاً مجازشده را در آدرس‌های مجازیِ پایدار در دسترس می‌گذارد؛ با حلقهٔ reconcile که peerهای WireGuard، قواعد NAT/فایروال و DNS را از وضعیت پایگاه‌داده می‌سازد.',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'WireGuard', 'nftables', 'CoreDNS', 'JWT', 'Docker', 'React', 'Electron'],
      },
      {
        title: 'سیستم تعامل بدون‌دستِ کمک‌رسان (IoT + بینایی ماشین)',
        description:
          'سیستم کمک‌رسانِ حریم‌خصوصی‌محور که حرکت سر (IMU) و ردیابی چشم/نگاه با وب‌کم را به رویدادهای ورودیِ کالیبره‌شده تبدیل می‌کند و کنترل بدون‌دستِ رایانه و خانهٔ هوشمند را برای افراد با تحرک محدود ممکن می‌سازد.',
        stack: ['Python', 'MQTT', 'OpenCV', 'MediaPipe', 'NumPy', 'PySerial', 'Arduino / C++ (IMU BNO085)', 'معماری رویدادمحور'],
      },
    ],
    education: [
      {
        degree: 'مهندسی کامپیوتر (کارشناسی)',
        school: 'دانشگاه آزاد اسلامی، تهران',
        period: '۱۴۰۴ — در حال تحصیل',
      },
      {
        degree: 'مهندسی کامپیوتر (کارشناسی)',
        school: 'دانشگاه خیام مشهد',
        period: '۱۴۰۱ تا ۱۴۰۴',
        note: 'انصراف از تحصیل به دلیل مهاجرت به تهران.',
      },
    ],
    skillGroups: [
      {
        label: 'زبان‌ها',
        items: ['Java', 'SQL', 'TypeScript / JavaScript', 'PHP', 'Python'],
      },
      {
        label: 'بک‌اند و فریم‌ورک‌ها',
        items: ['Spring Boot', 'Spring Cloud', 'Hibernate / JPA', 'REST و gRPC', 'WebSocket', 'Netty', 'Laravel'],
      },
      {
        label: 'همزمانی و کارایی',
        items: [
          'Multithreading و همزمانی',
          'بهینه‌سازی JVM',
          'Garbage Collection',
          'کش (Redis / Redisson)',
          'Connection Pooling',
          'Resilience4j',
        ],
        note: 'ساخت سرویس‌های thread-safe و پرتراکنش و پروفایلینگ آن‌ها زیر بار محیط Production.',
      },
      {
        label: 'معماری و طراحی',
        items: [
          'Microservices',
          'API Gateway',
          'رویدادمحور (Outbox / Saga)',
          'Domain-Driven Design',
          'پایگاه‌داده به‌ازای هر سرویس',
          'طراحی سیستم',
          'الگوهای طراحی',
          'مهاجرت داده',
        ],
      },
      {
        label: 'پایگاه‌داده و مکان‌محور',
        items: ['PostgreSQL', 'PostGIS', 'Oracle DB', 'PL/SQL', 'MySQL', 'Redis', 'ScyllaDB / Cassandra', 'Elasticsearch', 'ClickHouse', 'GPS Navigation'],
      },
      {
        label: 'پیام‌رسانی و استریمینگ',
        items: ['RabbitMQ', 'Apache Kafka', 'MQTT', 'WebSocket / STOMP'],
      },
      {
        label: 'DevOps و زیرساخت',
        items: ['Linux', 'Docker', 'Kubernetes (Helm / Argo CD)', 'CI/CD (Jenkins)', 'Git', 'شبکه‌سازی MikroTik', 'Proxmox / ESXi', 'MinIO / ذخیره‌سازی شیء', 'مشاهده‌پذیری (Prometheus / Zipkin)'],
        note: 'Linux به‌عنوان محیط اصلی کار — به‌همراه راه‌اندازی سرورهای On-Prem، شبکه‌سازی با MikroTik و مجازی‌سازی Proxmox/ESXi.',
      },
      {
        label: 'شیوه‌ها و ابزار',
        items: ['تست واحد و یکپارچگی (JUnit، Testcontainers)', 'Code Review', 'Prompt Engineering', 'توسعه به کمک LLM'],
      },
    ],
    softSkills: [
      'حل مسئله',
      'تفکر تحلیلی',
      'مسئولیت‌پذیری و پاسخ‌گویی',
      'کار تیمی مؤثر',
      'حفظ آرامش زیر فشار',
      'تمرکز در شرایط دشوار',
    ],
    languages: ['فارسی (زبان مادری)', 'انگلیسی (متوسط)'],
    personal: [
      'سال تولد: ۱۳۸۳',
      'ساکن تهران',
      'وضعیت سربازی: معافیت تحصیلی',
      'وضعیت تأهل: مجرد',
    ],
  },
};

export const resumePdfPaths: Record<ResumeLang, string> = {
  en: '/resume/Ali-Shahidi-Resume-EN.pdf',
  fa: '/resume/Ali-Shahidi-Resume-FA.pdf',
};
