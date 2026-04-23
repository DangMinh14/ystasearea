<script setup lang="ts">
defineProps<{
  isOpen: boolean
  homeLabel: string
  blogLabel: string
  gamesLabel: string
  toolsLabel: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleNavigate = () => {
  emit('close')
}
</script>

<template>
  <nav class="app-nav" :class="{ 'app-nav--open': isOpen }" aria-label="Primary navigation">
    <RouterLink class="app-nav__link" to="/home" @click="handleNavigate">{{ homeLabel }}</RouterLink>
    <RouterLink class="app-nav__link" to="/blog" @click="handleNavigate">{{ blogLabel }}</RouterLink>
    <RouterLink class="app-nav__link" to="/games" @click="handleNavigate">{{ gamesLabel }}</RouterLink>
    <RouterLink class="app-nav__link" to="/tools" @click="handleNavigate">{{ toolsLabel }}</RouterLink>
  </nav>
</template>
