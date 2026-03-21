<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'

const shell = useAppShellContext()

const initialSeconds = ref('60')
const remaining = ref(60)
const running = ref(false)
let timer: number | null = null

const formatted = computed(() => {
  const min = Math.floor(remaining.value / 60)
  const sec = remaining.value % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})

const start = () => {
  if (running.value || remaining.value <= 0) return
  running.value = true
  timer = window.setInterval(() => {
    if (remaining.value <= 0) {
      running.value = false
      if (timer !== null) {
        clearInterval(timer)
      }
      return
    }
    remaining.value -= 1
  }, 1000)
}

const pause = () => {
  running.value = false
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

const reset = () => {
  pause()
  const next = Number(initialSeconds.value)
  remaining.value = Number.isFinite(next) && next > 0 ? Math.floor(next) : 60
}

onBeforeUnmount(() => {
  pause()
})
</script>

<template>
  <section class="tool-panel">
    <label class="tool-field">
      <span>{{ shell.t.value.countdownDuration }}</span>
      <input v-model="initialSeconds" class="ui-input" type="number" min="1" @change="reset" />
    </label>

    <div class="tool-timer">{{ formatted }}</div>

    <div class="tool-actions">
      <UiButton size="sm" @click="start">{{ shell.t.value.countdownStart }}</UiButton>
      <UiButton variant="soft" size="sm" @click="pause">{{ shell.t.value.countdownPause }}</UiButton>
      <UiButton variant="ghost" size="sm" @click="reset">{{ shell.t.value.countdownReset }}</UiButton>
    </div>
  </section>
</template>
