<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import UiButton from '../../../../components/ui/UiButton.vue'
import type { Locale, TranslationKeys } from '../../../../content/translations'
import {
  cvThemeColorPresets,
  createEducationItem,
  createLanguageItem,
  createProfileItem,
  createProjectItem,
  createSkillItem,
  createWorkItem,
  type CvResume,
} from '../utils/cv-model'

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
  (event: 'reset-all'): void
  (event: 'load-sample'): void
  (event: 'import-json', value: string): void
  (event: 'open-full-preview'): void
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

const currentStepIndex = computed(() => steps.findIndex((step) => step.id === activeStep.value))
const totalSteps = computed(() => steps.length)

const progressPercentage = computed(() => {
  const base = ((currentStepIndex.value + 1) / totalSteps.value) * 100
  return `${Math.max(0, Math.min(100, base))}%`
})

const canGoPrev = computed(() => currentStepIndex.value > 0)
const canGoNext = computed(() => currentStepIndex.value < steps.length - 1)

const stepTitle = computed(() => {
  const current = steps[currentStepIndex.value]
  return current ? props.t[current.labelKey] : props.t.cvStepStyle
})

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

const goPrev = () => {
  if (!canGoPrev.value) {
    return
  }

  activeStep.value = steps[currentStepIndex.value - 1].id
}

const goNext = () => {
  if (!canGoNext.value) {
    return
  }

  activeStep.value = steps[currentStepIndex.value + 1].id
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
  }
}

onMounted(() => {
  const saved = localStorage.getItem(STEP_STORAGE_KEY)
  const found = steps.find((step) => step.id === saved)
  if (found) {
    activeStep.value = found.id
  }
})

watch(activeStep, (next) => {
  localStorage.setItem(STEP_STORAGE_KEY, next)
})
</script>

