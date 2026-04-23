import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkillCardEnhanced from '../SkillCardEnhanced.vue'

describe('SkillCardEnhanced', () => {
  it('exposes hover interaction hooks for card and skill items', () => {
    const wrapper = mount(SkillCardEnhanced, {
      props: {
        category: {
          id: 'frontend',
          title: 'Frontend Development',
          items: [{ id: 'ts', label: 'TypeScript', iconClass: 'devicon-typescript-plain', level: 4 }],
        },
      },
    })

    expect(wrapper.get('.skill-card-enhanced').classes()).toContain('skill-card-enhanced--interactive')
    expect(wrapper.get('.skill-card-enhanced__item').classes()).toContain('skill-card-enhanced__item--interactive')
  })

  it('renders category title and skill items without dot indicators', () => {
    const wrapper = mount(SkillCardEnhanced, {
      props: {
        category: {
          id: 'frontend',
          title: 'Frontend Development',
          items: [
            { id: 'ts', label: 'TypeScript', iconClass: 'devicon-typescript-plain', level: 4 },
            { id: 'vue', label: 'Vue', iconClass: 'devicon-vuejs-plain', level: 5 },
            { id: 'css', label: 'CSS', iconClass: 'devicon-css3-plain', level: 3 },
          ],
        },
      },
    })

    expect(wrapper.text()).toContain('Frontend Development')
    expect(wrapper.findAll('.skill-card-enhanced__item')).toHaveLength(3)
    expect(wrapper.findAll('[data-testid="skill-dot-ts"]')).toHaveLength(0)
    expect(wrapper.get('[data-testid="skill-icon-ts"]').classes()).toContain('devicon-typescript-plain')
  })

  it('uses fallback icon when iconClass is missing', () => {
    const wrapper = mount(SkillCardEnhanced, {
      props: {
        category: {
          id: 'misc',
          title: 'Misc',
          items: [{ id: 'unknown', label: 'Unknown Skill', level: 3 }],
        },
      },
    })

    expect(wrapper.get('[data-testid="skill-icon-unknown"]').classes()).toContain('devicon-devicon-plain')
  })
})
