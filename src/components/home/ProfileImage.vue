<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import profileImage from '../../assets/images/DangHome.jpg'

defineProps<{
  alt: string
}>()

const frameRef = ref<HTMLElement | null>(null)
let allowTilt = false
let raf = 0
let nextRx = 0
let nextRy = 0

const apply = () => {
  raf = 0
  frameRef.value?.style.setProperty('--rx', `${nextRx}deg`)
  frameRef.value?.style.setProperty('--ry', `${nextRy}deg`)
}

const onMove = (event: PointerEvent) => {
  if (!allowTilt || !frameRef.value) return
  const rect = frameRef.value.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width - 0.5
  const py = (event.clientY - rect.top) / rect.height - 0.5
  nextRx = -py * 6
  nextRy = px * 6
  if (!raf) raf = requestAnimationFrame(apply)
}

const onLeave = () => {
  nextRx = 0
  nextRy = 0
  if (!raf) raf = requestAnimationFrame(apply)
}

const onEnter = () => {
  if (typeof window === 'undefined') return
  allowTilt =
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <figure
    class="profile-image"
    @pointerenter="onEnter"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <span class="profile-image__glow" aria-hidden="true"></span>
    <div ref="frameRef" class="profile-image__frame">
      <img :src="profileImage" :alt="alt" loading="eager" />
      <span class="profile-image__ring" aria-hidden="true"></span>
    </div>
  </figure>
</template>

<style scoped>
.profile-image {
  position: relative;
  margin: 0;
  width: min(420px, 100%);
  justify-self: center;
  perspective: 1100px;
}

.profile-image__glow {
  position: absolute;
  inset: -14% -10% -18%;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 40%, var(--accent-soft), transparent 68%);
  filter: blur(24px);
  z-index: 0;
}

.profile-image__frame {
  position: relative;
  z-index: 1;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-strong);
  box-shadow: var(--shadow-card);
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 0.3s var(--ease-standard), box-shadow var(--motion-base) var(--ease-standard);
  will-change: transform;
  animation: float-soft 7s ease-in-out infinite;
}

.profile-image:hover .profile-image__frame {
  box-shadow: var(--shadow-card-hover);
}

.profile-image__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 28%;
}

.profile-image__ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  padding: 1px;
  background: linear-gradient(150deg, color-mix(in srgb, var(--accent-color) 60%, transparent), transparent 45%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@media (prefers-reduced-motion: reduce) {
  .profile-image__frame {
    animation: none;
    transition: none;
  }
}
</style>
