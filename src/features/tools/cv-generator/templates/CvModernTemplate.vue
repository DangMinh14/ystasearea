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
  <article class="cv-template cv-template--modern">
    <header class="cv-head">
      <h1>{{ cv.basics.name || t.cvPreviewNameFallback }}</h1>
      <p class="cv-role">{{ cv.basics.label || t.cvPreviewTitleFallback }}</p>
      <div class="cv-contact-row">
        <span v-if="nonEmpty(cv.basics.email)">{{ cv.basics.email }}</span>
        <span v-if="nonEmpty(cv.basics.phone)">{{ cv.basics.phone }}</span>
        <span v-if="nonEmpty(cv.basics.url)">{{ cv.basics.url }}</span>
        <span v-if="nonEmpty(cv.basics.location.address)">{{ cv.basics.location.address }}</span>
      </div>
    </header>

    <div class="cv-modern-grid">
      <aside class="cv-modern-side">
        <section class="cv-section" v-if="nonEmptyList(cv.basics.profiles.map((item) => item.network + item.url)).length > 0">
          <h2>{{ t.cvSectionProfiles }}</h2>
          <ul class="cv-clean-list">
            <li v-for="(profile, index) in cv.basics.profiles" :key="`profile-${index}`" v-show="nonEmpty(profile.network) || nonEmpty(profile.url)">
              <strong>{{ profile.network || t.cvUntitled }}</strong>
              <p>{{ profile.url }}</p>
            </li>
          </ul>
        </section>

        <section class="cv-section" v-if="cv.skills.length > 0">
          <h2>{{ t.cvSectionSkills }}</h2>
          <ul class="cv-clean-list">
            <li v-for="(skill, index) in cv.skills" :key="`skill-${index}`" v-show="nonEmpty(skill.name) || nonEmptyList(skill.keywords).length > 0">
              <strong>{{ skill.name || t.cvUntitled }}</strong>
              <p v-if="nonEmpty(skill.level)">{{ skill.level }}</p>
              <p>{{ nonEmptyList(skill.keywords).join(' • ') }}</p>
            </li>
          </ul>
        </section>

        <section class="cv-section" v-if="cv.languages.length > 0">
          <h2>{{ t.cvSectionLanguages }}</h2>
          <ul class="cv-clean-list">
            <li
              v-for="(language, index) in cv.languages"
              :key="`language-${index}`"
              v-show="nonEmpty(language.language) || nonEmpty(language.fluency) || nonEmpty(language.certificate || '')"
            >
              <strong>{{ language.language || t.cvUntitled }}</strong>
              <p>{{ language.fluency }}</p>
              <p v-if="nonEmpty(language.certificate || '')">{{ language.certificate }}</p>
            </li>
          </ul>
        </section>
      </aside>

      <main class="cv-modern-main">
        <section class="cv-section" v-if="nonEmpty(cv.basics.summary)">
          <h2>{{ t.cvSectionSummary }}</h2>
          <p>{{ cv.basics.summary }}</p>
        </section>

        <section class="cv-section" v-if="cv.work.length > 0">
          <h2>{{ t.cvSectionWork }}</h2>
          <div class="cv-item" v-for="(work, index) in cv.work" :key="`work-${index}`" v-show="nonEmpty(work.position) || nonEmpty(work.name)">
            <div class="cv-item-head">
              <h3>{{ work.position || t.cvUntitled }}</h3>
              <span>{{ formatRange(work.startDate, work.endDate) }}</span>
            </div>
            <p class="cv-subline">{{ work.name }} <span v-if="nonEmpty(work.url)">• {{ work.url }}</span></p>
            <p v-if="nonEmpty(work.summary)">{{ work.summary }}</p>
            <ul v-if="nonEmptyList(work.highlights).length > 0" class="cv-bullets">
              <li v-for="(highlight, highlightIndex) in nonEmptyList(work.highlights)" :key="`work-${index}-highlight-${highlightIndex}`">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <section class="cv-section" v-if="cv.projects.length > 0">
          <h2>{{ t.cvSectionProjects }}</h2>
          <div class="cv-item" v-for="(project, index) in cv.projects" :key="`project-${index}`" v-show="nonEmpty(project.name)">
            <div class="cv-item-head">
              <h3>{{ project.name }}</h3>
              <span>{{ formatRange(project.startDate, project.endDate) }}</span>
            </div>
            <p class="cv-subline" v-if="nonEmpty(project.url)">{{ project.url }}</p>
            <p v-if="nonEmpty(project.description)">{{ project.description }}</p>
            <ul v-if="nonEmptyList(project.highlights).length > 0" class="cv-bullets">
              <li v-for="(highlight, highlightIndex) in nonEmptyList(project.highlights)" :key="`project-${index}-highlight-${highlightIndex}`">
                {{ highlight }}
              </li>
            </ul>
          </div>
        </section>

        <section class="cv-section" v-if="cv.education.length > 0">
          <h2>{{ t.cvSectionEducation }}</h2>
          <div
            class="cv-item"
            v-for="(education, index) in cv.education"
            :key="`education-${index}`"
            v-show="nonEmpty(education.institution) || nonEmpty(education.studyType)"
          >
            <div class="cv-item-head">
              <h3>{{ education.institution || t.cvUntitled }}</h3>
              <span>{{ formatRange(education.startDate, education.endDate) }}</span>
            </div>
            <p class="cv-subline">
              {{ education.studyType }}
              <span v-if="nonEmpty(education.area)">• {{ education.area }}</span>
              <span v-if="nonEmpty(education.score)">• {{ t.cvFieldGpa }}: {{ education.score }}</span>
            </p>
            <p v-if="nonEmpty(education.url)">{{ education.url }}</p>
            <p v-if="nonEmptyList(education.courses).length > 0">{{ nonEmptyList(education.courses).join(' • ') }}</p>
          </div>
        </section>
      </main>
    </div>
  </article>
</template>
