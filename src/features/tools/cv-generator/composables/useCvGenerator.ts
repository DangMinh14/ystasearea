import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { Locale } from '../../../../content/translations'
import {
  cloneResume,
  createEmptyResume,
  normalizeResume,
  sampleResumeByLocale,
  type CvResume,
} from '../utils/cv-model'

const STORAGE_KEY = 'ystasearea-cv-generator-v1'

type ValidationIssue = {
  id: string
  section: 'basics' | 'work' | 'education' | 'skills' | 'languages' | 'projects'
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const setTimestamp = (resume: CvResume) => {
  resume.meta.lastModified = new Date().toISOString()
}

const replaceResume = (target: CvResume, next: CvResume) => {
  target.basics = next.basics
  target.work = next.work
  target.education = next.education
  target.skills = next.skills
  target.languages = next.languages
  target.projects = next.projects
  target.meta = next.meta
}

const downloadTextFile = (filename: string, text: string) => {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}

export const useCvGenerator = (locale: Ref<Locale>) => {
  const cv = reactive<CvResume>(createEmptyResume(locale.value))
  const importError = ref('')
  const importSuccess = ref(false)
  const copied = ref(false)
  const hydrated = ref(false)
  let importSuccessTimer: number | null = null

  const validationIssues = computed<ValidationIssue[]>(() => {
    const issues: ValidationIssue[] = []

    if (!cv.basics.name.trim()) {
      issues.push({ id: 'basics.name.required', section: 'basics' })
    }

    if (!cv.basics.label.trim()) {
      issues.push({ id: 'basics.label.required', section: 'basics' })
    }

    if (cv.basics.email.trim() && !emailPattern.test(cv.basics.email.trim())) {
      issues.push({ id: 'basics.email.invalid', section: 'basics' })
    }

    cv.work.forEach((item, index) => {
      if (!item.position.trim() || !item.name.trim()) {
        issues.push({ id: `work.${index}.required`, section: 'work' })
      }
    })

    cv.education.forEach((item, index) => {
      if (!item.institution.trim() || !item.studyType.trim()) {
        issues.push({ id: `education.${index}.required`, section: 'education' })
      }
    })

    cv.skills.forEach((item, index) => {
      if (!item.name.trim()) {
        issues.push({ id: `skills.${index}.required`, section: 'skills' })
      }
    })

    cv.languages.forEach((item, index) => {
      if (!item.language.trim()) {
        issues.push({ id: `languages.${index}.required`, section: 'languages' })
      }
    })

    cv.projects.forEach((item, index) => {
      if (!item.name.trim()) {
        issues.push({ id: `projects.${index}.required`, section: 'projects' })
      }
    })

    return issues
  })

  const clearTransientState = () => {
    importError.value = ''
    importSuccess.value = false
    copied.value = false
    if (importSuccessTimer !== null) {
      window.clearTimeout(importSuccessTimer)
      importSuccessTimer = null
    }
  }

  const saveToStorage = () => {
    if (!hydrated.value) {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cv))
    } catch (error) {
      console.error('Failed to persist CV generator state', error)
    }
  }

  const hydrate = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        cv.meta.locale = locale.value
        hydrated.value = true
        return
      }

      const parsed = JSON.parse(raw) as unknown
      const normalized = normalizeResume(parsed, locale.value)
      replaceResume(cv, normalized)
      locale.value = normalized.meta.locale
    } catch (error) {
      console.error('Failed to hydrate CV generator state', error)
      replaceResume(cv, createEmptyResume(locale.value))
    } finally {
      hydrated.value = true
    }
  }

  watch(
    () => locale.value,
    (nextLocale) => {
      cv.meta.locale = nextLocale
      saveToStorage()
    }
  )

  watch(
    () => cv,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  const resetAll = () => {
    const next = createEmptyResume(locale.value)
    setTimestamp(next)
    replaceResume(cv, next)
    clearTransientState()
  }

  const loadSample = () => {
    const next = cloneResume(sampleResumeByLocale(locale.value))
    setTimestamp(next)
    replaceResume(cv, next)
    clearTransientState()
  }

  const importFromJson = (text: string) => {
    try {
      const parsed = JSON.parse(text) as unknown
      const next = normalizeResume(parsed, locale.value)
      setTimestamp(next)
      replaceResume(cv, next)
      locale.value = next.meta.locale
      importSuccess.value = true
      importError.value = ''
      if (importSuccessTimer !== null) {
        window.clearTimeout(importSuccessTimer)
      }
      importSuccessTimer = window.setTimeout(() => {
        importSuccess.value = false
      }, 2500)
    } catch (_error) {
      importError.value = 'invalid-json'
      importSuccess.value = false
    }
  }

  const exportJsonString = () => JSON.stringify(cv, null, 2)

  const exportJsonFile = () => {
    setTimestamp(cv)
    downloadTextFile('cv-resume.json', exportJsonString())
  }

  const downloadSampleJson = () => {
    const sample = sampleResumeByLocale(locale.value)
    downloadTextFile('cv-sample.json', JSON.stringify(sample, null, 2))
  }

  const copyJson = async () => {
    try {
      setTimestamp(cv)
      await navigator.clipboard.writeText(exportJsonString())
      copied.value = true
      window.setTimeout(() => {
        copied.value = false
      }, 1800)
    } catch (error) {
      console.error('Copy JSON failed', error)
      copied.value = false
    }
  }

  return {
    cv,
    importError,
    importSuccess,
    copied,
    validationIssues,
    hydrate,
    resetAll,
    loadSample,
    importFromJson,
    exportJsonFile,
    exportJsonString,
    downloadSampleJson,
    copyJson,
  }
}
