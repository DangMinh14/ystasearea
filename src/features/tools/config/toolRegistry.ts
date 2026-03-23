import type { Component } from 'vue'
import type { TranslationKeys } from '../../../content/translations'

export type ToolId = 'wheel' | 'bmi' | 'word-counter' | 'countdown' | 'random-number' | 'cv-generator'

export type ToolRegistryItem = {
  id: ToolId
  routeName: string
  icon: string
  titleKey: keyof TranslationKeys
  descriptionKey: keyof TranslationKeys
  component: () => Promise<{ default: Component }>
}

export const toolRegistry: ToolRegistryItem[] = [
  {
    id: 'wheel',
    routeName: 'tool-wheel',
    icon: '🎡',
    titleKey: 'toolWheelTitle',
    descriptionKey: 'toolWheelDesc',
    component: () => import('../wheel/WheelPickerTool.vue'),
  },
  {
    id: 'bmi',
    routeName: 'tool-bmi',
    icon: '🫀',
    titleKey: 'toolBmiTitle',
    descriptionKey: 'toolBmiDesc',
    component: () => import('../bmi/BmiTool.vue'),
  },
  {
    id: 'word-counter',
    routeName: 'tool-word-counter',
    icon: '📝',
    titleKey: 'toolWordCounterTitle',
    descriptionKey: 'toolWordCounterDesc',
    component: () => import('../word-counter/WordCounterTool.vue'),
  },
  {
    id: 'countdown',
    routeName: 'tool-countdown',
    icon: '⏳',
    titleKey: 'toolCountdownTitle',
    descriptionKey: 'toolCountdownDesc',
    component: () => import('../countdown/CountdownTool.vue'),
  },
  {
    id: 'random-number',
    routeName: 'tool-random-number',
    icon: '🎲',
    titleKey: 'toolRandomTitle',
    descriptionKey: 'toolRandomDesc',
    component: () => import('../random-number/RandomNumberTool.vue'),
  },
  {
    id: 'cv-generator',
    routeName: 'tool-cv-generator',
    icon: '📄',
    titleKey: 'toolCvTitle',
    descriptionKey: 'toolCvDesc',
    component: () => import('../cv-generator/CvGeneratorTool.vue'),
  },
]

export const getToolPath = (toolId: ToolId): string => `/tools/${toolId}`
