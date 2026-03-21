<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import UiCard from '../../../components/ui/UiCard.vue'
import UiButton from '../../../components/ui/UiButton.vue'
import UiModal from '../../../components/ui/UiModal.vue'
import UiSectionHeader from '../../../components/ui/UiSectionHeader.vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'
import WheelPickerTool from '../wheel/WheelPickerTool.vue'
import BmiTool from '../bmi/BmiTool.vue'
import WordCounterTool from '../word-counter/WordCounterTool.vue'
import CountdownTool from '../countdown/CountdownTool.vue'
import RandomNumberTool from '../random-number/RandomNumberTool.vue'
import './tools-hub.css'
import './tools-shared.css'

type ToolDefinition = {
  id: string
  title: string
  description: string
  icon: string
  component: unknown
}

const shell = useAppShellContext()

const tools = computed<ToolDefinition[]>(() => [
  {
    id: 'wheel',
    title: shell.t.value.toolWheelTitle,
    description: shell.t.value.toolWheelDesc,
    icon: '🎡',
    component: WheelPickerTool,
  },
  {
    id: 'bmi',
    title: shell.t.value.toolBmiTitle,
    description: shell.t.value.toolBmiDesc,
    icon: '🫀',
    component: BmiTool,
  },
  {
    id: 'word-counter',
    title: shell.t.value.toolWordCounterTitle,
    description: shell.t.value.toolWordCounterDesc,
    icon: '📝',
    component: WordCounterTool,
  },
  {
    id: 'countdown',
    title: shell.t.value.toolCountdownTitle,
    description: shell.t.value.toolCountdownDesc,
    icon: '⏳',
    component: CountdownTool,
  },
  {
    id: 'random-number',
    title: shell.t.value.toolRandomTitle,
    description: shell.t.value.toolRandomDesc,
    icon: '🎲',
    component: RandomNumberTool,
  },
])

const activeTool = shallowRef<ToolDefinition | null>(null)

const openTool = (toolId: string) => {
  const found = tools.value.find((tool) => tool.id === toolId)
  activeTool.value = found ?? null
}

const closeTool = () => {
  activeTool.value = null
}

const activeToolTitle = computed(() => activeTool.value?.title ?? '')
</script>

<template>
  <section class="tools-hub">
    <UiSectionHeader
      :eyebrow="shell.t.value.toolsPageEyebrow"
      :title="shell.t.value.toolsPageTitle"
      :subtitle="shell.t.value.toolsPageSubtitle"
    />

    <div class="tools-hub__grid">
      <UiCard v-for="tool in tools" :key="tool.id" class="tools-hub__card">
        <span class="tools-hub__icon" aria-hidden="true">{{ tool.icon }}</span>
        <h3>{{ tool.title }}</h3>
        <p class="text-muted">{{ tool.description }}</p>
        <UiButton class="tools-hub__launch" size="sm" @click="openTool(tool.id)">{{ shell.t.value.toolOpen }}</UiButton>
      </UiCard>
    </div>

    <UiModal
      :model-value="Boolean(activeTool)"
      :aria-label="activeToolTitle || shell.t.value.toolModalLabel"
      @update:model-value="closeTool"
    >
      <div v-if="activeTool" class="tools-hub__modal-content">
        <div class="tools-hub__modal-head">
          <div>
            <p class="text-eyebrow">{{ shell.t.value.toolUtilityTag }}</p>
            <h2>{{ activeTool.title }}</h2>
          </div>
          <UiButton variant="ghost" size="sm" @click="closeTool">{{ shell.t.value.toolClose }}</UiButton>
        </div>

        <component :is="activeTool.component" />
      </div>
    </UiModal>
  </section>
</template>
