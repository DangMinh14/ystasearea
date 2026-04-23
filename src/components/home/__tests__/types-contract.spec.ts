import { describe, expect, it } from 'vitest'
import type { ExperienceNode, SkillCategory } from '../types'

describe('home type contracts', () => {
  it('accepts valid experience node shape', () => {
    const node: ExperienceNode = {
      id: 'mantu',
      company: 'Mantu',
      role: 'Software Engineer',
      period: 'October 2024 - Present',
      highlights: ['Built key HR features'],
      responsibilities: ['Maintained ASP.NET Core apps'],
      tags: ['ASP.NET Core', 'EF Core'],
      metrics: ['7 core systems'],
    }

    expect(node.company).toBe('Mantu')
  })

  it('accepts skill category with 5-level scale', () => {
    const category: SkillCategory = {
      id: 'languages',
      title: 'Programming Languages',
      items: [{ id: 'ts', label: 'TypeScript', iconClass: 'fa-brands fa-js', level: 4 }],
    }

    expect(category.items[0].level).toBe(4)
  })
})