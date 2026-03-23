<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { TranslationKeys } from '../../../../content/translations'
import CvClassicTemplate from '../templates/CvClassicTemplate.vue'
import CvMinimalTemplate from '../templates/CvMinimalTemplate.vue'
import CvModernTemplate from '../templates/CvModernTemplate.vue'
import type { CvResume } from '../utils/cv-model'
import { createLayoutConfig, layoutConfigToCssVars } from '../utils/cv-layout-config'
import { getCssFontFamily, loadCvFont } from '../utils/cv-fonts'

const props = withDefaults(
  defineProps<{
    cv: CvResume
    t: TranslationKeys
    showHeader?: boolean
    contentId?: string
  }>(),
  {
    showHeader: true,
    contentId: 'cv-print-area',
  }
)

const templateComponent = computed(() => {
  switch (props.cv.meta.template) {
    case 'classic':
      return CvClassicTemplate
    case 'minimal':
      return CvMinimalTemplate
    default:
      return CvModernTemplate
  }
})

const layoutConfig = computed(() =>
  createLayoutConfig(props.cv.meta.template, props.cv.meta.themeColor)
)

const fontFamilyCss = computed(() => getCssFontFamily(props.cv.meta.fontFamily))

const previewStyle = computed(() => layoutConfigToCssVars(layoutConfig.value, fontFamilyCss.value))

const hasContent = computed(() => {
  const basics = props.cv.basics
  return Boolean(
    basics.name ||
      basics.label ||
      basics.summary ||
      props.cv.work.some((item) => item.position || item.name || item.summary) ||
      props.cv.education.some((item) => item.institution || item.studyType) ||
      props.cv.projects.some((item) => item.name || item.description)
  )
})

// ── Scaling logic ──
// The A4 page (210mm ≈ 794px at 96dpi) is scaled to fit the available container width.
const scalerRef = ref<HTMLDivElement | null>(null)
const pageRef = ref<HTMLDivElement | null>(null)
const scale = ref(1)

const A4_WIDTH_PX = 794 // 210mm at 96dpi

const updateScale = () => {
  if (!scalerRef.value) {
    return
  }

  const containerWidth = scalerRef.value.clientWidth
  const newScale = Math.min(1, containerWidth / A4_WIDTH_PX)
  scale.value = newScale
}

const pageTransformStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'top left',
  width: '210mm',
  minHeight: '297mm',
}))

const scalerContainerStyle = computed(() => {
  if (!pageRef.value) {
    return {}
  }
  // Set the scaler height to the scaled page height to prevent overflow
  return {
    height: `${pageRef.value.scrollHeight * scale.value}px`,
  }
})

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  loadCvFont(props.cv.meta.fontFamily)
  updateScale()

  if (scalerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateScale()
    })
    resizeObserver.observe(scalerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(
  () => props.cv.meta.fontFamily,
  (fontId) => loadCvFont(fontId)
)
</script>

<template>
  <section class="cv-preview-panel">
    <div v-if="showHeader" class="cv-preview-panel__head">
      <h3>{{ t.cvPreviewTitle }}</h3>
    </div>

    <div ref="scalerRef" class="cv-preview-scaler" :style="scalerContainerStyle">
      <div
        :id="contentId"
        ref="pageRef"
        class="cv-preview-page"
        :style="{ ...previewStyle, ...pageTransformStyle }"
      >
        <div v-if="!hasContent" class="cv-empty-state">
          <h4>{{ t.cvPreviewEmptyTitle }}</h4>
          <p>{{ t.cvPreviewEmptyDesc }}</p>
        </div>
        <component :is="templateComponent" v-else :cv="cv" :t="t" />
      </div>
    </div>
  </section>
</template>
