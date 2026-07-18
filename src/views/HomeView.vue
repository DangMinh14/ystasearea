<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import ExperienceTimeline from '../components/home/ExperienceTimeline.vue'
import ProfileHero from '../components/home/ProfileHero.vue'
import SkillCardEnhanced from '../components/home/SkillCardEnhanced.vue'
import UiButton from '../components/ui/UiButton.vue'
import type { ExperienceNode, SkillCategory } from '../components/home/types'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'
import { SOCIALS, LINKEDIN_URL, ABOUT, CONTACT } from '../content/profile'
import cvFile from '../assets/documents/CV Nguyen Minh Dang - Software Engineer.pdf'

const shell = inject<AppShellContext>(appShellContextKey)

if (!shell) {
  throw new Error('HomeView requires shell context')
}

const aboutSegments = computed(() => ABOUT[shell.locale.value])

type HomeSectionId = 'about' | 'work' | 'portfolio' | 'skills' | 'education' | 'social'
type RevealPhase = 'hidden' | 'entering' | 'visible'

const sectionLinks = [
  { id: 'work-experience', label: 'Experience' },
  { id: 'portfolio', label: 'Projects' },
  { id: 'technical-skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const experienceItems: ExperienceNode[] = [
  {
    id: 'mantu',
    company: 'Mantu',
    role: 'Associate Software Engineer',
    employmentType: 'Full-time',
    location: 'Ho Chi Minh City, Vietnam',
    period: 'Oct 2024 - Present',
    highlights: [
      'Develop and maintain 7 core systems in the People Management ecosystem.',
      'Migrated APIs from .NET Framework to .NET Core 8 and upgraded EF 4.8 to EF Core for better maintainability.',
      'Optimized SQL queries and improved UI for both existing and new features.',
    ],
    responsibilities: [
      'Maintained ASP.NET Core and MVC web apps for freelancers, newcomers, candidates, and HR teams.',
      'Built and enhanced HR modules such as employee profiles, contracts, and access management.',
      'Collaborated with product and QA to deliver stable sprint releases with better UX quality.',
    ],
    tags: ['ASP.NET Core', 'Vue.js', 'MVC', 'EF Core', '.NET Core 8', 'MS SQL', 'Microservices', 'CI/CD'],
    metrics: ['7 core systems'],
    iconClass: 'fa-solid fa-building',
  },
  {
    id: 'mindx',
    company: 'MindX Technology School',
    role: 'Teacher Assistant',
    employmentType: 'Part-time',
    location: 'Ho Chi Minh City, Vietnam · On-site',
    period: 'Mar 2024 - Sep 2024',
    highlights: [
      'Guided students through hands-on game programming and Scratch projects.',
      'Supported lesson delivery and one-on-one mentoring in the classroom.',
    ],
    responsibilities: [],
    tags: ['Game Programming', 'Scratch', 'Teaching'],
    metrics: [],
    iconClass: 'fa-solid fa-chalkboard-user',
  },
  {
    id: 'fpt-academy',
    company: 'FPT Software Academy',
    role: 'Java Software Engineer',
    employmentType: 'Internship',
    period: 'May 2024 - Jul 2024',
    highlights: [
      'Completed an internship program focused on Java development.',
      'Built RESTful APIs and wrote unit tests, sharpening coding mindset and software development skills.',
    ],
    responsibilities: [],
    tags: ['Java', 'RESTful API', 'Unit Testing'],
    metrics: [],
    iconClass: 'fa-solid fa-graduation-cap',
  },
  {
    id: 'otrafy',
    company: 'Otrafy',
    role: 'Quality Assurance Intern',
    employmentType: 'Internship',
    location: 'Remote',
    period: 'Jul 2023 - Oct 2023',
    highlights: [
      'Wrote and executed test cases to safeguard product quality.',
      'Collaborated on QA processes to support reliable releases.',
    ],
    responsibilities: [],
    tags: ['Test Cases', 'Quality Assurance', 'Manual Testing'],
    metrics: [],
    iconClass: 'fa-solid fa-clipboard-check',
  },
]

const skillCategories: SkillCategory[] = [
  {
    id: 'programming-languages',
    title: 'Programming Languages',
    items: [
      { id: 'csharp', label: 'C#', iconClass: 'devicon-csharp-plain', level: 5 },
      { id: 'javascript', label: 'JavaScript', iconClass: 'devicon-javascript-plain', level: 5 },
      { id: 'typescript', label: 'TypeScript', iconClass: 'devicon-typescript-plain', level: 5 },
      { id: 'python', label: 'Python', iconClass: 'devicon-python-plain', level: 4 },
      { id: 'java', label: 'Java', iconClass: 'devicon-java-plain', level: 4 },
    ],
  },
  {
    id: 'frameworks-platforms',
    title: 'Frameworks / Platforms',
    items: [
      { id: 'aspnet-core', label: 'ASP.NET Core', iconClass: 'devicon-dotnetcore-plain', level: 5 },
      { id: 'vue3', label: 'Vue 3', iconClass: 'devicon-vuejs-plain', level: 5 },
      { id: 'vite', label: 'Vite', iconClass: 'devicon-vitejs-plain', level: 5 },
      { id: 'spring-boot', label: 'Java Spring Boot', iconClass: 'devicon-spring-plain', level: 3 },
    ],
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    items: [
      { id: 'mssql', label: 'MS SQL Server', iconClass: 'devicon-microsoftsqlserver-plain', level: 5 },
      { id: 'mysql', label: 'MySQL', iconClass: 'devicon-mysql-plain', level: 4 },
      { id: 'postgresql', label: 'PostgreSQL', iconClass: 'devicon-postgresql-plain', level: 4 },
    ],
  },
  {
    id: 'version-control',
    title: 'Version Control Skills',
    items: [
      { id: 'git', label: 'Git', iconClass: 'devicon-git-plain', level: 5 },
      { id: 'azure-devops', label: 'Azure DevOps', iconClass: 'devicon-azuredevops-plain', level: 4 },
    ],
  },
  {
    id: 'methodologies',
    title: 'Development Methodologies',
    items: [
      { id: 'scrum', label: 'Scrum', iconClass: 'devicon-jira-plain', level: 5 },
      { id: 'agile', label: 'Agile', iconClass: 'devicon-trello-plain', level: 5 },
    ],
  },
]

const revealSectionIds: HomeSectionId[] = ['about', 'work', 'portfolio', 'skills', 'education', 'social']
const sectionPhase = ref<Record<HomeSectionId, RevealPhase>>({
  about: 'hidden',
  work: 'hidden',
  portfolio: 'hidden',
  skills: 'hidden',
  education: 'hidden',
  social: 'hidden',
})
const sectionRefs: Partial<Record<HomeSectionId, HTMLElement>> = {}
const revealTimers = new Map<HomeSectionId, ReturnType<typeof setTimeout>>()
let observer: IntersectionObserver | null = null

const setSectionRef = (id: HomeSectionId, element: Element | ComponentPublicInstance | null) => {
  if (element && typeof (element as HTMLElement).tagName === 'string') {
    sectionRefs[id] = element as HTMLElement
    return
  }

  delete sectionRefs[id]
}

const revealSection = (id: HomeSectionId) => {
  if (sectionPhase.value[id] !== 'hidden') {
    return
  }

  sectionPhase.value = {
    ...sectionPhase.value,
    [id]: 'entering',
  }

  if (typeof window === 'undefined') {
    sectionPhase.value = {
      ...sectionPhase.value,
      [id]: 'visible',
    }
    return
  }

  const timer = window.setTimeout(() => {
    sectionPhase.value = {
      ...sectionPhase.value,
      [id]: 'visible',
    }
    revealTimers.delete(id)
  }, 70)

  revealTimers.set(id, timer)
}

const sectionRevealClass = (id: HomeSectionId) => ({
  'home-view__section--entering': sectionPhase.value[id] === 'entering' || sectionPhase.value[id] === 'visible',
  'home-view__section--visible': sectionPhase.value[id] === 'visible',
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

        const id = entry.target.getAttribute('data-section-id') as HomeSectionId | null

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
  revealTimers.forEach((timer) => clearTimeout(timer))
  revealTimers.clear()
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
        :section-links="sectionLinks"
        :available="shell.t.value.heroAvailable"
        :location="shell.t.value.heroLocation"
        :experience-years="shell.t.value.heroExperienceYears"
        :experience-label="shell.t.value.heroExperienceLabel"
      />
    </section>

    <section
      id="about"
      data-testid="home-section-about"
      data-section-id="about"
      class="home-view__section home-view__simple-card home-view__card-hover"
      :class="sectionRevealClass('about')"
      :ref="(element) => setSectionRef('about', element)"
    >
      <header class="home-view__section-header home-view__reveal-header">
        <h2>{{ shell.t.value.aboutTitle }}</h2>
      </header>
      <p class="home-view__about home-view__reveal-content">
        <template v-for="(seg, i) in aboutSegments" :key="i"><mark v-if="seg.hl" class="home-view__hl">{{ seg.t }}</mark><span v-else>{{ seg.t }}</span></template>
      </p>
    </section>

    <section
      id="work-experience"
      data-testid="home-section-work"
      data-section-id="work"
      class="home-view__section home-view__portfolio home-view__card-hover"
      :class="sectionRevealClass('work')"
      :ref="(element) => setSectionRef('work', element)"
    >
      <header data-testid="home-section-work-header" class="home-view__section-header home-view__reveal-header">
        <h2>Work Experience</h2>
      </header>
      <div data-testid="home-section-work-content" class="home-view__reveal-content">
        <ExperienceTimeline :items="experienceItems" />
      </div>
    </section>

    <section
      id="portfolio"
      data-testid="home-section-portfolio"
      data-section-id="portfolio"
      class="home-view__section home-view__simple-card home-view__card-hover"
      :class="sectionRevealClass('portfolio')"
      :ref="(element) => setSectionRef('portfolio', element)"
    >
      <header class="home-view__section-header home-view__reveal-header">
        <p class="text-eyebrow">Selected work</p>
        <h2>Featured Projects</h2>
      </header>
      <div class="home-view__feature-list home-view__reveal-content">
        <article class="home-view__feature">
          <h3>Ystase Area - Personal Productivity &amp; Tooling Platform</h3>
          <p>
            Built a personal platform using Vue 3 + TypeScript with a suite of productivity tools including a multilingual
            CV builder and preview-to-PDF consistency.
          </p>
          <div class="home-view__feature-tags">
            <span>Vue 3</span><span>TypeScript</span><span>Vite</span><span>Tailwind CSS v4</span>
          </div>
          <div class="home-view__feature-links">
            <a href="https://github.com/DangMinh14/ystasearea" target="_blank" rel="noreferrer">GitHub Repo</a>
            <a href="https://www.ystasearea.space" target="_blank" rel="noreferrer">Live Site</a>
          </div>
        </article>

        <article class="home-view__feature">
          <h3>Ystask - Personal Productivity &amp; Tooling Platform</h3>
          <p>
            Full-stack platform combining 13 browser-only instant tools with habit, expense, and job-application trackers.
            Vue 3 + TypeScript frontend with a neo-brutalism design system; ASP.NET Core 10 REST API with EF Core 10,
            JWT auth with rotating refresh tokens, and PostgreSQL on Neon, deployed via Docker on Render.
          </p>
          <div class="home-view__feature-tags">
            <span>Vue 3</span><span>TypeScript</span><span>ASP.NET Core 10</span><span>EF Core 10</span>
            <span>PostgreSQL</span><span>Docker</span>
          </div>
          <div class="home-view__feature-links">
            <a href="https://github.com/DangMinh14/ystask" target="_blank" rel="noreferrer">GitHub Repo (Frontend)</a>
            <a href="https://github.com/DangMinh14/ystask-api" target="_blank" rel="noreferrer">GitHub Repo (API)</a>
            <a href="https://ystask.vercel.app/" target="_blank" rel="noreferrer">Live Site</a>
          </div>
        </article>

        <article class="home-view__feature">
          <h3>Thé Noir - Full-Stack Commerce Platform</h3>
          <p>
            Dark-luxury landing page and full commerce system for a fictional tea brand: cart, checkout, order history,
            and a 7-panel admin dashboard. Next.js 16 + React 19 frontend with Framer Motion; ASP.NET Core 10 API with
            EF Core 10, JWT auth, PostgreSQL on Neon, Cloudinary image uploads, and Resend transactional email.
          </p>
          <div class="home-view__feature-tags">
            <span>Next.js 16</span><span>React 19</span><span>TypeScript</span><span>ASP.NET Core 10</span>
            <span>EF Core 10</span><span>PostgreSQL</span><span>Cloudinary</span>
          </div>
          <div class="home-view__feature-links">
            <a href="https://github.com/DangMinh14/the-noir" target="_blank" rel="noreferrer">GitHub Repo (Frontend)</a>
            <a href="https://github.com/DangMinh14/the-noir-api" target="_blank" rel="noreferrer">GitHub Repo (API)</a>
            <a href="https://the-noir-seven.vercel.app/" target="_blank" rel="noreferrer">Live Site</a>
          </div>
        </article>
      </div>
    </section>

    <section
      id="technical-skills"
      data-testid="home-section-skills"
      data-section-id="skills"
      class="home-view__section home-view__portfolio home-view__card-hover"
      :class="sectionRevealClass('skills')"
      :ref="(element) => setSectionRef('skills', element)"
    >
      <header class="home-view__section-header home-view__reveal-header">
        <h2>Technical Skills</h2>
      </header>
      <div
        data-testid="home-section-skills-grid"
        class="home-view__skills-grid home-view__reveal-content home-view__reveal-stagger"
      >
        <div
          v-for="(category, index) in skillCategories"
          :key="category.id"
          class="home-view__reveal-item"
          :style="{ '--reveal-index': index }"
        >
          <SkillCardEnhanced :category="category" />
        </div>
      </div>
    </section>

    <section
      id="education"
      data-testid="home-section-education"
      data-section-id="education"
      class="home-view__section home-view__simple-card home-view__card-hover"
      :class="sectionRevealClass('education')"
      :ref="(element) => setSectionRef('education', element)"
    >
      <header class="home-view__section-header home-view__reveal-header">
        <h2>Education</h2>
      </header>
      <article class="home-view__basic-info home-view__reveal-content">
        <h3>Ton Duc Thang University</h3>
        <p>2020 - 2024</p>
        <p>Bachelor | Computer Network and Data Communication</p>
      </article>
    </section>

    <section
      id="contact"
      data-testid="home-section-social"
      data-section-id="social"
      class="home-view__section home-view__simple-card home-view__card-hover home-view__contact"
      :class="sectionRevealClass('social')"
      :ref="(element) => setSectionRef('social', element)"
    >
      <header class="home-view__section-header home-view__reveal-header">
        <h2>{{ shell.t.value.contactTitle }}</h2>
        <p class="text-muted home-view__contact-text">{{ shell.t.value.contactText }}</p>
        <a class="home-view__contact-email" :href="CONTACT.emailHref">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i>
          {{ CONTACT.email }}
        </a>
      </header>
      <div class="home-view__contact-body home-view__reveal-content">
        <div class="home-view__contact-actions">
          <a :href="LINKEDIN_URL" target="_blank" rel="noreferrer noopener">
            <UiButton size="lg">{{ shell.t.value.contactCtaPrimary }}</UiButton>
          </a>
          <a :href="cvFile" download="CV Nguyen Minh Dang - Software Engineer.pdf">
            <UiButton variant="ghost" size="lg">{{ shell.t.value.contactCtaSecondary }}</UiButton>
          </a>
        </div>
        <div class="home-view__contact-socials" aria-label="Social links">
          <a
            v-for="social in SOCIALS"
            :key="social.id"
            class="home-view__contact-social"
            :href="social.url"
            target="_blank"
            rel="noreferrer noopener"
            :aria-label="social.label"
          >
            <i :class="social.icon" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-view {
  display: grid;
  gap: clamp(var(--space-8), 4.4vw, var(--space-11));
}

.home-view__section {
  --reveal-section-duration: 650ms;
  --reveal-item-duration: 480ms;
  --reveal-stagger-step: 70ms;
  opacity: 0;
  filter: blur(8px);
  pointer-events: none;
  transition:
    opacity var(--reveal-section-duration) cubic-bezier(0.22, 1, 0.36, 1),
    filter var(--reveal-section-duration) cubic-bezier(0.22, 1, 0.36, 1);
}

.home-view__section--visible {
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}

.home-view__portfolio,
.home-view__simple-card {
  display: grid;
  gap: clamp(var(--space-4), 2vw, var(--space-6));
  padding: clamp(var(--space-5), 3vw, var(--space-7));
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-card);
}

.home-view__card-hover {
  transition:
    transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.home-view__card-hover:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--accent-soft);
}

.home-view__portfolio {
  background:
    linear-gradient(136deg, color-mix(in srgb, var(--surface-2) 92%, transparent), color-mix(in srgb, var(--surface-1) 90%, transparent)),
    linear-gradient(16deg, color-mix(in srgb, var(--accent) 7%, transparent), transparent 58%);
}

.home-view__simple-card {
  background: color-mix(in srgb, var(--surface-1) 92%, transparent);
}

.home-view__section-header {
  display: grid;
  gap: var(--space-2);
}

.home-view__reveal-header,
.home-view__reveal-content,
.home-view__reveal-item {
  opacity: 0;
  transform: translateY(16px) scale(0.99);
  filter: blur(5px);
  transition:
    opacity var(--reveal-item-duration) cubic-bezier(0.22, 1, 0.36, 1),
    transform var(--reveal-item-duration) cubic-bezier(0.22, 1, 0.36, 1),
    filter var(--reveal-item-duration) cubic-bezier(0.22, 1, 0.36, 1);
}

.home-view__section--visible .home-view__reveal-header {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: 60ms;
}

.home-view__section--visible .home-view__reveal-content {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: 130ms;
}

.home-view__section--visible .home-view__reveal-stagger .home-view__reveal-item {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  transition-delay: calc(180ms + (var(--reveal-index, 0) * var(--reveal-stagger-step)));
}

.home-view__section-header > h2,
.home-view__feature h3,
.home-view__basic-info h3 {
  margin: 0;
}

.home-view__skills-grid {
  display: grid;
  gap: clamp(var(--space-3), 2.2vw, var(--space-5));
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.home-view__skills-grid:hover :deep(.skill-card-enhanced--interactive) {
  opacity: 0.6;
}

.home-view__skills-grid :deep(.skill-card-enhanced--interactive:hover) {
  opacity: 1;
}

.home-view__feature,
.home-view__basic-info {
  display: grid;
  gap: var(--space-3);
}

.home-view__feature-list {
  display: grid;
  gap: clamp(var(--space-5), 3vw, var(--space-7));
}

.home-view__feature-list .home-view__feature:not(:last-child) {
  padding-bottom: clamp(var(--space-5), 3vw, var(--space-7));
  border-bottom: 1px solid var(--border-subtle);
}

.home-view__feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.home-view__feature-tags > span {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  padding: 0.25rem 0.7rem;
}

.home-view__about {
  font-size: clamp(1.02rem, 1.6vw, 1.2rem);
  line-height: 1.85;
  color: var(--text-secondary);
  max-width: 70ch;
}

.home-view__hl {
  background: none;
  color: var(--accent-color);
  font-weight: 600;
}

.home-view__feature-links,
.home-view__social-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.home-view__feature-links > a,
.home-view__social-grid > a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  background: var(--surface-3);
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: transform var(--motion-base) var(--ease-standard),
    border-color var(--motion-base) var(--ease-standard),
    color var(--motion-base) var(--ease-standard),
    background-color var(--motion-base) var(--ease-standard);
}

.home-view__feature-links > a:hover,
.home-view__social-grid > a:hover {
  transform: translateY(-2px);
  color: var(--accent-color);
  border-color: var(--accent-color);
  background: var(--accent-soft);
}

.home-view__contact-text {
  max-width: 52ch;
  line-height: 1.7;
}

.home-view__contact-email {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--space-1);
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--accent-color);
  width: fit-content;
}

