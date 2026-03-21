<script setup lang="ts">
import './ui.css'

defineProps<{
  modelValue: string
  label?: string
  options: Array<{ value: string; label: string }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label>
    <span v-if="label" class="text-muted">{{ label }}</span>
    <select class="ui-select" :value="modelValue" @change="onChange">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>
