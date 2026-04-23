import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ProfileHero from '../ProfileHero.vue'

describe('ProfileHero', () => {
  it('scrolls to portfolio when TechStack button is clicked', async () => {
    const scrollIntoView = vi.fn()
    const getElementById = vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView,
    } as unknown as HTMLElement)

    const wrapper = mount(ProfileHero, {
      props: {
        role: 'Full Stack Engineer',
        name: 'Minh Dang',
        intro: 'Intro text',
        projectsLabel: 'TechStack',
        cvLabel: 'Download CV',
        imageAlt: 'Profile',
        sectionLinks: [
          { id: 'work-experience', label: 'Work Experience' },
          { id: 'portfolio', label: 'Portfolio' },
        ],
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    await wrapper.get('[data-testid="profile-techstack-button"]').trigger('click')

    expect(getElementById).toHaveBeenCalledWith('portfolio')
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    getElementById.mockRestore()
  })

  it('renders section chips for quick scrolling', () => {
    const wrapper = mount(ProfileHero, {
      props: {
        role: 'Full Stack Engineer',
        name: 'Minh Dang',
        intro: 'Intro text',
        projectsLabel: 'TechStack',
        cvLabel: 'Download CV',
        imageAlt: 'Profile',
        sectionLinks: [
          { id: 'work-experience', label: 'Work Experience' },
          { id: 'technical-skills', label: 'Technical Skills' },
          { id: 'education', label: 'Education' },
        ],
      },
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    const chips = wrapper.findAll('[data-testid="profile-section-chip"]')
    expect(chips).toHaveLength(3)
    expect(wrapper.text()).toContain('Work Experience')
    expect(wrapper.text()).toContain('Technical Skills')
    expect(wrapper.text()).toContain('Education')
  })
})