<template>
  <section class="cv-editor-panel">
    <div class="cv-editor-head">
      <div>
        <p class="text-eyebrow">{{ t.cvBuilderEyebrow }}</p>
        <h3>{{ t.cvBuilderTitle }}</h3>
      </div>
      <p class="text-muted">{{ t.cvBuilderSubtitle }}</p>
    </div>

    <div class="cv-action-bar">
      <UiButton size="sm" :disabled="exportingPdf" @click="emit('export-pdf')">{{ exportingPdf ? t.cvActionExportingPdf : t.cvActionExportPdf }}</UiButton>
      <UiButton size="sm" variant="soft" @click="emit('open-full-preview')">{{ t.cvActionFullPreview }}</UiButton>
      <UiButton size="sm" variant="soft" @click="emit('export-json')">{{ t.cvActionExportJson }}</UiButton>
      <UiButton size="sm" variant="soft" @click="openImportDialog">{{ t.cvActionImportJson }}</UiButton>
      <UiButton size="sm" variant="ghost" @click="emit('copy-json')">{{ copied ? t.cvActionCopied : t.cvActionCopyJson }}</UiButton>
      <UiButton size="sm" variant="ghost" @click="emit('download-sample')">{{ t.cvActionSampleJson }}</UiButton>
      <UiButton size="sm" variant="ghost" @click="emit('load-sample')">{{ t.cvActionLoadSample }}</UiButton>
      <UiButton size="sm" variant="ghost" @click="emit('reset-all')">{{ t.cvActionReset }}</UiButton>
      <input ref="importInput" class="cv-hidden-input" type="file" accept="application/json" @change="onImportFileChange" />
    </div>

    <div v-if="validationCount > 0" class="cv-alert cv-alert--warning">
      {{ t.cvValidationPrefix }} {{ validationCount }} {{ t.cvValidationSuffix }}
    </div>
    <div v-if="importError" class="cv-alert cv-alert--error">
      {{ t.cvImportError }}
    </div>
    <div v-if="importSuccess" class="cv-alert cv-alert--success">
      {{ t.cvImportSuccess }}
    </div>

    <div class="cv-stepper">
      <div class="cv-stepper__head">
        <h4>{{ stepTitle }}</h4>
        <p class="text-muted">{{ t.cvStepProgressLabel }} {{ currentStepIndex + 1 }}/{{ totalSteps }}</p>
      </div>

      <div class="cv-stepper__progress">
        <span :style="{ width: progressPercentage }"></span>
      </div>

      <div class="cv-stepper__tabs" role="tablist" :aria-label="t.cvStepNavigationAria">
        <button
          v-for="step in steps"
          :key="step.id"
          class="cv-stepper__tab"
          :class="{ 'cv-stepper__tab--active': activeStep === step.id }"
          type="button"
          role="tab"
          :aria-selected="activeStep === step.id"
          @click="setStep(step.id)"
        >
          <span aria-hidden="true">{{ step.icon }}</span>
          <span>{{ t[step.labelKey] }}</span>
        </button>
      </div>

      <div class="cv-stepper__controls">
        <UiButton size="sm" variant="ghost" :disabled="!canGoPrev" @click="goPrev">{{ t.cvActionPrevStep }}</UiButton>
        <UiButton size="sm" variant="soft" :disabled="!canGoNext" @click="goNext">{{ t.cvActionNextStep }}</UiButton>
      </div>
    </div>

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
              <span>{{ t.cvFontLabel }}</span>
              <select v-model="cv.meta.fontFamily" class="ui-select">
                <option value="inter">Inter</option>
                <option value="roboto">Roboto</option>
                <option value="serif">Serif</option>
              </select>
            </label>

            <label class="tool-field">
              <span>{{ t.languageLabel }}</span>
              <select class="ui-select" :value="cvLanguage" @change="updateCvLanguage">
                <option value="en">{{ t.cvLanguageEnglish }}</option>
                <option value="vi">{{ t.cvLanguageVietnamese }}</option>
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
            <textarea v-model="cv.basics.summary" class="tool-textarea" rows="4" :placeholder="t.cvPlaceholderSummary"></textarea>
          </label>

          <div class="cv-subsection-head">
            <h4>{{ t.cvSectionProfiles }}</h4>
            <UiButton size="sm" variant="soft" @click="addProfile">{{ t.cvAddProfile }}</UiButton>
          </div>

          <div v-if="cv.basics.profiles.length === 0" class="cv-inline-empty">{{ t.cvEmptyProfiles }}</div>

          <div v-for="(profile, profileIndex) in cv.basics.profiles" :key="`profile-${profileIndex}`" class="cv-item-card">
            <div class="cv-form-grid">
              <label class="tool-field">
                <span>{{ t.cvFieldProfilePlatform }}</span>
                <input v-model="profile.network" class="ui-input" :placeholder="t.cvPlaceholderProfilePlatform" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldProfileUrl }}</span>
                <input v-model="profile.url" class="ui-input" :placeholder="t.cvPlaceholderProfileUrl" />
              </label>
            </div>
            <UiButton size="sm" variant="ghost" @click="removeProfile(profileIndex)">{{ t.cvRemove }}</UiButton>
          </div>
        </template>

        <template v-else-if="activeStep === 'work'">
          <h4>{{ t.cvSectionWork }}</h4>
          <div class="cv-subsection-head">
            <p class="text-muted">{{ t.cvWorkHint }}</p>
            <UiButton size="sm" variant="soft" @click="addWork">{{ t.cvAddWork }}</UiButton>
          </div>

          <div v-if="cv.work.length === 0" class="cv-inline-empty">{{ t.cvEmptyWork }}</div>

          <div v-for="(work, workIndex) in cv.work" :key="`work-${workIndex}`" class="cv-item-card">
            <div class="cv-item-card__head">
              <h4>{{ t.cvWorkItemTitle }} #{{ workIndex + 1 }}</h4>
              <UiButton size="sm" variant="ghost" @click="removeWork(workIndex)">{{ t.cvRemove }}</UiButton>
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
                <span>{{ t.cvFieldEndDate }}</span>
                <input v-model="work.endDate" class="ui-input" :placeholder="t.cvPlaceholderEndDate" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldCompanyWebsite }}</span>
                <input v-model="work.url" class="ui-input" :placeholder="t.cvPlaceholderCompanyWebsite" />
              </label>
            </div>

            <label class="tool-field">
              <span>{{ t.cvFieldDescription }}</span>
              <textarea v-model="work.summary" class="tool-textarea" rows="3" :placeholder="t.cvPlaceholderWorkSummary"></textarea>
            </label>

            <div class="cv-subsection-head">
              <h5>{{ t.cvFieldAchievements }}</h5>
              <UiButton size="sm" variant="soft" @click="addStringItem(work.highlights)">{{ t.cvAddAchievement }}</UiButton>
            </div>

            <div v-if="work.highlights.length === 0" class="cv-inline-empty">{{ t.cvEmptyAchievements }}</div>

            <div v-for="(highlight, highlightIndex) in work.highlights" :key="`work-${workIndex}-highlight-${highlightIndex}`" class="cv-inline-row">
              <input v-model="work.highlights[highlightIndex]" class="ui-input" :placeholder="t.cvPlaceholderAchievement" />
              <UiButton size="sm" variant="ghost" @click="removeStringItem(work.highlights, highlightIndex)">{{ t.cvRemove }}</UiButton>
            </div>
          </div>
        </template>

        <template v-else-if="activeStep === 'education'">
          <h4>{{ t.cvSectionEducation }}</h4>
          <div class="cv-subsection-head">
            <p class="text-muted">{{ t.cvEducationHint }}</p>
            <UiButton size="sm" variant="soft" @click="addEducation">{{ t.cvAddEducation }}</UiButton>
          </div>

          <div v-if="cv.education.length === 0" class="cv-inline-empty">{{ t.cvEmptyEducation }}</div>

          <div v-for="(education, educationIndex) in cv.education" :key="`education-${educationIndex}`" class="cv-item-card">
            <div class="cv-item-card__head">
              <h4>{{ t.cvEducationItemTitle }} #{{ educationIndex + 1 }}</h4>
              <UiButton size="sm" variant="ghost" @click="removeEducation(educationIndex)">{{ t.cvRemove }}</UiButton>
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
                <span>{{ t.cvFieldEndDate }}</span>
                <input v-model="education.endDate" class="ui-input" :placeholder="t.cvPlaceholderEndDate" />
              </label>
              <label class="tool-field">
                <span>{{ t.cvFieldSchoolWebsite }}</span>
                <input v-model="education.url" class="ui-input" :placeholder="t.cvPlaceholderSchoolWebsite" />
              </label>
            </div>

            <div class="cv-subsection-head">
              <h5>{{ t.cvFieldCourses }}</h5>
              <UiButton size="sm" variant="soft" @click="addStringItem(education.courses)">{{ t.cvAddCourse }}</UiButton>
            </div>

            <div v-if="education.courses.length === 0" class="cv-inline-empty">{{ t.cvEmptyCourses }}</div>

            <div v-for="(course, courseIndex) in education.courses" :key="`education-${educationIndex}-course-${courseIndex}`" class="cv-inline-row">
              <input v-model="education.courses[courseIndex]" class="ui-input" :placeholder="t.cvPlaceholderCourse" />
              <UiButton size="sm" variant="ghost" @click="removeStringItem(education.courses, courseIndex)">{{ t.cvRemove }}</UiButton>
            </div>
          </div>
        </template>

        <template v-else-if="activeStep === 'skills'">
          <h4>{{ t.cvSectionSkills }}</h4>
          <div class="cv-subsection-head">
            <p class="text-muted">{{ t.cvSkillsHint }}</p>
            <UiButton size="sm" variant="soft" @click="addSkill">{{ t.cvAddSkill }}</UiButton>
          </div>

          <div v-if="cv.skills.length === 0" class="cv-inline-empty">{{ t.cvEmptySkills }}</div>

          <div v-for="(skill, skillIndex) in cv.skills" :key="`skill-${skillIndex}`" class="cv-item-card">
            <div class="cv-item-card__head">
              <h4>{{ t.cvSkillItemTitle }} #{{ skillIndex + 1 }}</h4>
              <UiButton size="sm" variant="ghost" @click="removeSkill(skillIndex)">{{ t.cvRemove }}</UiButton>
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
              <UiButton size="sm" variant="soft" @click="addStringItem(skill.keywords)">{{ t.cvAddKeyword }}</UiButton>
            </div>

            <div v-if="skill.keywords.length === 0" class="cv-inline-empty">{{ t.cvEmptyKeywords }}</div>

            <div v-for="(keyword, keywordIndex) in skill.keywords" :key="`skill-${skillIndex}-keyword-${keywordIndex}`" class="cv-inline-row">
              <input v-model="skill.keywords[keywordIndex]" class="ui-input" :placeholder="t.cvPlaceholderKeyword" />
              <UiButton size="sm" variant="ghost" @click="removeStringItem(skill.keywords, keywordIndex)">{{ t.cvRemove }}</UiButton>
            </div>
          </div>
        </template>

        <template v-else-if="activeStep === 'languages'">
          <h4>{{ t.cvSectionLanguages }}</h4>
          <div class="cv-subsection-head">
            <p class="text-muted">{{ t.cvLanguagesHint }}</p>
            <UiButton size="sm" variant="soft" @click="addLanguage">{{ t.cvAddLanguage }}</UiButton>
          </div>

          <div v-if="cv.languages.length === 0" class="cv-inline-empty">{{ t.cvEmptyLanguages }}</div>

          <div v-for="(language, languageIndex) in cv.languages" :key="`language-${languageIndex}`" class="cv-item-card">
            <div class="cv-item-card__head">
              <h4>{{ t.cvLanguageItemTitle }} #{{ languageIndex + 1 }}</h4>
              <UiButton size="sm" variant="ghost" @click="removeLanguage(languageIndex)">{{ t.cvRemove }}</UiButton>
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
          <h4>{{ t.cvSectionProjects }}</h4>
          <div class="cv-subsection-head">
            <p class="text-muted">{{ t.cvProjectsHint }}</p>
            <UiButton size="sm" variant="soft" @click="addProject">{{ t.cvAddProject }}</UiButton>
          </div>

          <div v-if="cv.projects.length === 0" class="cv-inline-empty">{{ t.cvEmptyProjects }}</div>

          <div v-for="(project, projectIndex) in cv.projects" :key="`project-${projectIndex}`" class="cv-item-card">
            <div class="cv-item-card__head">
              <h4>{{ t.cvProjectItemTitle }} #{{ projectIndex + 1 }}</h4>
              <UiButton size="sm" variant="ghost" @click="removeProject(projectIndex)">{{ t.cvRemove }}</UiButton>
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
                <span>{{ t.cvFieldEndDate }}</span>
                <input v-model="project.endDate" class="ui-input" :placeholder="t.cvPlaceholderEndDate" />
              </label>
            </div>

            <label class="tool-field">
              <span>{{ t.cvFieldDescription }}</span>
              <textarea v-model="project.description" class="tool-textarea" rows="3" :placeholder="t.cvPlaceholderProjectDesc"></textarea>
            </label>

            <div class="cv-subsection-head">
              <h5>{{ t.cvFieldAchievements }}</h5>
              <UiButton size="sm" variant="soft" @click="addStringItem(project.highlights)">{{ t.cvAddAchievement }}</UiButton>
            </div>

            <div v-if="project.highlights.length === 0" class="cv-inline-empty">{{ t.cvEmptyAchievements }}</div>

            <div v-for="(highlight, highlightIndex) in project.highlights" :key="`project-${projectIndex}-highlight-${highlightIndex}`" class="cv-inline-row">
              <input v-model="project.highlights[highlightIndex]" class="ui-input" :placeholder="t.cvPlaceholderAchievement" />
              <UiButton size="sm" variant="ghost" @click="removeStringItem(project.highlights, highlightIndex)">{{ t.cvRemove }}</UiButton>
            </div>
          </div>
        </template>
      </section>
    </Transition>
  </section>
</template>
