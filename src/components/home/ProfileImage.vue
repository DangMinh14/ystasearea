<script setup lang="ts">
import profileImage from '../../assets/images/Dang.jpg'

defineProps<{
  alt: string
}>()
</script>

<template>
  <figure class="profile-image-wrap">
    <div class="circle-bg" aria-hidden="true"></div>
    <img class="profile-image" :src="profileImage" :alt="alt" loading="eager" />
  </figure>
</template>

<style scoped>
.profile-image-wrap {
  position: relative;
  margin: 0;
  width: clamp(420px, 42vw, 480px);
  height: clamp(420px, 42vw, 480px);
  justify-self: end;
  overflow: visible;
}

.circle-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 28%,
    color-mix(in srgb, var(--accent) 70%, #ffffff 30%) 0%,
    color-mix(in srgb, var(--accent) 88%, #090713 12%) 70%
  );
  box-shadow: none;
}

.profile-image {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 132%;
  max-width: none;
  transform: translateX(-50%);
  border-radius: var(--radius-md);
  object-fit: cover;
  box-shadow: none;
  filter: none;
  transition: transform var(--motion-fast) var(--ease-standard);
}

.profile-image-wrap:hover .profile-image {
  transform: translateX(-50%) translateY(-4px);
}

@media (max-width: 1023px) {
  .profile-image-wrap {
    justify-self: start;
    width: clamp(340px, 76vw, 420px);
    height: clamp(340px, 76vw, 420px);
  }
}
</style>
