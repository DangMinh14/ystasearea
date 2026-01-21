<script setup lang="ts">
import './WelcomeScreen.css'

const emit = defineEmits<{ (e: 'enter'): void }>()

type WelcomeProps = {
  badge: string
  title: string
  subtitle: string
}

defineProps<WelcomeProps>()

const handleEnter = () => {
  emit('enter')
}
</script>

<template>
  <section class="welcome" role="button" tabindex="0" @click="handleEnter" @keydown.enter="handleEnter">
    <div class="welcome__card">
      <p class="welcome__badge">{{ badge }}</p>
      <h1 class="welcome__title">{{ title }}</h1>
      <p class="welcome__subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>
