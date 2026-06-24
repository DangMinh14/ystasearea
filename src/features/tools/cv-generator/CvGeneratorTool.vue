<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { translations } from '../../../content/translations'
import CvEditorPanel from './components/CvEditorPanel.vue'
import CvPreviewPanel from './components/CvPreviewPanel.vue'
import { useCvGenerator } from './composables/useCvGenerator'
import { printCv } from './utils/cv-print'
import './cv-generator.css'

const PREVIEW_CONTENT_ID = 'cv-preview-embedded'

const cvT = translations.en

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
} = useCvGenerator()

const validationCount = computed(() => validationIssues.value.length)
const exportingPdf = ref(false)
const activeStep = ref('style')

const exportPdf = async () => {
  if (exportingPdf.value) {
    return
  }

  try {
    exportingPdf.value = true
    await printCv(PREVIEW_CONTENT_ID, cv.basics.name.trim() || 'resume')
  } catch (error) {
    console.error('PDF export failed', error)
  } finally {
    exportingPdf.value = false
  }
}

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
        :validation-count="validationCount"
        :import-error="importError"
        :import-success="importSuccess"
        :copied="copied"
        :exporting-pdf="exportingPdf"
        @export-pdf="exportPdf"
        @export-json="exportJsonFile"
        @copy-json="copyJson"
        @download-sample="downloadSampleJson"
        @reset-all="resetAll"
        @load-sample="loadSample"
        @import-json="importFromJson"
        @update:active-step="activeStep = $event"
      />

      <CvPreviewPanel :cv="cv" :t="cvT" :active-step="activeStep" :content-id="PREVIEW_CONTENT_ID" />
    </div>
  </section>
</template>
