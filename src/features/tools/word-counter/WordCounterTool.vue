<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'

const shell = useAppShellContext()

const text = ref('')

const lines = computed(() => (text.value ? text.value.split(/\r?\n/).length : 0))
const characters = computed(() => text.value.length)
const words = computed(() => {
  const matches = text.value.trim().match(/\S+/g)
  return matches ? matches.length : 0
})
</script>

<template>
  <section class="tool-panel">
    <label class="tool-field">
      <span>{{ shell.t.value.wordInputLabel }}</span>
      <textarea
        v-model="text"
        class="tool-textarea"
        rows="9"
        :placeholder="shell.t.value.wordPlaceholder"
      ></textarea>
    </label>

    <div class="tool-stats">
      <div class="tool-stat">
        <span>{{ shell.t.value.wordWords }}</span>
        <strong>{{ words }}</strong>
      </div>
      <div class="tool-stat">
        <span>{{ shell.t.value.wordCharacters }}</span>
        <strong>{{ characters }}</strong>
      </div>
      <div class="tool-stat">
        <span>{{ shell.t.value.wordLines }}</span>
        <strong>{{ lines }}</strong>
      </div>
    </div>
  </section>
</template>
