<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Locale, TranslationKeys } from '../../../../content/translations'
import {
  createEducationItem,
  createEmptyResume,
  createLanguageItem,
  createProfileItem,
  createProjectItem,
  createSkillItem,
  createWorkItem,
  cvFontFamilyMap,
  cvThemeColorPresets,
  type CvFontFamily,
  type CvResume,
  type CvProfile,
} from '../utils/cv-model'
import { fontsByLocale, type CvFontId, cvFontRegistry, defaultFontForLocale, loadCvFont } from '../utils/cv-fonts'

type EditorStepId = 'style' | 'basics' | 'work' | 'education' | 'skills' | 'languages' | 'projects'

type EditorStep = {
  id: EditorStepId
  labelKey: keyof TranslationKeys
  icon: string
}

const STEP_STORAGE_KEY = 'ystasearea-cv-editor-active-step'

const props = defineProps<{
  cv: CvResume
  t: TranslationKeys
  cvLanguage: Locale
  validationCount: number
  importError: string
  importSuccess: boolean
  copied: boolean
  exportingPdf: boolean
}>()

const emit = defineEmits<{
  (event: 'export-pdf'): void
  (event: 'export-json'): void
  (event: 'copy-json'): void
  (event: 'download-sample'): void
  (e: 'update:activeStep', value: string): void
  (event: 'reset-all'): void
  (event: 'load-sample'): void
  (event: 'import-json', value: string): void
  (event: 'update:cv-language', value: Locale): void
}>()

const steps: EditorStep[] = [
  { id: 'style', labelKey: 'cvStepStyle', icon: '🎨' },
  { id: 'basics', labelKey: 'cvStepPersonal', icon: '👤' },
  { id: 'work', labelKey: 'cvStepWork', icon: '💼' },
  { id: 'education', labelKey: 'cvStepEducation', icon: '🎓' },
  { id: 'skills', labelKey: 'cvStepSkills', icon: '🛠' },
  { id: 'languages', labelKey: 'cvStepLanguages', icon: '🌍' },
  { id: 'projects', labelKey: 'cvStepProjects', icon: '🚀' },
]

const activeStep = ref<EditorStepId>('style')
const importInput = ref<HTMLInputElement | null>(null)

const availableFonts = computed(() =>
  fontsByLocale[props.cvLanguage].map((id) => ({
    id,
    label: cvFontRegistry[id].label,
    vi: cvFontRegistry[id].vietnameseSupport,
  }))
)

const openImportDialog = () => {
  importInput.value?.click()
}

const onImportFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const text = await file.text()
  emit('import-json', text)
  input.value = ''
}

const setStep = (stepId: EditorStepId) => {
  activeStep.value = stepId
}

const addStringItem = (list: string[]) => {
  list.push('')
}

const removeStringItem = (list: string[], index: number) => {
  list.splice(index, 1)
}

const addProfile = () => {
  props.cv.basics.profiles.push(createProfileItem())
}

const removeProfile = (index: number) => {
  props.cv.basics.profiles.splice(index, 1)
}

const addWork = () => {
  props.cv.work.push(createWorkItem())
}

const removeWork = (index: number) => {
  props.cv.work.splice(index, 1)
}

const addEducation = () => {
  props.cv.education.push(createEducationItem())
}

const removeEducation = (index: number) => {
  props.cv.education.splice(index, 1)
}

const addSkill = () => {
  props.cv.skills.push(createSkillItem())
}

const removeSkill = (index: number) => {
  props.cv.skills.splice(index, 1)
}

const addLanguage = () => {
  props.cv.languages.push(createLanguageItem())
}

const removeLanguage = (index: number) => {
  props.cv.languages.splice(index, 1)
}

const addProject = () => {
  props.cv.projects.push(createProjectItem())
}

const removeProject = (index: number) => {
  props.cv.projects.splice(index, 1)
}

const applyThemeColor = (color: string) => {
  props.cv.meta.themeColor = color
}

const updateCvLanguage = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  if (value === 'vi' || value === 'en') {
    emit('update:cv-language', value)
    // Auto-switch font if current font isn't available for new locale
    const available = fontsByLocale[value]
    if (!available.includes(props.cv.meta.fontFamily)) {
      props.cv.meta.fontFamily = defaultFontForLocale[value]
    }
  }
}

