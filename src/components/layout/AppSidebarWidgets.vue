<script setup lang="ts">
import UiCard from '../ui/UiCard.vue'
import UiButton from '../ui/UiButton.vue'
import UiSkeleton from '../ui/UiSkeleton.vue'

defineProps<{
  quoteTitle: string
  quoteLoadingText: string
  quoteErrorText: string
  quote: { content: string; author: string } | null
  quoteLoading: boolean
  quoteError: string
  catTitle: string
  catButton: string
  catLoadingText: string
  catImageUrl: string
  catLoading: boolean
  dogTitle: string
  dogButton: string
  dogLoadingText: string
  dogImageUrl: string
  dogLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'refresh-cat'): void
  (e: 'refresh-dog'): void
}>()
</script>

<template>
  <aside class="app-sidebar">
    <UiCard>
      <div class="app-sidebar__section">
        <h3>{{ quoteTitle }}</h3>
        <p v-if="quoteLoading" class="text-muted">{{ quoteLoadingText }}</p>
        <p v-else-if="quoteError" class="text-muted">{{ quoteErrorText }}</p>
        <blockquote v-else-if="quote" class="app-sidebar__quote">
          <p>“{{ quote.content }}”</p>
          <footer>— {{ quote.author }}</footer>
        </blockquote>
      </div>
    </UiCard>

    <UiCard>
      <div class="app-sidebar__section">
        <div class="app-sidebar__pet-head">
          <h3>{{ catTitle }}</h3>
          <UiButton variant="ghost" size="sm" @click="emit('refresh-cat')">{{ catButton }}</UiButton>
        </div>
        <p v-if="catLoading" class="text-muted">{{ catLoadingText }}</p>
        <UiSkeleton v-else-if="!catImageUrl" variant="block" />
        <img v-else class="app-sidebar__pet-image" :src="catImageUrl" alt="Random cat" loading="lazy" />
      </div>
    </UiCard>

    <UiCard>
      <div class="app-sidebar__section">
        <div class="app-sidebar__pet-head">
          <h3>{{ dogTitle }}</h3>
          <UiButton variant="ghost" size="sm" @click="emit('refresh-dog')">{{ dogButton }}</UiButton>
        </div>
        <p v-if="dogLoading" class="text-muted">{{ dogLoadingText }}</p>
        <UiSkeleton v-else-if="!dogImageUrl" variant="block" />
        <img v-else class="app-sidebar__pet-image" :src="dogImageUrl" alt="Random dog" loading="lazy" />
      </div>
    </UiCard>
  </aside>
</template>
