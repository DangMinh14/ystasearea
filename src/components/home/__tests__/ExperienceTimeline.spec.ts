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
  {
    id: 'freelance',
    company: 'Freelance Projects',
    role: 'Full Stack Engineer',
    period: '2021 - 2024',
    highlights: ['Shipped production web apps'],
    responsibilities: ['Delivered end-to-end features'],
    tags: ['Vue'],
    metrics: [],
  },
]

describe('ExperienceTimeline', () => {
  it('renders left spine, node identity markers, and clear role hierarchy', () => {
    const wrapper = mount(ExperienceTimeline, { props: { items } })

    expect(wrapper.find('[data-testid="timeline-spine"]').exists()).toBe(true)
    expect(wrapper.find('.experience-timeline__node').exists()).toBe(true)
    expect(wrapper.find('[data-testid="timeline-node-marker-mantu"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="timeline-role-mantu"]').text()).toBe('Software Engineer')
    expect(wrapper.get('[data-testid="timeline-company-mantu"]').text()).toBe('Mantu')
    expect(wrapper.get('[data-testid="timeline-period-mantu"]').text()).toBe('October 2024 - Present')
  })

  it('keeps responsibilities collapsed by default and expands on click with accessible semantics', async () => {
    const wrapper = mount(ExperienceTimeline, { props: { items } })
    const toggle = wrapper.get('button[data-testid="toggle-responsibilities-mantu"]')
    const regionId = 'responsibilities-mantu'

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('aria-controls')).toBe(regionId)
    expect(wrapper.find(`#${regionId}`).exists()).toBe(false)
    expect(toggle.text()).toBe('Show more')
    expect(wrapper.text()).not.toContain('Maintained ASP.NET Core MVC apps')

    await toggle.trigger('click')

    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(toggle.text()).toBe('Show less')
    expect(wrapper.get(`#${regionId}`).attributes('id')).toBe(regionId)
    expect(wrapper.text()).toContain('Maintained ASP.NET Core MVC apps')
  })

  it('renders tech tags and metrics chips only when data is present', () => {
    const wrapper = mount(ExperienceTimeline, { props: { items } })

    expect(wrapper.findAll('[data-testid="tech-tag-mantu"]')).toHaveLength(2)
    expect(wrapper.findAll('[data-testid="metric-chip-mantu"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-testid="metric-chip-freelance"]')).toHaveLength(0)
  })
})
