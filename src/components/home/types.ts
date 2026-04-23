export type ExperienceNode = {
  id: string
  company: string
  role: string
  period: string
  highlights: string[]
  responsibilities: string[]
  tags: string[]
  metrics: string[]
  avatarLabel?: string
  iconClass?: string
}

export type SkillItem = {
  id: string
  label: string
  iconClass?: string
  level: 1 | 2 | 3 | 4 | 5
}

export type SkillCategory = {
  id: string
  title: string
  items: SkillItem[]
}