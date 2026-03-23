<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppShellContext } from '../../../composables/useAppShellContext'
import { getToolPath, toolRegistry, type ToolId } from '../config/toolRegistry'

defineProps<{
  open: boolean
  activeToolId: ToolId | ''
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const shell = useAppShellContext()
const route = useRoute()

const toolNavItems = computed(() =>
  toolRegistry.map((tool) => ({
    ...tool,
    label: shell.t.value[tool.titleKey],
  }))
)

const isOverviewRoute = computed(() => route.path === '/tools')

const closeDrawer = () => {
  emit('close')
}
</script>

<template>
  <aside class="tools-sidebar" :class="{ 'tools-sidebar--open': open }">
    <div class="tools-sidebar__head">
      <p class="text-eyebrow">{{ shell.t.value.toolsSidebarEyebrow }}</p>
      <h3>{{ shell.t.value.toolsSidebarTitle }}</h3>
    </div>

    <nav class="tools-sidebar__nav" :aria-label="shell.t.value.toolsSidebarAria">
      <RouterLink class="tools-sidebar__link" :class="{ 'tools-sidebar__link--active': isOverviewRoute }" to="/tools" @click="closeDrawer">
        <span aria-hidden="true">🧰</span>
        <span>{{ shell.t.value.toolsSidebarAllTools }}</span>
      </RouterLink>

      <RouterLink
        v-for="tool in toolNavItems"
        :key="tool.id"
        class="tools-sidebar__link"
        :class="{ 'tools-sidebar__link--active': activeToolId === tool.id }"
        :to="getToolPath(tool.id)"
        @click="closeDrawer"
      >
        <span aria-hidden="true">{{ tool.icon }}</span>
        <span>{{ tool.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
