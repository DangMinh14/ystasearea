<script setup lang="ts">
import './CategorySelect.css'

type CategoryOption = {
  value: string
  label: string
}

type CategorySelectProps = {
  modelValue: string
  options: CategoryOption[]
  label?: string
  ariaLabel?: string
}

const props = defineProps<CategorySelectProps>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="category-select">
    <span v-if="label" class="category-select__label">{{ label }}</span>
    <select
      class="category-select__field"
      :value="modelValue"
      :aria-label="ariaLabel || label || 'Chọn danh mục'"
      @change="handleChange"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