const SOCIAL_PRESETS = [
  { name: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
  { name: 'GitHub', prefix: 'https://github.com/' },
  { name: 'GitLab', prefix: 'https://gitlab.com/' },
  { name: 'Portfolio Website', prefix: 'https://' },
  { name: 'Twitter / X', prefix: 'https://x.com/' },
  { name: 'Stack Overflow', prefix: 'https://stackoverflow.com/users/' }
]

const addPresetProfile = (presetName: string) => {
  const match = SOCIAL_PRESETS.find((p) => p.name === presetName)
  props.cv.basics.profiles.push({
    network: presetName,
    url: match ? match.prefix : '',
  })
}

const handleNetworkChange = (profile: CvProfile) => {
  const match = SOCIAL_PRESETS.find((p) => p.name === profile.network)
  if (match) {
    // If URL is empty or exactly matches another prefix (meaning they changed presets blindly)
    if (!profile.url || SOCIAL_PRESETS.some((p) => p.prefix === profile.url)) {
      profile.url = match.prefix
    }
  }
}

const updateFont = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value as CvFontId
  props.cv.meta.fontFamily = value
  loadCvFont(value)
}

// Preload the current font on mount
onMounted(() => {
  loadCvFont(props.cv.meta.fontFamily)

  const saved = localStorage.getItem(STEP_STORAGE_KEY)
  const found = steps.find((step) => step.id === saved)
  if (found) {
    activeStep.value = found.id
  }
})

watch(activeStep, (next) => {
  localStorage.setItem(STEP_STORAGE_KEY, next)
  emit('update:activeStep', next)
}, { immediate: true })

watch(
  () => props.cv.meta.fontFamily,
  (fontId) => loadCvFont(fontId)
)
</script>