.home-view__contact-email:hover {
  text-decoration: underline;
}

.home-view__contact-email i {
  font-size: 0.85rem;
}

.home-view__contact-body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}

.home-view__contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.home-view__contact-socials {
  display: flex;
  gap: var(--space-2);
  margin-left: auto;
}

.home-view__contact-social {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  color: var(--text-primary);
  font-size: 1.05rem;
  transition: transform var(--motion-base) var(--ease-standard),
    color var(--motion-base) var(--ease-standard),
    border-color var(--motion-base) var(--ease-standard),
    background-color var(--motion-base) var(--ease-standard);
}

.home-view__contact-social:hover {
  transform: translateY(-3px);
  color: var(--accent-color);
  border-color: var(--accent-color);
  background: var(--accent-soft);
}

@media (max-width: 640px) {
  .home-view__contact-socials {
    margin-left: 0;
  }
}

@media (max-width: 767px) {
  .home-view {
    gap: var(--space-8);
  }

  .home-view__portfolio,
  .home-view__simple-card {
    padding: var(--space-4);
    border-radius: var(--radius-lg);
  }

  .home-view__skills-grid {
    grid-template-columns: 1fr;
  }

  .home-view__reveal-header,
  .home-view__reveal-content,
  .home-view__reveal-item {
    transform: translateY(10px) scale(0.995);
  }
}

@media (prefers-reduced-motion: reduce), print {
  .home-view__section,
  .home-view__reveal-header,
  .home-view__reveal-content,
  .home-view__reveal-item {
    opacity: 1;
    filter: none;
    transform: none;
    transition: none;
    pointer-events: auto;
  }

  .home-view__portfolio,
  .home-view__simple-card {
    box-shadow: none;
  }

  .home-view__card-hover {
    transition: none;
    transform: none;
  }

  .home-view__card-hover:hover {
    transform: none;
  }

  .home-view__skills-grid:hover :deep(.skill-card-enhanced--interactive) {
    opacity: 1;
  }
}
</style>
