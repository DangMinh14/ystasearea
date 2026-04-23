import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import ExperienceTimeline from '../../components/home/ExperienceTimeline.vue'
import SkillCardEnhanced from '../../components/home/SkillCardEnhanced.vue'
import type { ExperienceNode, SkillCategory } from '../../components/home/types'
import { translations } from '../../content/translations'
import { appShellContextKey, type AppShellContext } from '../../composables/appShellContext'
import HomeView from '../HomeView.vue'

const createShellContext = (): AppShellContext => ({
  locale: ref('en'),
  t: computed(() => translations.en),
  theme: ref('dark'),
  setTheme: vi.fn(),
  changeLocale: vi.fn(),
  quote: ref(null),
  quoteLoading: ref(false),
  quoteError: ref(''),
  catImageUrl: ref(''),
  catLoading: ref(false),
  dogImageUrl: ref(''),
  dogLoading: ref(false),
  refreshCat: vi.fn(async () => {}),
  refreshDog: vi.fn(async () => {}),
})

describe('HomeView portfolio sections integration', () => {
  it('renders ExperienceTimeline and SkillCardEnhanced with normalized data props', () => {
    const wrapper = mount(HomeView, {
      global: {
        provide: {
          [appShellContextKey]: createShellContext(),
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    const experienceTimeline = wrapper.getComponent(ExperienceTimeline)
    const items = experienceTimeline.props('items') as ExperienceNode[]
    expect(items.length).toBeGreaterThan(0)
    expect(items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        company: expect.any(String),
        role: expect.any(String),
        period: expect.any(String),
      }),
    )
    expect(items[0].highlights.length).toBeGreaterThan(0)
    expect(items[0].responsibilities.length).toBeGreaterThan(0)
    expect(items[0].tags.length).toBeGreaterThan(0)
    expect(items[0].metrics.length).toBeGreaterThan(0)

    const skillCards = wrapper.findAllComponents(SkillCardEnhanced)
    expect(skillCards.length).toBeGreaterThan(0)
    const category = skillCards[0].props('category') as SkillCategory
    expect(category).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
      }),
    )
    expect(category.items.length).toBeGreaterThan(0)
    expect(category.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        label: expect.any(String),
      }),
    )
    expect(category.items[0].level).toBeGreaterThanOrEqual(1)
    expect(category.items[0].level).toBeLessThanOrEqual(5)
  })

  it('keeps section wrappers for reveal behavior around portfolio sections', () => {
    const wrapper = mount(HomeView, {
      global: {
        provide: {
          [appShellContextKey]: createShellContext(),
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    const sections = wrapper.findAll('[data-testid^="home-section-"]')
    expect(sections.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.get('[data-testid="home-section-hero"]').classes()).toContain('home-view__section')
    expect(wrapper.get('[data-testid="home-section-work"]').classes()).toContain('home-view__section')
    expect(wrapper.get('[data-testid="home-section-work"]').classes()).toContain('home-view__portfolio')
    expect(wrapper.get('[data-testid="home-section-skills"]').classes()).toContain('home-view__section')
    expect(wrapper.get('[data-testid="home-section-skills"]').classes()).toContain('home-view__portfolio')
    expect(wrapper.find('.home-view__skills-grid').exists()).toBe(true)
  })
})
