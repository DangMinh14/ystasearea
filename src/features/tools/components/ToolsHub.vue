<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '../../../components/ui/UiCard.vue'
import UiButton from '../../../components/ui/UiButton.vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'
import { getToolPath, toolRegistry, type ToolId } from '../config/toolRegistry'
import './tools-hub.css'

type ToolCard = {
  id: ToolId
  title: string
  description: string
  icon: string
}

const shell = useAppShellContext()
const router = useRouter()

const tools = computed<ToolCard[]>(() =>
  toolRegistry.map((tool) => ({
    id: tool.id,
    title: shell.t.value[tool.titleKey],
    description: shell.t.value[tool.descriptionKey],
    icon: tool.icon,
  }))
)

const openTool = async (toolId: ToolId) => {
  await router.push(getToolPath(toolId))
}
</script>

<template>
  <section class="tools-hub">
    <div class="tools-hub__grid">
      <UiCard v-for="tool in tools" :key="tool.id" class="tools-hub__card">
        <span class="tools-hub__icon" aria-hidden="true">{{ tool.icon }}</span>
        <h3>{{ tool.title }}</h3>
        <p class="text-muted">{{ tool.description }}</p>
        <UiButton class="tools-hub__launch" size="sm" @click="openTool(tool.id)">{{ shell.t.value.toolOpen }}</UiButton>
      </UiCard>
    </div>
  </section>
</template>
