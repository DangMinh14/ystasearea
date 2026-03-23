<script setup lang="ts">
import type { TranslationKeys } from '../../../../content/translations'
import type { CvResume } from '../utils/cv-model'
import { formatRange, nonEmpty, nonEmptyList } from '../utils/cv-format'

defineProps<{
  cv: CvResume
  t: TranslationKeys
}>()
</script>

<template>
  <article class="cv-template cv-template--minimal">
    <header class="cv-head cv-head--minimal">
      <div>
        <h1>{{ cv.basics.name || t.cvPreviewNameFallback }}</h1>
        <p class="cv-role">{{ cv.basics.label || t.cvPreviewTitleFallback }}</p>
      </div>
      <div class="cv-contact-stack">
        <p v-if="nonEmpty(cv.basics.email)">{{ cv.basics.email }}</p>
        <p v-if="nonEmpty(cv.basics.phone)">{{ cv.basics.phone }}</p>
        <p v-if="nonEmpty(cv.basics.url)">{{ cv.basics.url }}</p>
        <p v-if="nonEmpty(cv.basics.location.address)">{{ cv.basics.location.address }}</p>
      </div>
    </header>

    <section class="cv-section" v-if="nonEmpty(cv.basics.summary)">
      <h2>{{ t.cvSectionSummary }}</h2>
      <p>{{ cv.basics.summary }}</p>
    </section>

    <section class="cv-section" v-if="cv.work.length > 0">
      <h2>{{ t.cvSectionWork }}</h2>
      <div class="cv-minimal-item" v-for="(work, index) in cv.work" :key="`work-${index}`" v-show="nonEmpty(work.position) || nonEmpty(work.name)">
        <h3>{{ work.position || t.cvUntitled }}</h3>
        <p>{{ work.name }} · {{ formatRange(work.startDate, work.endDate) }}</p>
        <p v-if="nonEmpty(work.summary)">{{ work.summary }}</p>
        <p v-if="nonEmptyList(work.highlights).length > 0">{{ nonEmptyList(work.highlights).join(' | ') }}</p>
      </div>
    </section>

    <section class="cv-section" v-if="cv.projects.length > 0">
      <h2>{{ t.cvSectionProjects }}</h2>
      <div class="cv-minimal-item" v-for="(project, index) in cv.projects" :key="`project-${index}`" v-show="nonEmpty(project.name)">
        <h3>{{ project.name }}</h3>
        <p>{{ formatRange(project.startDate, project.endDate) }}</p>
        <p v-if="nonEmpty(project.description)">{{ project.description }}</p>
        <p v-if="nonEmpty(project.url)">{{ project.url }}</p>
      </div>
    </section>

    <section class="cv-section cv-grid-2" v-if="cv.education.length > 0 || cv.skills.length > 0 || cv.languages.length > 0">
      <div v-if="cv.education.length > 0">
        <h2>{{ t.cvSectionEducation }}</h2>
        <div
          class="cv-minimal-item"
          v-for="(education, index) in cv.education"
          :key="`education-${index}`"
          v-show="nonEmpty(education.institution) || nonEmpty(education.studyType)"
        >
          <h3>{{ education.institution || t.cvUntitled }}</h3>
          <p>{{ education.studyType }} {{ education.area ? `· ${education.area}` : '' }}</p>
          <p>{{ formatRange(education.startDate, education.endDate) }}</p>
          <p v-if="nonEmpty(education.score)">{{ t.cvFieldGpa }}: {{ education.score }}</p>
        </div>
      </div>

      <div>
        <div v-if="cv.skills.length > 0" class="cv-minimal-side-group">
          <h2>{{ t.cvSectionSkills }}</h2>
          <ul class="cv-pill-list">
            <li v-for="(skill, index) in cv.skills" :key="`skill-${index}`" v-show="nonEmpty(skill.name) || nonEmptyList(skill.keywords).length > 0">
              {{ skill.name || t.cvUntitled }}: {{ nonEmptyList(skill.keywords).join(', ') }}
            </li>
          </ul>
        </div>

        <div v-if="cv.languages.length > 0" class="cv-minimal-side-group">
          <h2>{{ t.cvSectionLanguages }}</h2>
          <ul class="cv-pill-list">
            <li
              v-for="(language, index) in cv.languages"
              :key="`language-${index}`"
              v-show="nonEmpty(language.language) || nonEmpty(language.fluency)"
            >
              {{ language.language || t.cvUntitled }} - {{ language.fluency }}
            </li>
          </ul>
        </div>

        <div v-if="cv.basics.profiles.length > 0" class="cv-minimal-side-group">
          <h2>{{ t.cvSectionProfiles }}</h2>
          <ul class="cv-pill-list">
            <li v-for="(profile, index) in cv.basics.profiles" :key="`profile-${index}`" v-show="nonEmpty(profile.network) || nonEmpty(profile.url)">
              {{ profile.network || t.cvUntitled }}: {{ profile.url }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </article>
</template>
