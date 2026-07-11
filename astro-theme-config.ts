type NavItem = {
  label: string;
  href: string;
};

type LearningItem = {
  slug: string;
  title: string;
  description: string;
  url: string;
  /** Optional group heading on /learning (e.g. 'Finance'). */
  tag?: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Tone theme.
 * Most site-level customization should happen in this file.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://example.com',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '',
    lang: 'en',
    locale: 'en_US',
    dateLocale: 'en-US',
    title: 'Rex Space',
    logoLabel: 'Home',
    description: 'A minimal Astro theme for posts and notes.',
    author: 'Rex Zhang',
    /** Optional absolute or root-relative image URL for homepage/search/about social previews. */
    defaultOgImage: '/og.png',
  },

  // The logo already links to `/`. Add items here if you want visible header links.
  // Example: [{ label: 'Posts', href: '/posts' }, { label: 'About', href: '/about' }]
  nav: [
    { label: 'Posts', href: '/posts' },
    { label: 'Learning', href: '/learning' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Posts', href: '/posts' },
    { label: 'Learning', href: '/learning' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  content: {
    categoryOrder: [
      'Design',
      'Getting Started',
      'Markdown',
      'Open Source',
      'Systems',
      'Notes',
      'Research',
      'Performance',
      'MDX',
    ],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  social: {
    website: '', // e.g. 'https://your-site.com'
    email: 'zhayunduor@hotmail.com',
    linkedin: 'https://www.linkedin.com/in/yunduo-zhang-92974799/',
    github: 'https://github.com/Gitrexx', // add when you have a public profile to link
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '/profile.png',
    name: 'Zhang Yunduo',
    role: 'Machine Learning Engineer',
    location: 'Singapore',
    focus: 'AI/ML from prototype to production',
    tags: [
      'MLOps',
      'Prototype → Production',
      'RAG & Semantic Search',
      'Agentic AI',
      'Recommender Systems',
      'LLM Fine-tuning',
      'Microservices & Kubernetes',
      'Big-data pipelines (PySpark, Kafka, SparkSQL)',
      'Cloud-native · AWS · GCP · OpenShift',
      'Financial services / banking domain',
      'KYC / compliance / regulated ML',
      'AWS Solutions Architect',
      'GCP Professional ML Engineer',
    ],
    headline: ['ML Practitioner'],

    statementLabel: 'Summary',
    statementTitle: 'Owning the full delivery lifecycle.',
    statement:
      'Machine Learning Engineer with 8+ years of experience embedding with business and data teams to take AI/ML solutions from prototype to production. Proven track record partnering directly with stakeholders across multiple business units — translating ambiguous requirements into deployed, production-grade systems, including large-scale recommender systems, semantic search / RAG, agentic AI applications, and model fine-tuning, as well as scalable microservices and full-stack web applications. Owns the full delivery lifecycle: discovery, build, integration with legacy data and infrastructure, roll-out, and production hardening. Strong background in cloud-native architectures (AWS, OpenShift), distributed data pipelines, and end-to-end ML lifecycle management. Certified AWS Solutions Architect and GCP Professional ML Engineer.',
    experienceLabel: 'Experience',
    experience: [
      {
        period: 'May 2022 — Present',
        title: 'Machine Learning Engineer (MLOps)',
        company: 'DBS Bank, Singapore',
        highlights: [
          'Data Understanding Assistant — embedded with the data engineering org to ship a full-stack lineage-tracing platform (React + FastAPI) with an embedded chatbot, grounded via a custom FastMCP server unifying the department KB (Dify) and metadata DB.',
          'KYC Name Screening — moved name-screening models from prototype to scalable API microservices serving daily RM onboarding; cut GenAI latency 90% and infra cost 60%, and stood up OpenTelemetry / ELK / Prometheus / Grafana observability (−40% detection time, −35% MTTR).',
          'Smart Search — led an enterprise semantic-search platform (RAG + function calling) serving 1M+ requests monthly, with a blue-green ingestion pipeline and an LLM-agnostic agent framework.',
          'Recommender System — operationalised 300+ consumer-banking models serving 1M+ users in SG and HK on MLflow; cut PySpark job runtime from 30+ hours to 5 via Airflow orchestration.',
          'Built an OCR pipeline saving 50K+ SGD monthly in labour, and migrated ML workloads from on-premise to AWS SageMaker.',
        ],
      },
      {
        period: 'Dec 2021 — May 2022',
        title: 'Software Engineer',
        company: 'SP Group, Singapore',
        highlights: [
          'Built and optimised an end-to-end disaster-recovery data pipeline (EMC SOAP ingestion, SQL/Python processing) with real-time Power BI dashboards informing 10K+ SGD of daily decisions.',
          'Developed a locally hosted AI search app (SVM, Sentence-BERT) that halved root-cause analysis time for maintenance teams.',
        ],
      },
      {
        period: 'Jun 2017 — Jun 2021',
        title: 'Senior Data Analyst',
        company: 'United Microelectronics Corporation',
        highlights: [
          'Applied clustering, time-series analysis, and anomaly detection to machine data for predictive maintenance, cutting average machine downtime by 8%.',
          'Maintained lithography equipment (ASML AT/XT/NXT, Nikon steppers) from sensor data and delivered maintenance insights to management.',
          'Trained and mentored 10+ newly hired equipment engineers.',
        ],
      },
    ],

    educationLabel: 'Education',
    education: [
      {
        period: '2021 — 2022',
        title: 'M.Tech, Artificial Intelligence Systems',
        school: 'National University of Singapore',
        note: 'Course recommender system; stock-movement sentiment analysis on StockTweets (RoBERTa fine-tuning, open-source model/dataset contribution).',
      },
      {
        period: '2013 — 2017',
        title: 'B.Eng, Electrical & Electronic Engineering',
        school: 'Nanyang Technological University',
        note: 'Auto-focus camera prototype (Arduino, IoT); voice-controlled robot with speaker localisation (Raspberry Pi, speech recognition). SM2 full scholarship.',
      },
    ],

    skillsLabel: 'Skills',
    skillsHeading: 'What I build with.',
    skills: [
      {
        group: 'ML / AI',
        items: 'RAG, agentic AI, recommender systems, semantic search, model fine-tuning, MLflow, ONNX',
      },
      {
        group: 'Backend',
        items: 'Python, FastAPI, microservices, async, Kafka, MCP / FastMCP',
      },
      {
        group: 'Data',
        items: 'PySpark, Airflow, SparkSQL, Elasticsearch, distributed pipelines',
      },
      {
        group: 'Platform',
        items: 'AWS, OpenShift / Kubernetes, containerisation, OpenTelemetry, ELK, Prometheus, Grafana, Jenkins',
      },
      {
        group: 'Frontend',
        items: 'React, full-stack web applications',
      },
    ],

    awardsLabel: 'Recognition',
    awardsHeading: 'Certifications and awards.',
    awards: [
      'Google Cloud — Professional Machine Learning Engineer',
      'AWS — Certified Solutions Architect, Associate',
      'DBS Department Machine Learning Engineer of the Year, 2023',
      'SM2 full scholarship for undergraduate study at NTU',
    ],

    languagesLabel: 'Languages',
    languages: 'English (professional) · Chinese (native)',
  },

  /**
   * The `/learning` page — a searchable card directory. Each item is a small
   * standalone site I keep elsewhere (usually a GitHub Pages repo) and embed as
   * an iframe on its own detail page at `/learning/<slug>`. Add a new object to
   * `items` to surface another topic — it appears as a card, grouped by `tag`.
   *
   * Per item:
   *   slug        stable id → the URL path segment `/learning/<slug>` (kebab-case)
   *   title       shown on the card and above the frame
   *   description one short line under the title (also searched)
   *   tag         optional group heading on /learning (e.g. 'Finance'); also searched
   *   url         the embedded site (must allow framing — GitHub Pages does)
   */
  learning: {
    eyebrow: 'Learning',
    title: 'What I am learning',
    intro:
      'Living notebooks I keep as small standalone sites and embed here. Open a topic to read it embedded on its own page, or launch it in its own tab.',
    items: [
      {
        slug: 'investment',
        title: 'Daily Learning — Investment',
        description: '100+ Topics daily notes on investment, from theory to practice',
        tag: 'Finance',
        url: 'https://gitrexx.github.io/daily-learning-investment/',
      },
    ] as LearningItem[],
  },
};

export default config;
