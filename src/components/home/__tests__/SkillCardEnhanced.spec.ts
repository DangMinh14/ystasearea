import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkillCardEnhanced from '../SkillCardEnhanced.vue'

describe('SkillCardEnhanced', () => {
  it('renders category title, wrapped skill items, and clear 5-dot indicators', () => {
    const wrapper = mount(SkillCardEnhanced, {
      props: {
        category: {
          id: 'frontend',
          title: 'Frontend Development',
          items: [
            { id: 'ts', label: 'TypeScript', iconClass: 'fa-brands fa-js', level: 4 },
            { id: 'vue', label: 'Vue', iconClass: 'fa-brands fa-vuejs', level: 5 },
            { id: 'css', label: 'CSS', iconClass: 'fa-brands fa-css3-alt', level: 3 },
          ],
        },
      },
    })

    expect(wrapper.text()).toContain('Frontend Development')
    expect(wrapper.findAll('.skill-card-enhanced__item')).toHaveLength(3)
    expect(wrapper.findAll('[data-testid="skill-dot-ts"]')).toHaveLength(5)
    expect(wrapper.findAll('[data-testid="skill-dot-ts"].skill-card-enhanced__dot--active')).toHaveLength(4)
    expect(wrapper.get('[data-testid="skill-level-ts"]').attributes('aria-label')).toBe('Proficiency level: 4 out of 5')
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

    expect(wrapper.get('[data-testid="skill-icon-unknown"]').classes()).toContain('fa-circle-question')
  })
})
