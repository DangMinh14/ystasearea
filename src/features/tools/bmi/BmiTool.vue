<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'

const shell = useAppShellContext()

type Gender = 'male' | 'female'

type BmiRow = {
  id: 'underweight' | 'normal' | 'overweight' | 'obese'
  range: string
  min: number
  max: number | null
  label: string
}

const heightCm = ref('')
const weightKg = ref('')
const gender = ref<Gender>('male')

const bmi = computed(() => {
  const h = Number(heightCm.value)
  const w = Number(weightKg.value)
  if (!h || !w || h <= 0 || w <= 0) return null
  const meters = h / 100
  return w / (meters * meters)
})

const ranges = computed<BmiRow[]>(() => {
  const isMale = gender.value === 'male'

  const normalUpper = isMale ? 24.9 : 23.9
  const overweightUpper = isMale ? 29.9 : 28.9

  return [
    {
      id: 'underweight',
      range: '< 18.5',
      min: Number.NEGATIVE_INFINITY,
      max: 18.5,
      label: shell.t.value.bmiUnderweight,
    },
    {
      id: 'normal',
      range: `18.5 - ${normalUpper}`,
      min: 18.5,
      max: normalUpper,
      label: shell.t.value.bmiNormal,
    },
    {
      id: 'overweight',
      range: `${normalUpper + 0.1} - ${overweightUpper}`,
      min: normalUpper + 0.1,
      max: overweightUpper,
      label: shell.t.value.bmiOverweight,
    },
    {
      id: 'obese',
      range: `> ${overweightUpper}`,
      min: overweightUpper + 0.1,
      max: null,
      label: shell.t.value.bmiObese,
    },
  ]
})

const activeRow = computed(() => {
  if (bmi.value === null) return null

  return (
    ranges.value.find((row) => {
      if (row.max === null) {
        return bmi.value >= row.min
      }
      return bmi.value >= row.min && bmi.value < row.max
    }) ?? null
  )
})

const resultTone = computed(() => {
  if (!activeRow.value) return ''
  return `bmi-tool__result--${activeRow.value.id}`
})
</script>

<template>
  <section class="tool-panel bmi-tool">
    <div class="tool-grid-2">
      <label class="tool-field">
        <span>{{ shell.t.value.bmiHeightLabel }}</span>
        <input v-model="heightCm" class="ui-input" type="number" min="1" placeholder="170" />
      </label>
      <label class="tool-field">
        <span>{{ shell.t.value.bmiWeightLabel }}</span>
        <input v-model="weightKg" class="ui-input" type="number" min="1" placeholder="60" />
      </label>
    </div>

    <div class="tool-field">
      <span>{{ shell.t.value.bmiGenderLabel }}</span>
      <div class="bmi-tool__gender-toggle" role="group" :aria-label="shell.t.value.bmiGenderLabel">
        <button
          type="button"
          class="bmi-tool__gender-option"
          :class="{ 'bmi-tool__gender-option--active': gender === 'male' }"
          :aria-pressed="gender === 'male'"
          @click="gender = 'male'"
        >
          {{ shell.t.value.bmiMale }}
        </button>
        <button
          type="button"
          class="bmi-tool__gender-option"
          :class="{ 'bmi-tool__gender-option--active': gender === 'female' }"
          :aria-pressed="gender === 'female'"
          @click="gender = 'female'"
        >
          {{ shell.t.value.bmiFemale }}
        </button>
      </div>
    </div>

    <div v-if="bmi !== null && activeRow" class="tool-result bmi-tool__result" :class="resultTone">
      <strong>{{ shell.t.value.bmiResult }}: {{ bmi.toFixed(1) }}</strong>
      <span>{{ activeRow.label }}</span>
    </div>
    <p v-else class="text-muted">{{ shell.t.value.bmiNoData }}</p>

    <div class="bmi-tool__table-wrap">
      <table class="bmi-tool__table">
        <thead>
          <tr>
            <th>{{ shell.t.value.bmiRangeHeader }}</th>
            <th>{{ shell.t.value.bmiCategoryHeader }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in ranges"
            :key="row.id"
            :class="{ 'bmi-tool__row--active': activeRow?.id === row.id }"
          >
            <td>{{ row.range }}</td>
            <td>{{ row.label }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.bmi-tool {
  gap: var(--space-4);
}

.bmi-tool__gender-toggle {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  border: 1px solid var(--border-subtle);
  background: var(--surface-3);
  border-radius: var(--radius-pill);
  padding: 4px;
}

.bmi-tool__gender-option {
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  border-radius: var(--radius-pill);
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
}

.bmi-tool__gender-option--active {
  background: var(--surface-2);
  color: var(--text-primary);
  border-color: var(--accent);
}

.bmi-tool__result {
  justify-content: space-between;
}

.bmi-tool__result--underweight {
  border-color: rgba(59, 130, 246, 0.6);
  color: #60a5fa;
}

.bmi-tool__result--normal {
  border-color: rgba(34, 197, 94, 0.6);
  color: #4ade80;
}

.bmi-tool__result--overweight {
  border-color: rgba(249, 115, 22, 0.6);
  color: #fb923c;
}

.bmi-tool__result--obese {
  border-color: rgba(239, 68, 68, 0.65);
  color: #f87171;
}

.bmi-tool__table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.bmi-tool__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 320px;
}

.bmi-tool__table th,
.bmi-tool__table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-subtle);
}

.bmi-tool__table th {
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.bmi-tool__row--active {
  background: var(--surface-3);
  box-shadow: inset 3px 0 0 var(--accent);
}
</style>
