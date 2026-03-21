<script setup lang="ts">
import { ref } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'

const shell = useAppShellContext()

const min = ref('1')
const max = ref('100')
const result = ref<number | null>(null)

const generate = () => {
  const from = Number(min.value)
  const to = Number(max.value)

  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    result.value = null
    return
  }

  const low = Math.min(from, to)
  const high = Math.max(from, to)
  result.value = Math.floor(Math.random() * (high - low + 1)) + low
}
</script>

<template>
  <section class="tool-panel">
    <div class="tool-grid-2">
      <label class="tool-field">
        <span>{{ shell.t.value.randomMin }}</span>
        <input v-model="min" class="ui-input" type="number" />
      </label>
      <label class="tool-field">
        <span>{{ shell.t.value.randomMax }}</span>
        <input v-model="max" class="ui-input" type="number" />
      </label>
    </div>

    <UiButton size="sm" @click="generate">{{ shell.t.value.randomGenerate }}</UiButton>

    <div class="tool-result">
      <strong v-if="result !== null">{{ result }}</strong>
      <span v-else class="text-muted">{{ shell.t.value.randomNoResult }}</span>
    </div>
  </section>
</template>
