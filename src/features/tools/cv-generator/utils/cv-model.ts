import type { Locale } from '../../../../content/translations'
import { cvThemePresets } from './cv-design'
import { type CvFontId, cvFontRegistry, defaultFontForLocale, getCssFontFamily } from './cv-fonts'

export type CvTemplate = 'modern' | 'classic' | 'minimal'
export type CvFontFamily = CvFontId

export type CvProfile = {
  network: string
  url: string
}

export type CvBasics = {
  name: string
  label: string
  email: string
  phone: string
  url: string
  location: {
    address: string
  }
  summary: string
  profiles: CvProfile[]
}

export type CvWorkItem = {
  name: string
  position: string
  startDate: string
  endDate: string
  url: string
  summary: string
  highlights: string[]
}

export type CvEducationItem = {
  institution: string
  studyType: string
  area: string
  score: string
  startDate: string
  endDate: string
  url: string
  courses: string[]
}

export type CvSkillItem = {
  name: string
  level: string
  keywords: string[]
}

export type CvLanguageItem = {
  language: string
  fluency: string
  certificate?: string
}

export type CvProjectItem = {
  name: string
  description: string
  startDate: string
  endDate: string
  url: string
  highlights: string[]
}

export type CvResumeMeta = {
  template: CvTemplate
  themeColor: string
  fontFamily: CvFontFamily
  locale: Locale
  version: string
  lastModified: string
}

export type CvResume = {
  basics: CvBasics
  work: CvWorkItem[]
  education: CvEducationItem[]
  skills: CvSkillItem[]
  languages: CvLanguageItem[]
  projects: CvProjectItem[]
  meta: CvResumeMeta
}

export const cvThemeColorPresets = [
  cvThemePresets.blue,
  cvThemePresets.green,
  cvThemePresets.red,
  cvThemePresets.black,
  cvThemePresets.gray,
]

export const cvFontFamilyMap: Record<string, string> = Object.fromEntries(
  Object.keys(cvFontRegistry).map((id) => [id, getCssFontFamily(id as CvFontId)])
)

export const createProfileItem = (): CvProfile => ({
  network: '',
  url: '',
})

export const createWorkItem = (): CvWorkItem => ({
  name: '',
  position: '',
  startDate: '',
  endDate: '',
  url: '',
  summary: '',
  highlights: [''],
})

export const createEducationItem = (): CvEducationItem => ({
  institution: '',
  studyType: '',
  area: '',
  score: '',
  startDate: '',
  endDate: '',
  url: '',
  courses: [''],
})

export const createSkillItem = (): CvSkillItem => ({
  name: '',
  level: '',
  keywords: [''],
})

export const createLanguageItem = (): CvLanguageItem => ({
  language: '',
  fluency: '',
  certificate: '',
})

export const createProjectItem = (): CvProjectItem => ({
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  url: '',
  highlights: [''],
})

export const createEmptyResume = (locale: Locale): CvResume => ({
  basics: {
    name: '',
    label: '',
    email: '',
    phone: '',
    url: '',
    location: {
      address: '',
    },
    summary: '',
    profiles: [
      createProfileItem(),
    ],
  },
  work: [createWorkItem()],
  education: [createEducationItem()],
  skills: [createSkillItem()],
  languages: [createLanguageItem()],
  projects: [createProjectItem()],
  meta: {
    template: 'modern',
    themeColor: '#2563eb',
    fontFamily: 'inter',
    locale,
    version: 'https://jsonresume.org/schema/',
    lastModified: new Date().toISOString(),
  },
})

const stringOrEmpty = (value: unknown): string => (typeof value === 'string' ? value : '')

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return ['']
  }

  const strings = value.map((entry) => stringOrEmpty(entry)).filter((entry) => entry.length > 0)
  return strings.length > 0 ? strings : ['']
}

const normalizeProfiles = (value: unknown): CvProfile[] => {
  if (!Array.isArray(value)) {
    return [{ network: '', url: '' }]
  }

  const profiles = value
    .map((entry) => {
      const item = typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
      return {
        network: stringOrEmpty(item.network),
        url: stringOrEmpty(item.url),
      }
    })
    .filter((profile) => profile.network || profile.url)

  return profiles.length > 0 ? profiles : [{ network: '', url: '' }]
}

const normalizeTemplate = (value: unknown): CvTemplate => {
  if (value === 'classic' || value === 'minimal') {
    return value
  }

  return 'modern'
}

const validFontFamilies: CvFontFamily[] = ['inter', 'roboto', 'open-sans', 'noto-sans', 'be-vietnam-pro']

const normalizeFontFamily = (value: unknown): CvFontFamily => {
  if (typeof value === 'string' && validFontFamilies.includes(value as CvFontFamily)) {
    return value as CvFontFamily
  }

  // Legacy migration: 'serif' → 'inter'
  return 'inter'
}

const normalizeDate = (value: unknown): string => stringOrEmpty(value)

