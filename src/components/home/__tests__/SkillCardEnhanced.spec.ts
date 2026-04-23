import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SkillCardEnhanced from '../SkillCardEnhanced.vue'

describe('SkillCardEnhanced', () => {
  it('renders category title and 5-dot level indicators', () => {
    const wrapper = mount(SkillCardEnhanced, {
      props: {
        category: {
          id: 'languages',
          title: 'Programming Languages',
          items: [{ id: 'ts', label: 'TypeScript', iconClass: 'fa-brands fa-js', level: 4 }],
        },
      },
    })

    expect(wrapper.text()).toContain('Programming Languages')
    expect(wrapper.findAll('[data-testid="skill-dot-ts"]')).toHaveLength(5)
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
