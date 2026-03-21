<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import UiEmptyState from '../../../components/ui/UiEmptyState.vue'
import UiModal from '../../../components/ui/UiModal.vue'
import { useAppShellContext } from '../../../composables/useAppShellContext'
import { useWheelPicker } from './useWheelPicker'
import './wheel-picker.css'

const shell = useAppShellContext()

const errorMin = computed(() => shell.t.value.wheelErrorMin)
const errorMax = computed(() => shell.t.value.wheelErrorMax)

const {
  canvasRef,
  namesText,
  count,
  error,
  canSpin,
  spinning,
  winner,
  history,
  resultModalOpen,
  shuffleNames,
  sortNames,
  removeWinner,
  keepWinner,
  closeResultModal,
  spin,
  drawWheel,
} = useWheelPicker({
  errorMin,
  errorMax,
})

const canvasWrapRef = ref<HTMLElement | null>(null)

const resizeCanvas = () => {
  const wrap = canvasWrapRef.value
  const canvas = canvasRef.value
  if (!wrap || !canvas) return

  const size = Math.max(260, Math.min(460, Math.floor(wrap.clientWidth)))
  canvas.width = size
  canvas.height = size
  drawWheel()
}

onMounted(async () => {
  await nextTick()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <section class="wheel-tool">
    <div class="wheel-tool__controls">
      <label class="wheel-tool__field">
        <span>{{ shell.t.value.wheelNamesLabel }}</span>
        <textarea
          v-model="namesText"
          class="wheel-tool__textarea"
          rows="10"
          :placeholder="shell.t.value.wheelPlaceholder"
        ></textarea>
      </label>

      <div class="wheel-tool__meta">
        <span>{{ shell.t.value.wheelCountLabel }}: {{ count }}</span>
        <span class="wheel-tool__hint">{{ shell.t.value.wheelLimitHint }}</span>
      </div>

      <p v-if="error" class="wheel-tool__error" role="alert">{{ error }}</p>

      <div class="wheel-tool__actions">
        <UiButton variant="soft" size="sm" @click="shuffleNames">{{ shell.t.value.wheelShuffle }}</UiButton>
        <UiButton variant="soft" size="sm" @click="sortNames('asc')">{{ shell.t.value.wheelSortAZ }}</UiButton>
        <UiButton variant="soft" size="sm" @click="sortNames('desc')">{{ shell.t.value.wheelSortZA }}</UiButton>
      </div>
    </div>

    <div class="wheel-tool__stage">
      <div ref="canvasWrapRef" class="wheel-tool__canvas-wrap">
        <canvas ref="canvasRef" class="wheel-tool__canvas" :aria-label="shell.t.value.toolWheelTitle"></canvas>
        <div class="wheel-tool__pointer" aria-hidden="true"></div>
      </div>

      <UiButton class="wheel-tool__spin" :disabled="!canSpin" @click="spin">
        {{ spinning ? shell.t.value.wheelSpinning : shell.t.value.wheelSpin }}
      </UiButton>

      <div class="wheel-tool__history">
        <h3>{{ shell.t.value.wheelHistory }}</h3>
        <UiEmptyState
          v-if="!history.length"
          :title="shell.t.value.wheelHistoryEmptyTitle"
          :description="shell.t.value.wheelHistoryEmptyDesc"
        />
        <ul v-else class="wheel-tool__history-list">
          <li v-for="(item, index) in history" :key="`${item}-${index}`">
            <span class="wheel-tool__history-rank">#{{ index + 1 }}</span>
            <strong>{{ item }}</strong>
          </li>
        </ul>
      </div>
    </div>

    <UiModal
      :model-value="resultModalOpen"
      :aria-label="shell.t.value.wheelResultLabel"
      @update:model-value="closeResultModal"
    >
      <div class="wheel-tool__result-popup">
        <div class="wheel-tool__confetti" :aria-label="shell.t.value.wheelConfettiLabel" aria-hidden="true">
          <span v-for="piece in 18" :key="piece" class="wheel-tool__confetti-piece"></span>
        </div>

        <p class="text-eyebrow">{{ shell.t.value.wheelWinner }}</p>
        <h2 class="wheel-tool__winner-name">{{ winner }}</h2>

        <div class="wheel-tool__winner-actions">
          <UiButton variant="soft" size="sm" @click="removeWinner">{{ shell.t.value.wheelRemoveWinner }}</UiButton>
          <UiButton variant="ghost" size="sm" @click="keepWinner">{{ shell.t.value.wheelKeepWinner }}</UiButton>
          <UiButton size="sm" @click="closeResultModal">{{ shell.t.value.wheelClose }}</UiButton>
        </div>
      </div>
    </UiModal>
  </section>
</template>
