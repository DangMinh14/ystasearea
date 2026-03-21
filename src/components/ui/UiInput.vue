<script setup lang="ts">
import './ui.css'

defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <label>
    <span v-if="label" class="text-muted">{{ label }}</span>
    <input class="ui-input" :type="type || 'text'" :value="modelValue" :placeholder="placeholder" @input="onInput" />
  </label>
</template>
