<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import UiButton from '../../../components/ui/UiButton.vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'
import ToolsSidebar from '../components/ToolsSidebar.vue'
import { toolRegistry, type ToolId } from '../config/toolRegistry'
import '../components/tools-shared.css'
import './tools-layout.css'

const shell = useAppShellContext()
const route = useRoute()

const sidebarOpen = ref(false)

const activeToolId = computed<ToolId | ''>(() => {
  const candidate = route.meta.toolId
  if (typeof candidate !== 'string') {
    return ''
  }

  const found = toolRegistry.find((tool) => tool.id === candidate)
  return found ? found.id : ''
})

const activeTool = computed(() => toolRegistry.find((tool) => tool.id === activeToolId.value) ?? null)

const pageTitle = computed(() => {
  if (!activeTool.value) {
    return shell.t.value.toolsPageTitle
  }

  return shell.t.value[activeTool.value.titleKey]
})

const pageSubtitle = computed(() => {
  if (!activeTool.value) {
    return shell.t.value.toolsPageSubtitle
  }

  return shell.t.value[activeTool.value.descriptionKey]
})

const breadcrumbCurrent = computed(() => {
  if (!activeTool.value) {
    return shell.t.value.toolsSidebarAllTools
  }

  return shell.t.value[activeTool.value.titleKey]
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

watch(
  () => route.fullPath,
  () => {
    closeSidebar()
  }
)
</script>

<template>
  <section class="tools-layout">
    <header class="tools-layout__header ui-card">
      <div class="tools-layout__header-content">
        <p class="text-eyebrow">{{ shell.t.value.toolsPageEyebrow }}</p>
        <h2>{{ pageTitle }}</h2>
        <p class="text-muted">{{ pageSubtitle }}</p>
      </div>

      <div class="tools-layout__header-actions">
        <p class="tools-layout__breadcrumb" :aria-label="shell.t.value.toolsBreadcrumbAria">
          {{ shell.t.value.toolsPageTitle }} / {{ breadcrumbCurrent }}
        </p>
        <UiButton class="tools-layout__menu-btn" variant="ghost" size="sm" :aria-label="shell.t.value.toolsMenuOpen" @click="toggleSidebar">
          {{ sidebarOpen ? shell.t.value.toolsMenuClose : shell.t.value.toolsMenuOpen }}
        </UiButton>
      </div>
    </header>

    <div class="tools-layout__body">
      <ToolsSidebar :open="sidebarOpen" :active-tool-id="activeToolId" @close="closeSidebar" />
      <button
        v-if="sidebarOpen"
        class="tools-layout__backdrop"
        type="button"
        :aria-label="shell.t.value.toolsMenuClose"
        @click="closeSidebar"
      ></button>

      <main class="tools-layout__main">
        <RouterView v-slot="{ Component, route: currentRoute }">
          <Transition name="tools-route" mode="out-in">
            <article :key="currentRoute.fullPath" class="tools-layout__surface ui-card">
              <component :is="Component" />
            </article>
          </Transition>
        </RouterView>
      </main>
    </div>
  </section>
</template>
