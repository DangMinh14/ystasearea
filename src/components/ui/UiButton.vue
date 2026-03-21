<script setup lang="ts">
import './ui.css'

type ButtonVariant = 'primary' | 'ghost' | 'soft'
type ButtonSize = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    ariaLabel?: string
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    ariaLabel: '',
    disabled: false,
  }
)
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${variant}`, `ui-button--${size}`]"
    :type="type"
    :aria-label="ariaLabel || undefined"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
