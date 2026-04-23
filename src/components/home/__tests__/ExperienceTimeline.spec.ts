import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ExperienceTimeline from '../ExperienceTimeline.vue'

const items = [
  {
    id: 'mantu',
    company: 'Mantu',
    role: 'Software Engineer',
    period: 'October 2024 - Present',
    highlights: ['Developed 7 core systems'],
    responsibilities: ['Maintained ASP.NET Core MVC apps'],
    tags: ['ASP.NET Core', 'EF Core'],
    metrics: ['7 core systems'],
  },
]

describe('ExperienceTimeline', () => {
  it('renders timeline spine, node, and company header', () => {
    const wrapper = mount(ExperienceTimeline, { props: { items } })

    expect(wrapper.find('[data-testid="timeline-spine"]').exists()).toBe(true)
    expect(wrapper.find('.experience-timeline__node').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mantu')
  })

  it('keeps responsibilities collapsed by default and expands on click', async () => {
    const wrapper = mount(ExperienceTimeline, { props: { items } })
    const toggle = wrapper.get('button[data-testid="toggle-responsibilities-mantu"]')
    const regionId = 'responsibilities-mantu'

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('aria-controls')).toBe(regionId)
    expect(wrapper.find(`#${regionId}`).exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Maintained ASP.NET Core MVC apps')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get(`#${regionId}`).attributes('id')).toBe(regionId)
    expect(wrapper.text()).toContain('Maintained ASP.NET Core MVC apps')
  })
})
