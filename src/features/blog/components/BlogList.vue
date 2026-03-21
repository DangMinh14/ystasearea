<script setup lang="ts">
import UiCard from '../../../components/ui/UiCard.vue'
import UiButton from '../../../components/ui/UiButton.vue'
import UiSectionHeader from '../../../components/ui/UiSectionHeader.vue'
import UiEmptyState from '../../../components/ui/UiEmptyState.vue'
import type { BlogPost } from '../types'
import './blog.css'

defineProps<{
  title: string
  subtitle: string
  readMoreLabel: string
  emptyTitle: string
  emptyText: string
  posts: BlogPost[]
}>()
</script>

<template>
  <section class="blog-list">
    <UiSectionHeader eyebrow="Blog" :title="title" :subtitle="subtitle" />

    <UiEmptyState v-if="!posts.length" :title="emptyTitle" :description="emptyText" />

    <div v-else class="blog-list__grid">
      <UiCard v-for="post in posts" :key="post.slug" class="blog-list__card">
        <h3>{{ post.title }}</h3>
        <p class="text-muted">{{ post.excerpt }}</p>
        <div class="blog-list__meta">
          <span>{{ post.publishedAt }}</span>
        </div>
        <div class="blog-list__tags">
          <span v-for="tag in post.tags" :key="tag" class="ui-badge">#{{ tag }}</span>
        </div>
        <RouterLink class="blog-list__link" :to="`/blog/${post.slug}`">
          <UiButton variant="soft" size="sm">{{ readMoreLabel }}</UiButton>
        </RouterLink>
      </UiCard>
    </div>
  </section>
</template>
