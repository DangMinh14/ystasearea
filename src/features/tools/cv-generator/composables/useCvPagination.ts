import { ref, watch, nextTick, type Ref } from 'vue'
import type { CvResume, CvWorkItem, CvEducationItem, CvProjectItem, CvSkillItem, CvLanguageItem, CvProfile } from '../utils/cv-model'
import { createEmptyResume } from '../utils/cv-model'

export type CvResumePage = CvResume

const PAGE_HEIGHT_MM = 297
const TOP_MARGIN_MM = 15
const BOTTOM_MARGIN_MM = 12
const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - TOP_MARGIN_MM - BOTTOM_MARGIN_MM
const MM_TO_PX = 3.779527 // roughly 96dpi

export function useCvPagination(cv: Ref<CvResume>, scalerRef: Ref<HTMLElement | null>) {
  const pages = ref<CvResumePage[]>([])
  const isPaginating = ref(false)

  const chunkData = async () => {
    if (!scalerRef.value) return

    isPaginating.value = true
    await nextTick()

    // 1. Get the invisible measuring container
    const measurePage = scalerRef.value.querySelector('.cv-measure-page')
    if (!measurePage) {
      isPaginating.value = false
      return
    }

    const getH = (id: string, def = 0): number => {
      const el = measurePage.querySelector(`[data-page-block="${id}"]`)
      if (!el) return def
      // Convert true pixel height to internal scaled pixel height if necessary
      // getBoundingClientRect is scaled, offsetHeight is unscaled.
      // Since the measure page has no scale(), offsetHeight is pure!
      return (el as HTMLElement).offsetHeight
    }

    const contentHeightPx = CONTENT_HEIGHT_MM * MM_TO_PX

    // We simulate two columns if MODERN, or one column if CLASSIC/MINIMAL
    // Actually, we can just track cursorY per column based on the template logic!
    const isModern = cv.value.meta.template === 'modern'

    // We will build pages dynamically
    const newPages: CvResumePage[] = []
    
    const createNewPage = (): CvResumePage => {
      const page = createEmptyResume(cv.value.meta.locale)
      page.meta = cv.value.meta
      page.basics = { ...cv.value.basics, summary: '', profiles: [] }
      page.work = []
      page.education = []
      page.projects = []
      page.skills = []
      page.languages = []
      return page
    }

    let currentPage = createNewPage()
    newPages.push(currentPage)

    // Measure Header
    const headerHeight = getH('head')
    
    let cursorMain = headerHeight
    let cursorSide = headerHeight
    let pageIndexMain = 0
    let pageIndexSide = 0
    
    const ensureMainSpace = (h: number) => {
      if (cursorMain + h > contentHeightPx && cursorMain > headerHeight + 50) {
        pageIndexMain++
        cursorMain = 0
        if (!newPages[pageIndexMain]) newPages[pageIndexMain] = createNewPage()
      }
    }
    
    const ensureSideSpace = (h: number) => {
      if (cursorSide + h > contentHeightPx && cursorSide > headerHeight + 50) {
        pageIndexSide++
        cursorSide = 0
        if (!newPages[pageIndexSide]) newPages[pageIndexSide] = createNewPage()
      }
    }

    // Modern splits content into Side and Main. Classic/Minimal runs them all sequentially.
    const addMain = (h: number, assign: (p: CvResumePage) => void) => {
      if (h <= 0) return
      ensureMainSpace(h)
      assign(newPages[pageIndexMain])
      cursorMain += h
      if (!isModern) cursorSide = cursorMain // tie them together perfectly
    }

    const addSide = (h: number, assign: (p: CvResumePage) => void) => {
      if (h <= 0) return
      if (isModern) ensureSideSpace(h)
      else ensureMainSpace(h)
      
      assign(newPages[isModern ? pageIndexSide : pageIndexMain])
      
      if (isModern) cursorSide += h
      else {
        cursorMain += h
        cursorSide = cursorMain
      }
    }

    // Sequence of additions
    const hProfiles = getH('sect-profiles')
    addSide(hProfiles, p => p.basics.profiles = cv.value.basics.profiles)

    const hSkills = getH('sect-skills')
    addSide(hSkills, p => p.skills = cv.value.skills)

    const hLanguages = getH('sect-languages')
    addSide(hLanguages, p => p.languages = cv.value.languages)

    const hSummary = getH('sect-summary')
    addMain(hSummary, p => { p.basics.summary = cv.value.basics.summary })

    // Lists (measuring item by item)
    if (cv.value.work.length > 0) {
      const sectTitleH = getH('title-work')
      addMain(sectTitleH, p => {}) // advance cursor
      cv.value.work.forEach((item: CvWorkItem, i: number) => {
        addMain(getH(`work-${i}`), p => p.work.push(item))
      })
    }

    if (cv.value.projects.length > 0) {
      const sectTitleH = getH('title-projects')
      addMain(sectTitleH, p => {})
      cv.value.projects.forEach((item: CvProjectItem, i: number) => {
        addMain(getH(`projects-${i}`), p => p.projects.push(item))
      })
    }

    if (cv.value.education.length > 0) {
      const sectTitleH = getH('title-education')
      addMain(sectTitleH, p => {})
      cv.value.education.forEach((item: CvEducationItem, i: number) => {
        addMain(getH(`education-${i}`), p => p.education.push(item))
      })
    }

    pages.value = newPages
    isPaginating.value = false
  }

  return {
    pages,
    isPaginating,
    chunkData
  }
}