<template>
  <section class="cv-editor-panel">
    <!-- Header -->
    <div class="cv-editor-head">
      <h3>{{ t.cvBuilderTitle }}</h3>
    </div>

    <!-- Icon Action Bar -->
    <div class="cv-action-bar">
      <button
        class="cv-action-btn cv-action-btn--primary"
        :title="exportingPdf ? t.cvActionExportingPdf : t.cvActionExportPdf"
        :disabled="exportingPdf"
        @click="emit('export-pdf')"
      >📄</button>

      <span class="cv-action-divider"></span>

      <button class="cv-action-btn" :title="t.cvActionImportJson" @click="openImportDialog">⬆️</button>
      <button class="cv-action-btn" :title="t.cvActionExportJson" @click="emit('export-json')">⬇️</button>
      <button class="cv-action-btn" :title="copied ? t.cvActionCopied : t.cvActionCopyJson" @click="emit('copy-json')">📋</button>

      <span class="cv-action-divider"></span>

      <button class="cv-action-btn" :title="t.cvActionLoadSample" @click="emit('load-sample')">📝</button>
      <button class="cv-action-btn" :title="t.cvActionSampleJson" @click="emit('download-sample')">💾</button>
      <button class="cv-action-btn" :title="t.cvActionReset" @click="emit('reset-all')">🔄</button>

      <input ref="importInput" class="cv-hidden-input" type="file" accept="application/json" @change="onImportFileChange" />
    </div>

    <!-- Alerts -->
    <div v-if="validationCount > 0" class="cv-alert cv-alert--warning">
      {{ t.cvValidationPrefix }} {{ validationCount }} {{ t.cvValidationSuffix }}
    </div>
    <div v-if="importError" class="cv-alert cv-alert--error">
      {{ t.cvImportError }}
    </div>
    <div v-if="importSuccess" class="cv-alert cv-alert--success">
      {{ t.cvImportSuccess }}
    </div>

    <!-- Editor Body: step nav + form -->
    <div class="cv-editor-body">
      <!-- Step Navigation -->
      <nav class="cv-step-nav" :aria-label="t.cvStepNavigationAria">
        <button
          v-for="step in steps"
          :key="step.id"
          class="cv-step-btn"
          :class="{ 'cv-step-btn--active': activeStep === step.id }"
          type="button"
          @click="setStep(step.id)"
        >
          <span class="cv-step-btn__icon" aria-hidden="true">{{ step.icon }}</span>
          <span>{{ t[step.labelKey] }}</span>
        </button>
      </nav>

      <!-- Form Content -->
      <Transition name="cv-step" mode="out-in">
        <section :key="activeStep" class="cv-form-section cv-form-section--step">
          <template v-if="activeStep === 'style'">
            <h4>{{ t.cvSectionStyle }}</h4>
            <div class="cv-form-grid">
              <label class="tool-field">
                <span>{{ t.cvTemplateLabel }}</span>
                <select v-model="cv.meta.template" class="ui-select">
                  <option value="modern">{{ t.cvTemplateModern }}</option>
                  <option value="classic">{{ t.cvTemplateClassic }}</option>
                  <option value="minimal">{{ t.cvTemplateMinimal }}</option>
                </select>
              </label>

              <label class="tool-field">
                <span>{{ t.languageLabel }}</span>
                <select class="ui-select" :value="cvLanguage" @change="updateCvLanguage">
                  <option value="en">{{ t.cvLanguageEnglish }}</option>
                  <!-- Temporarily disabled Vietnamese language option -->
                  <option value="vi" v-if="false">{{ t.cvLanguageVietnamese }}</option>
                </select>
              </label>

              <label class="tool-field">
                <span>{{ t.cvFontLabel }}</span>
                <select class="ui-select" :value="cv.meta.fontFamily" @change="updateFont">
                  <option v-for="font in availableFonts" :key="font.id" :value="font.id">
                    {{ font.label }}{{ font.vi ? ' 🇻🇳' : '' }}
                  </option>
                </select>
              </label>

              <label class="tool-field">
                <span>{{ t.cvThemeColorLabel }}</span>
                <input v-model="cv.meta.themeColor" class="ui-input cv-color-input" type="color" />
              </label>
            </div>

            <div class="cv-color-presets">
              <button
                v-for="color in cvThemeColorPresets"
                :key="color"
                type="button"
                class="cv-color-dot"
                :style="{ backgroundColor: color }"
                :aria-label="`${t.cvThemeColorPreset} ${color}`"
                @click="applyThemeColor(color)"
              ></button>
            </div>
          </template>

          <template v-else-if="activeStep === 'basics'">
            <h4>{{ t.cvSectionBasics }}</h4>
            <div class="cv-form-grid">
              <label class="tool-field">
                <span>{{ t.cvFieldFullName }}</span>
                <input v-model="cv.basics.name" class="ui-input" :placeholder="t.cvPlaceholderFullName" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldJobTitle }}</span>
                <input v-model="cv.basics.label" class="ui-input" :placeholder="t.cvPlaceholderJobTitle" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldEmail }}</span>
                <input v-model="cv.basics.email" class="ui-input" type="email" :placeholder="t.cvPlaceholderEmail" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldPhone }}</span>
                <input v-model="cv.basics.phone" class="ui-input" :placeholder="t.cvPlaceholderPhone" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldWebsite }}</span>
                <input v-model="cv.basics.url" class="ui-input" :placeholder="t.cvPlaceholderWebsite" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldLocation }}</span>
                <input v-model="cv.basics.location.address" class="ui-input" :placeholder="t.cvPlaceholderLocation" />
              </label>
            </div>

            <label class="tool-field">
              <span>{{ t.cvFieldSummary }}</span>
              <textarea v-model="cv.basics.summary" class="tool-textarea" rows="3" :placeholder="t.cvPlaceholderSummary"></textarea>
            </label>

            <div class="cv-subsection-head">
              <h4>🌐 {{ t.cvSectionProfiles }}</h4>
            </div>
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; margin-top: 0.5rem;">
              <button 
                v-for="preset in SOCIAL_PRESETS" 
                :key="preset.name" 
                class="cv-action-btn" 
                style="width: auto; height: auto; padding: 0.25rem 0.6rem; font-size: 0.85em; border-radius: 4px; border: 1px solid var(--cv-color-border);"
                @click="addPresetProfile(preset.name)"
                :title="`Add ${preset.name}`"
              >
                + {{ preset.name }}
              </button>
              <button 
                class="cv-action-btn" 
                style="width: auto; height: auto; padding: 0.25rem 0.6rem; font-size: 0.85em; border-radius: 4px; border: 1px dashed var(--cv-color-primary); color: var(--cv-color-primary);"
                @click="addProfile"
                title="Add Custom Profile"
              >
                + Custom
              </button>
            </div>

            <div v-if="cv.basics.profiles.length === 0" class="cv-inline-empty">{{ t.cvEmptyProfiles }}</div>

            <div v-for="(profile, profileIndex) in cv.basics.profiles" :key="`profile-${profileIndex}`" class="cv-item-card">
              <div class="cv-form-grid">
                <label class="tool-field">
                  <span>{{ t.cvFieldProfilePlatform }}</span>
                  <input v-model="profile.network" list="cv-social-networks" class="ui-input" :placeholder="t.cvPlaceholderProfilePlatform" @change="handleNetworkChange(profile)" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldProfileUrl }}</span>
                  <input v-model="profile.url" class="ui-input" :placeholder="t.cvPlaceholderProfileUrl" />
                </label>
              </div>
              <button class="cv-action-btn" title="Remove" @click="removeProfile(profileIndex)">🗑️</button>
            </div>
          </template>

          <template v-else-if="activeStep === 'work'">
            <div class="cv-subsection-head">
              <h4>💼 {{ t.cvSectionWork }}</h4>
              <button class="cv-action-btn" title="Add" @click="addWork">➕</button>
            </div>

            <div v-if="cv.work.length === 0" class="cv-inline-empty">{{ t.cvEmptyWork }}</div>

            <div v-for="(work, workIndex) in cv.work" :key="`work-${workIndex}`" class="cv-item-card">
              <div class="cv-item-card__head">
                <h4>{{ t.cvWorkItemTitle }} #{{ workIndex + 1 }}</h4>
                <button class="cv-action-btn" title="Remove" @click="removeWork(workIndex)">🗑️</button>
              </div>

              <div class="cv-form-grid">
                <label class="tool-field">
                  <span>{{ t.cvFieldPosition }}</span>
                  <input v-model="work.position" class="ui-input" :placeholder="t.cvPlaceholderPosition" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldCompany }}</span>
                  <input v-model="work.name" class="ui-input" :placeholder="t.cvPlaceholderCompany" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldStartDate }}</span>
                  <input v-model="work.startDate" class="ui-input" type="month" />
                </label>
                <label class="tool-field">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ t.cvFieldEndDate }}</span>
                    <label style="display: flex; align-items: center; gap: 0.25rem; font-weight: normal; cursor: pointer; font-size: 0.8em; opacity: 0.8;">
                      <input v-model="work.isCurrent" type="checkbox" />
                      {{ t.cvFieldPresent }}
                    </label>
                  </div>
                  <input v-model="work.endDate" class="ui-input" type="month" :disabled="work.isCurrent" :min="work.startDate" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldDateFormat }}</span>
                  <select v-model="work.dateFormat" class="ui-select">
                    <option value="month">{{ t.cvFormatMonth }}</option>
                    <option value="year">{{ t.cvFormatYear }}</option>
                  </select>
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldCompanyWebsite }}</span>
                  <input v-model="work.url" class="ui-input" :placeholder="t.cvPlaceholderCompanyWebsite" />
                </label>
              </div>

              <label class="tool-field">
                <span>{{ t.cvFieldDescription }}</span>
                <textarea v-model="work.summary" class="tool-textarea" rows="2" :placeholder="t.cvPlaceholderWorkSummary"></textarea>
              </label>

              <div class="cv-subsection-head">
                <h5>{{ t.cvFieldAchievements }}</h5>
                <button class="cv-action-btn" title="Add" @click="addStringItem(work.highlights)">➕</button>
              </div>

              <div v-if="work.highlights.length === 0" class="cv-inline-empty">{{ t.cvEmptyAchievements }}</div>

              <div v-for="(highlight, highlightIndex) in work.highlights" :key="`work-${workIndex}-highlight-${highlightIndex}`" class="cv-inline-row">
                <input v-model="work.highlights[highlightIndex]" class="ui-input" :placeholder="t.cvPlaceholderAchievement" />
                <button class="cv-action-btn" title="Remove" @click="removeStringItem(work.highlights, highlightIndex)">🗑️</button>
              </div>
            </div>
          </template>

          <template v-else-if="activeStep === 'education'">
            <div class="cv-subsection-head">
              <h4>🎓 {{ t.cvSectionEducation }}</h4>
              <button class="cv-action-btn" title="Add" @click="addEducation">➕</button>
            </div>

            <div v-if="cv.education.length === 0" class="cv-inline-empty">{{ t.cvEmptyEducation }}</div>

            <div v-for="(education, educationIndex) in cv.education" :key="`education-${educationIndex}`" class="cv-item-card">
              <div class="cv-item-card__head">
                <h4>{{ t.cvEducationItemTitle }} #{{ educationIndex + 1 }}</h4>
                <button class="cv-action-btn" title="Remove" @click="removeEducation(educationIndex)">🗑️</button>
              </div>

              <div class="cv-form-grid">
                <label class="tool-field">
                  <span>{{ t.cvFieldSchool }}</span>
                  <input v-model="education.institution" class="ui-input" :placeholder="t.cvPlaceholderSchool" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldDegree }}</span>
                  <input v-model="education.studyType" class="ui-input" :placeholder="t.cvPlaceholderDegree" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldMajor }}</span>
                  <input v-model="education.area" class="ui-input" :placeholder="t.cvPlaceholderMajor" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldGpa }}</span>
                  <input v-model="education.score" class="ui-input" :placeholder="t.cvPlaceholderGpa" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldStartDate }}</span>
                  <input v-model="education.startDate" class="ui-input" type="month" />
                </label>
                <label class="tool-field">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ t.cvFieldEndDate }}</span>
                    <label style="display: flex; align-items: center; gap: 0.25rem; font-weight: normal; cursor: pointer; font-size: 0.8em; opacity: 0.8;">
                      <input v-model="education.isCurrent" type="checkbox" />
                      {{ t.cvFieldPresent }}
                    </label>
                  </div>
                  <input v-model="education.endDate" class="ui-input" type="month" :disabled="education.isCurrent" :min="education.startDate" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldDateFormat }}</span>
                  <select v-model="education.dateFormat" class="ui-select">
                    <option value="month">{{ t.cvFormatMonth }}</option>
                    <option value="year">{{ t.cvFormatYear }}</option>
                  </select>
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldSchoolWebsite }}</span>
                  <input v-model="education.url" class="ui-input" :placeholder="t.cvPlaceholderSchoolWebsite" />
                </label>
              </div>

              <div class="cv-subsection-head">
                <h5>{{ t.cvFieldCourses }}</h5>
                <button class="cv-action-btn" title="Add" @click="addStringItem(education.courses)">➕</button>
              </div>

              <div v-if="education.courses.length === 0" class="cv-inline-empty">{{ t.cvEmptyCourses }}</div>

              <div v-for="(course, courseIndex) in education.courses" :key="`education-${educationIndex}-course-${courseIndex}`" class="cv-inline-row">
                <input v-model="education.courses[courseIndex]" class="ui-input" :placeholder="t.cvPlaceholderCourse" />
                <button class="cv-action-btn" title="Remove" @click="removeStringItem(education.courses, courseIndex)">🗑️</button>
              </div>
            </div>
          </template>

          <template v-else-if="activeStep === 'skills'">
            <div class="cv-subsection-head">
              <h4>🛠️ {{ t.cvSectionSkills }}</h4>
              <button class="cv-action-btn" title="Add" @click="addSkill">➕</button>
            </div>

            <div v-if="cv.skills.length === 0" class="cv-inline-empty">{{ t.cvEmptySkills }}</div>

            <div v-for="(skill, skillIndex) in cv.skills" :key="`skill-${skillIndex}`" class="cv-item-card">
              <div class="cv-item-card__head">
                <h4>{{ t.cvSkillItemTitle }} #{{ skillIndex + 1 }}</h4>
                <button class="cv-action-btn" title="Remove" @click="removeSkill(skillIndex)">🗑️</button>
              </div>

              <div class="cv-form-grid">
                <label class="tool-field">
                  <span>{{ t.cvFieldSkillCategory }}</span>
                  <input v-model="skill.name" class="ui-input" :placeholder="t.cvPlaceholderSkillCategory" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldSkillLevel }}</span>
                  <input v-model="skill.level" class="ui-input" :placeholder="t.cvPlaceholderSkillLevel" />
                </label>
              </div>

              <div class="cv-subsection-head">
                <h5>{{ t.cvFieldKeywords }}</h5>
                <button class="cv-action-btn" title="Add" @click="addStringItem(skill.keywords)">➕</button>
              </div>

              <div v-if="skill.keywords.length === 0" class="cv-inline-empty">{{ t.cvEmptyKeywords }}</div>

              <div v-for="(keyword, keywordIndex) in skill.keywords" :key="`skill-${skillIndex}-keyword-${keywordIndex}`" class="cv-inline-row">
                <input v-model="skill.keywords[keywordIndex]" class="ui-input" :placeholder="t.cvPlaceholderKeyword" />
                <button class="cv-action-btn" title="Remove" @click="removeStringItem(skill.keywords, keywordIndex)">🗑️</button>
              </div>
            </div>
          </template>

          <template v-else-if="activeStep === 'languages'">
            <div class="cv-subsection-head">
              <h4>🗣️ {{ t.cvSectionLanguages }}</h4>
              <button class="cv-action-btn" title="Add" @click="addLanguage">➕</button>
            </div>

            <div v-if="cv.languages.length === 0" class="cv-inline-empty">{{ t.cvEmptyLanguages }}</div>

            <div v-for="(language, languageIndex) in cv.languages" :key="`language-${languageIndex}`" class="cv-item-card">
              <div class="cv-item-card__head">
                <h4>{{ t.cvLanguageItemTitle }} #{{ languageIndex + 1 }}</h4>
                <button class="cv-action-btn" title="Remove" @click="removeLanguage(languageIndex)">🗑️</button>
              </div>

              <div class="cv-form-grid">
                <label class="tool-field">
                  <span>{{ t.cvFieldLanguage }}</span>
                  <input v-model="language.language" class="ui-input" :placeholder="t.cvPlaceholderLanguage" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldProficiency }}</span>
                  <input v-model="language.fluency" class="ui-input" :placeholder="t.cvPlaceholderProficiency" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldCertificate }}</span>
                  <input v-model="language.certificate" class="ui-input" :placeholder="t.cvPlaceholderCertificate" />
                </label>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="cv-subsection-head">
              <h4>{{ t.cvSectionProjects }}</h4>
              <button class="cv-action-btn" title="Add" @click="addProject">➕</button>
            </div>

            <div v-if="cv.projects.length === 0" class="cv-inline-empty">{{ t.cvEmptyProjects }}</div>

            <div v-for="(project, projectIndex) in cv.projects" :key="`project-${projectIndex}`" class="cv-item-card">
              <div class="cv-item-card__head">
                <h4>{{ t.cvProjectItemTitle }} #{{ projectIndex + 1 }}</h4>
                <button class="cv-action-btn" title="Remove" @click="removeProject(projectIndex)">🗑️</button>
              </div>

              <div class="cv-form-grid">
                <label class="tool-field">
                  <span>{{ t.cvFieldProjectName }}</span>
                  <input v-model="project.name" class="ui-input" :placeholder="t.cvPlaceholderProjectName" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldProjectUrl }}</span>
                  <input v-model="project.url" class="ui-input" :placeholder="t.cvPlaceholderProjectUrl" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldStartDate }}</span>
                  <input v-model="project.startDate" class="ui-input" type="month" />
                </label>
                <label class="tool-field">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ t.cvFieldEndDate }}</span>
                    <label style="display: flex; align-items: center; gap: 0.25rem; font-weight: normal; cursor: pointer; font-size: 0.8em; opacity: 0.8;">
                      <input v-model="project.isCurrent" type="checkbox" />
                      {{ t.cvFieldPresent }}
                    </label>
                  </div>
                  <input v-model="project.endDate" class="ui-input" type="month" :disabled="project.isCurrent" :min="project.startDate" />
                </label>
                <label class="tool-field">
                  <span>{{ t.cvFieldDateFormat }}</span>
                  <select v-model="project.dateFormat" class="ui-select">
                    <option value="month">{{ t.cvFormatMonth }}</option>
                    <option value="year">{{ t.cvFormatYear }}</option>
                  </select>
                </label>
              </div>

              <label class="tool-field">
                <span>{{ t.cvFieldDescription }}</span>
                <textarea v-model="project.description" class="tool-textarea" rows="2" :placeholder="t.cvPlaceholderProjectDesc"></textarea>
              </label>

              <div class="cv-subsection-head">
                <h5>{{ t.cvFieldAchievements }}</h5>
                <button class="cv-action-btn" title="Add" @click="addStringItem(project.highlights)">➕</button>
              </div>

              <div v-if="project.highlights.length === 0" class="cv-inline-empty">{{ t.cvEmptyAchievements }}</div>

              <div v-for="(highlight, highlightIndex) in project.highlights" :key="`project-${projectIndex}-highlight-${highlightIndex}`" class="cv-inline-row">
                <input v-model="project.highlights[highlightIndex]" class="ui-input" :placeholder="t.cvPlaceholderAchievement" />
                <button class="cv-action-btn" title="Remove" @click="removeStringItem(project.highlights, highlightIndex)">🗑️</button>
              </div>
            </div>
          </template>
        </section>
      </Transition>
      
      <!-- Native Dropdown Datalists -->
      <datalist id="cv-social-networks">
        <option v-for="preset in SOCIAL_PRESETS" :key="preset.name" :value="preset.name"></option>
      </datalist>
    </div>
  </section>
</template>
