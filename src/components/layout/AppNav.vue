<script setup lang="ts">
defineProps<{
  isOpen: boolean
  links: Array<{ id: string; label: string }>
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
    <RouterLink
      v-for="link in links"
      :key="link.id"
      class="app-nav__link"
      :to="{ path: '/home', hash: `#${link.id}` }"
      @click="handleNavigate"
    >
      {{ link.label }}
    </RouterLink>
  </nav>
</template>
