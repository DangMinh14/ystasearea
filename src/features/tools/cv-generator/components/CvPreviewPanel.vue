<script setup lang="ts">
import { computed } from 'vue'
import type { TranslationKeys } from '../../../../content/translations'
import CvClassicTemplate from '../templates/CvClassicTemplate.vue'
import CvMinimalTemplate from '../templates/CvMinimalTemplate.vue'
import CvModernTemplate from '../templates/CvModernTemplate.vue'
import { cvFontFamilyMap, type CvResume } from '../utils/cv-model'
import { cvTemplateDesign, resolveCvTheme } from '../utils/cv-design'

const props = withDefaults(
  defineProps<{
    cv: CvResume
    t: TranslationKeys
    showHeader?: boolean
    variant?: 'embedded' | 'modal'
    contentId?: string
  }>(),
  {
    showHeader: true,
    variant: 'embedded',
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

const previewStyle = computed(() => {
  const template = cvTemplateDesign[props.cv.meta.template]
  const theme = resolveCvTheme(props.cv.meta.themeColor)

  return {
    '--cv-primary': theme.primary,
    '--cv-text': theme.text,
    '--cv-muted': theme.muted,
    '--cv-divider': theme.divider,
    '--cv-font-family': cvFontFamilyMap[props.cv.meta.fontFamily],
    '--cv-space-xs': `${template.spacing.xs}px`,
    '--cv-space-sm': `${template.spacing.sm}px`,
    '--cv-space-md': `${template.spacing.md}px`,
    '--cv-space-lg': `${template.spacing.lg}px`,
    '--cv-size-h1': `${template.fontSizes.h1}px`,
    '--cv-size-h2': `${template.fontSizes.h2}px`,
    '--cv-size-h3': `${template.fontSizes.h3}px`,
    '--cv-size-body': `${template.fontSizes.body}px`,
    '--cv-size-meta': `${template.fontSizes.meta}px`,
    '--cv-line-tight': template.lineHeight.tight,
    '--cv-line-normal': template.lineHeight.normal,
    '--cv-line-loose': template.lineHeight.loose,
  }
})

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
</script>

<template>
  <section class="cv-preview-panel" :class="`cv-preview-panel--${variant}`">
    <div v-if="showHeader" class="cv-preview-panel__head">
      <div>
        <p class="text-eyebrow">{{ t.cvPreviewEyebrow }}</p>
        <h3>{{ t.cvPreviewTitle }}</h3>
      </div>
      <p class="text-muted">{{ t.cvPreviewHint }}</p>
    </div>

    <div :id="contentId" class="cv-preview-page" :style="previewStyle">
      <div v-if="!hasContent" class="cv-empty-state">
        <h4>{{ t.cvPreviewEmptyTitle }}</h4>
        <p>{{ t.cvPreviewEmptyDesc }}</p>
      </div>
      <component :is="templateComponent" v-else :cv="cv" :t="t" />
    </div>
  </section>
</template>