const normalizeWork = (value: unknown): CvWorkItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptyResume('en').work
  }

  return value.map((entry) => {
    const item = typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
    return {
      name: stringOrEmpty(item.name),
      position: stringOrEmpty(item.position),
      startDate: normalizeDate(item.startDate),
      endDate: normalizeDate(item.endDate),
      url: stringOrEmpty(item.url),
      summary: stringOrEmpty(item.summary),
      highlights: normalizeStringArray(item.highlights),
    }
  })
}

const normalizeEducation = (value: unknown): CvEducationItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptyResume('en').education
  }

  return value.map((entry) => {
    const item = typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
    return {
      institution: stringOrEmpty(item.institution),
      studyType: stringOrEmpty(item.studyType),
      area: stringOrEmpty(item.area),
      score: stringOrEmpty(item.score),
      startDate: normalizeDate(item.startDate),
      endDate: normalizeDate(item.endDate),
      url: stringOrEmpty(item.url),
      courses: normalizeStringArray(item.courses),
    }
  })
}

const normalizeSkills = (value: unknown): CvSkillItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptyResume('en').skills
  }

  return value.map((entry) => {
    const item = typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
    return {
      name: stringOrEmpty(item.name),
      level: stringOrEmpty(item.level),
      keywords: normalizeStringArray(item.keywords),
    }
  })
}

const normalizeLanguages = (value: unknown): CvLanguageItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptyResume('en').languages
  }

  return value.map((entry) => {
    const item = typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
    return {
      language: stringOrEmpty(item.language),
      fluency: stringOrEmpty(item.fluency),
      certificate: stringOrEmpty(item.certificate),
    }
  })
}

const normalizeProjects = (value: unknown): CvProjectItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptyResume('en').projects
  }

  return value.map((entry) => {
    const item = typeof entry === 'object' && entry !== null ? (entry as Record<string, unknown>) : {}
    return {
      name: stringOrEmpty(item.name),
      description: stringOrEmpty(item.description),
      startDate: normalizeDate(item.startDate),
      endDate: normalizeDate(item.endDate),
      url: stringOrEmpty(item.url),
      highlights: normalizeStringArray(item.highlights),
    }
  })
}

export const normalizeResume = (value: unknown, locale: Locale): CvResume => {
  if (typeof value !== 'object' || value === null) {
    return createEmptyResume(locale)
  }

  const raw = value as Record<string, unknown>
  const rawBasics = typeof raw.basics === 'object' && raw.basics !== null ? (raw.basics as Record<string, unknown>) : {}
  const rawLocation =
    typeof rawBasics.location === 'object' && rawBasics.location !== null
      ? (rawBasics.location as Record<string, unknown>)
      : {}
  const rawMeta = typeof raw.meta === 'object' && raw.meta !== null ? (raw.meta as Record<string, unknown>) : {}

  return {
    basics: {
      name: stringOrEmpty(rawBasics.name),
      label: stringOrEmpty(rawBasics.label),
      email: stringOrEmpty(rawBasics.email),
      phone: stringOrEmpty(rawBasics.phone),
      url: stringOrEmpty(rawBasics.url),
      location: {
        address: stringOrEmpty(rawLocation.address),
      },
      summary: stringOrEmpty(rawBasics.summary),
      profiles: normalizeProfiles(rawBasics.profiles),
    },
    work: normalizeWork(raw.work),
    education: normalizeEducation(raw.education),
    skills: normalizeSkills(raw.skills),
    languages: normalizeLanguages(raw.languages),
    projects: normalizeProjects(raw.projects),
    meta: {
      template: normalizeTemplate(rawMeta.template),
      themeColor: stringOrEmpty(rawMeta.themeColor) || '#2563eb',
      fontFamily: normalizeFontFamily(rawMeta.fontFamily),
      locale: rawMeta.locale === 'vi' || rawMeta.locale === 'en' ? rawMeta.locale : locale,
      version: stringOrEmpty(rawMeta.version) || 'https://jsonresume.org/schema/',
      lastModified: stringOrEmpty(rawMeta.lastModified) || new Date().toISOString(),
    },
  }
}

export const cloneResume = (resume: CvResume): CvResume => JSON.parse(JSON.stringify(resume)) as CvResume

