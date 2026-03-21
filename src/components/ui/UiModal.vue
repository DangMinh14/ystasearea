<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import './ui.css'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    closeOnBackdrop?: boolean
    closeOnEsc?: boolean
    ariaLabel: string
  }>(),
  {
    closeOnBackdrop: true,
    closeOnEsc: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const panelRef = ref<HTMLElement | null>(null)
let prevFocused: Element | null = null

const close = () => {
  emit('update:modelValue', false)
}

const onBackdrop = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab' || !panelRef.value) return
  const focusables = panelRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  }

  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.modelValue && props.closeOnEsc && event.key === 'Escape') {
    close()
    return
  }

  if (props.modelValue) {
    trapFocus(event)
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      prevFocused = document.activeElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        panelRef.value?.focus()
      })
      return
    }

    document.body.style.overflow = ''
    if (prevFocused instanceof HTMLElement) {
      prevFocused.focus()
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <teleport to="body">
    <div v-if="modelValue" class="ui-modal" role="dialog" aria-modal="true" :aria-label="ariaLabel">
      <div class="ui-modal__backdrop" @click="onBackdrop"></div>
      <section ref="panelRef" class="ui-modal__panel scrollbar-thin" tabindex="-1">
        <slot />
      </section>
    </div>
  </teleport>
</template>
