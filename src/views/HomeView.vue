<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import ExperienceTimeline from '../components/home/ExperienceTimeline.vue'
import ProfileHero from '../components/home/ProfileHero.vue'
import SkillCardEnhanced from '../components/home/SkillCardEnhanced.vue'
import type { ExperienceNode, SkillCategory } from '../components/home/types'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'

const shell = inject<AppShellContext>(appShellContextKey)

if (!shell) {
  throw new Error('HomeView requires shell context')
}

type PortfolioSectionId = 'work' | 'skills'

const experienceItems: ExperienceNode[] = [
  {
    id: 'mantu',
    company: 'Mantu',
    role: 'Software Engineer',
    period: 'October 2024 - Present',
    highlights: [
      'Delivered 7 core systems for HR workflows with measurable product stability gains.',
      'Reduced release cycle friction by strengthening architecture and deployment standards.',
    ],
    responsibilities: [
      'Built and maintained ASP.NET Core MVC modules and supporting APIs.',
      'Coordinated with product and QA teams to ship sprint goals with predictable quality.',
    ],
    tags: ['ASP.NET Core', 'Vue', 'TypeScript', 'EF Core'],
    metrics: ['7 core systems'],
  },
  {
    id: 'freelance',
    company: 'Freelance Projects',
    role: 'Full Stack Engineer',
    period: '2021 - 2024',
    highlights: [
      'Developed web apps tailored for small businesses with a product-first approach.',
      'Improved maintainability by introducing reusable UI patterns and typed contracts.',
    ],
    responsibilities: [
      'Delivered end-to-end features from UX implementation to API integrations.',
      'Maintained performance and responsive behavior across desktop and mobile layouts.',
    ],
    tags: ['Vue', 'TypeScript', '.NET', 'REST APIs'],
    metrics: ['10+ shipped features'],
  },
]

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    items: [
      { id: 'vue', label: 'Vue 3', iconClass: 'fa-brands fa-vuejs', level: 5 },
      { id: 'typescript', label: 'TypeScript', iconClass: 'fa-solid fa-code', level: 4 },
      { id: 'css', label: 'CSS / SCSS', iconClass: 'fa-brands fa-css3-alt', level: 4 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    items: [
      { id: 'dotnet', label: '.NET', iconClass: 'fa-solid fa-server', level: 4 },
      { id: 'sql', label: 'SQL', iconClass: 'fa-solid fa-database', level: 4 },
      { id: 'api', label: 'REST API Design', iconClass: 'fa-solid fa-plug', level: 4 },
    ],
  },
  {
    id: 'workflow',
    title: 'Workflow & Tooling',
    items: [
      { id: 'git', label: 'Git', iconClass: 'fa-brands fa-git-alt', level: 4 },
      { id: 'ci', label: 'CI/CD', iconClass: 'fa-solid fa-gears', level: 3 },
      { id: 'testing', label: 'Testing', iconClass: 'fa-solid fa-vial', level: 4 },
    ],
  },
]

const revealSectionIds: PortfolioSectionId[] = ['work', 'skills']
const revealedSections = ref<Record<PortfolioSectionId, boolean>>({
  work: false,
  skills: false,
})
const sectionRefs: Partial<Record<PortfolioSectionId, HTMLElement>> = {}
let observer: IntersectionObserver | null = null

const setSectionRef = (id: PortfolioSectionId, element: Element | ComponentPublicInstance | null) => {
  if (element instanceof HTMLElement) {
    sectionRefs[id] = element
    return
  }

  delete sectionRefs[id]
}

const revealSection = (id: PortfolioSectionId) => {
  revealedSections.value[id] = true
}

const sectionRevealClass = (id: PortfolioSectionId) => ({
  'home-view__section--visible': revealedSections.value[id],
})

onMounted(() => {
  if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
    revealSectionIds.forEach(revealSection)
    return
  }

  observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        const id = entry.target.getAttribute('data-section-id') as PortfolioSectionId | null

        if (!id) {
          return
        }

        revealSection(id)
        observer?.unobserve(entry.target)
      })
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    },
  )

  revealSectionIds.forEach((id) => {
    const section = sectionRefs[id]
    if (section) {
      observer?.observe(section)
    }
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section class="home-view">
    <section data-testid="home-section-hero" class="home-view__section home-view__section--visible">
      <ProfileHero
        :role="shell.t.value.homeRole"
        :name="shell.t.value.homeName"
        :intro="shell.t.value.homeIntro"
        :projects-label="shell.t.value.homeViewProjects"
        :cv-label="shell.t.value.homeViewCv"
        :image-alt="shell.t.value.homeImageAlt"
      />
    </section>

    <section
      data-testid="home-section-work"
      data-section-id="work"
      class="home-view__section home-view__portfolio"
      :class="sectionRevealClass('work')"
      :ref="(element) => setSectionRef('work', element)"
    >
      <header class="home-view__section-header">
        <p class="text-eyebrow">Portfolio</p>
        <h2>Work Experience</h2>
      </header>
      <ExperienceTimeline :items="experienceItems" />
    </section>

    <section
      data-testid="home-section-skills"
      data-section-id="skills"
      class="home-view__section home-view__portfolio"
      :class="sectionRevealClass('skills')"
      :ref="(element) => setSectionRef('skills', element)"
    >
      <header class="home-view__section-header">
        <p class="text-eyebrow">Portfolio</p>
        <h2>Technical Skills</h2>
      </header>
      <div class="home-view__skills-grid">
        <SkillCardEnhanced v-for="category in skillCategories" :key="category.id" :category="category" />
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-view {
  display: grid;
  gap: clamp(var(--space-7), 4vw, var(--space-10));
}

.home-view__section {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 320ms ease, transform 320ms ease;
}

.home-view__section--visible {
  opacity: 1;
  transform: translateY(0);
}

.home-view__portfolio {
  display: grid;
  gap: var(--space-4);
}

.home-view__section-header {
  display: grid;
  gap: var(--space-2);
}

.home-view__section-header > h2 {
  margin: 0;
}

.home-view__skills-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

@media (prefers-reduced-motion: reduce) {
  .home-view__section {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
