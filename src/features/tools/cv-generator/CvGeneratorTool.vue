<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { translations, type Locale } from '../../../content/translations'
import CvEditorPanel from './components/CvEditorPanel.vue'
import CvPreviewPanel from './components/CvPreviewPanel.vue'
import { useCvGenerator } from './composables/useCvGenerator'
import { downloadCvPdf } from './utils/cv-pdf'
import './cv-generator.css'

const CV_LANGUAGE_STORAGE_KEY = 'ystasearea-cv-language'

const resolveInitialCvLanguage = (): Locale => {
  try {
    const saved = localStorage.getItem(CV_LANGUAGE_STORAGE_KEY)
    // Temporarily disabled vi support
    // return saved === 'vi' || saved === 'en' ? saved : 'en'
    return 'en'
  } catch (_error) {
    return 'en'
  }
}

const cvLanguage = ref<Locale>(resolveInitialCvLanguage())
const cvT = computed(() => translations[cvLanguage.value])

const {
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
  downloadSampleJson,
  copyJson,
} = useCvGenerator(cvLanguage)

const validationCount = computed(() => validationIssues.value.length)
const exportingPdf = ref(false)
const activeStep = ref('style')

const exportPdf = async () => {
  if (exportingPdf.value) {
    return
  }

  try {
    exportingPdf.value = true
    await downloadCvPdf(cv, {
      summary: cvT.value.cvSectionSummary,
      work: cvT.value.cvSectionWork,
      projects: cvT.value.cvSectionProjects,
      education: cvT.value.cvSectionEducation,
      skills: cvT.value.cvSectionSkills,
      languages: cvT.value.cvSectionLanguages,
      profiles: cvT.value.cvSectionProfiles,
      gpa: cvT.value.cvFieldGpa,
      courses: cvT.value.cvFieldCourses,
      untitled: cvT.value.cvUntitled,
      present: cvT.value.cvFieldPresent,
    })
  } catch (error) {
    console.error('PDF export failed', error)
  } finally {
    exportingPdf.value = false
  }
}

watch(cvLanguage, (next) => {
  localStorage.setItem(CV_LANGUAGE_STORAGE_KEY, next)
})

onMounted(() => {
  hydrate()
})
</script>

<template>
  <section class="cv-generator-tool">
    <div class="cv-generator-layout">
      <CvEditorPanel
        :cv="cv"
        :t="cvT"
        :cv-language="cvLanguage"
        :validation-count="validationCount"
        :import-error="importError"
        :import-success="importSuccess"
        :copied="copied"
        :exporting-pdf="exportingPdf"
        @update:cv-language="cvLanguage = $event"
        @export-pdf="exportPdf"
        @export-json="exportJsonFile"
        @copy-json="copyJson"
        @download-sample="downloadSampleJson"
        @reset-all="resetAll"
        @load-sample="loadSample"
        @import-json="importFromJson"
        @update:activeStep="activeStep = $event"
      />

      <CvPreviewPanel :cv="cv" :t="cvT" :active-step="activeStep" content-id="cv-preview-embedded" />
    </div>
  </section>
</template>