export const sampleResumeEn: CvResume = {
  basics: {
    name: 'Alex Nguyen',
    label: 'Senior Frontend Engineer',
    email: 'alex.nguyen@example.com',
    phone: '+84 912 345 678',
    url: 'https://alexnguyen.dev',
    location: {
      address: 'Ho Chi Minh City, Vietnam',
    },
    summary:
      'Frontend-focused product engineer with 8+ years of experience building scalable SaaS applications, design systems, and high-conversion landing pages.',
    profiles: [
      {
        network: 'LinkedIn',
        url: 'https://linkedin.com/in/alexnguyen',
      },
      {
        network: 'GitHub',
        url: 'https://github.com/alexnguyen',
      },
    ],
  },
  work: [
    {
      name: 'NovaTech',
      position: 'Lead Frontend Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      url: 'https://novatech.example',
      summary: 'Led a cross-functional team to deliver a multi-tenant B2B dashboard platform.',
      highlights: [
        'Launched a design system that cut feature delivery time by 28%.',
        'Improved Core Web Vitals and reduced bounce rate by 19%.',
      ],
    },
    {
      name: 'CloudCrew',
      position: 'Frontend Engineer',
      startDate: '2019-03',
      endDate: '2021-12',
      url: 'https://cloudcrew.example',
      summary: 'Built subscription and analytics modules for enterprise clients.',
      highlights: ['Migrated legacy UI to Vue 3 and TypeScript.', 'Owned CI checks for UI quality and accessibility.'],
    },
  ],
  education: [
    {
      institution: 'Ho Chi Minh City University of Technology',
      studyType: 'Bachelor',
      area: 'Computer Science',
      score: '3.6/4.0',
      startDate: '2013-09',
      endDate: '2017-06',
      url: 'https://hcmut.edu.vn',
      courses: ['Software Architecture', 'Human Computer Interaction'],
    },
  ],
  skills: [
    {
      name: 'Frontend',
      level: 'Advanced',
      keywords: ['Vue 3', 'TypeScript', 'Vite', 'CSS Architecture'],
    },
    {
      name: 'Backend Collaboration',
      level: 'Intermediate',
      keywords: ['Node.js', 'GraphQL', 'REST API'],
    },
  ],
  languages: [
    {
      language: 'Vietnamese',
      fluency: 'Native',
      certificate: '',
    },
    {
      language: 'English',
      fluency: 'Professional working proficiency',
      certificate: 'IELTS 7.5',
    },
  ],
  projects: [
    {
      name: 'CV Genie',
      description: 'A multilingual resume builder with template rendering and PDF export.',
      startDate: '2024-08',
      endDate: '2025-02',
      url: 'https://cvgenie.example',
      highlights: ['Exported 20k+ ATS-friendly resumes.', 'Integrated auto-save with version snapshots.'],
    },
  ],
  meta: {
    template: 'modern',
    themeColor: '#2563eb',
    fontFamily: 'inter',
    locale: 'en',
    version: 'https://jsonresume.org/schema/',
    lastModified: new Date().toISOString(),
  },
}

export const sampleResumeVi: CvResume = {
  basics: {
    name: 'Nguyen Minh Dang',
    label: 'Ky su Frontend cap cao',
    email: 'dang.nguyen@example.com',
    phone: '+84 934 567 890',
    url: 'https://dangportfolio.dev',
    location: {
      address: 'Thu Duc, TP. Ho Chi Minh, Viet Nam',
    },
    summary:
      'Ky su san pham chuyen ve Frontend voi hon 7 nam kinh nghiem xay dung SaaS, toi uu trai nghiem nguoi dung va dong bo voi muc tieu kinh doanh.',
    profiles: [
      {
        network: 'LinkedIn',
        url: 'https://linkedin.com/in/dangnguyen',
      },
      {
        network: 'GitHub',
        url: 'https://github.com/dangnguyen',
      },
    ],
  },
  work: [
    {
      name: 'Skyline Labs',
      position: 'Senior Frontend Engineer',
      startDate: '2021-05',
      endDate: 'Hien tai',
      url: 'https://skylinelabs.example',
      summary: 'Phat trien he thong dashboard da tenant cho nhom san pham B2B.',
      highlights: [
        'Rut ngan 30% thoi gian release nhan nho bo component tai su dung.',
        'Nang diem hieu nang va kha nang truy cap cua trang quan tri.',
      ],
    },
  ],
  education: [
    {
      institution: 'Dai hoc Khoa hoc Tu nhien TP.HCM',
      studyType: 'Cu nhan',
      area: 'Cong nghe thong tin',
      score: '8.4/10',
      startDate: '2014-09',
      endDate: '2018-06',
      url: 'https://hcmus.edu.vn',
      courses: ['Kien truc phan mem', 'Phan tich va thiet ke he thong'],
    },
  ],
  skills: [
    {
      name: 'Frontend',
      level: 'Chuyen sau',
      keywords: ['Vue 3', 'TypeScript', 'Pinia', 'Performance Optimization'],
    },
    {
      name: 'Lam viec lien phong ban',
      level: 'Tot',
      keywords: ['Product Discovery', 'A/B Testing', 'Mentoring'],
    },
  ],
  languages: [
    {
      language: 'Tieng Viet',
      fluency: 'Ban ngu',
      certificate: '',
    },
    {
      language: 'Tieng Anh',
      fluency: 'Thanh thao trong cong viec',
      certificate: 'TOEIC 900',
    },
  ],
  projects: [
    {
      name: 'Resume Studio',
      description: 'Cong cu tao CV da mau voi kha nang preview truc tiep va xuat PDF.',
      startDate: '2025-01',
      endDate: '2025-11',
      url: 'https://resumestudio.example',
      highlights: ['Ho tro 3 template ATS-friendly.', 'Luu tu dong vao trinh duyet de tranh mat du lieu.'],
    },
  ],
  meta: {
    template: 'modern',
    themeColor: '#0f766e',
    fontFamily: 'be-vietnam-pro',
    locale: 'vi',
    version: 'https://jsonresume.org/schema/',
    lastModified: new Date().toISOString(),
  },
}

export const sampleResumeByLocale = (locale: Locale): CvResume => (locale === 'vi' ? sampleResumeVi : sampleResumeEn)
