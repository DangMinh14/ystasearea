<script setup lang="ts">
import UiButton from '../../../components/ui/UiButton.vue'
import UiCard from '../../../components/ui/UiCard.vue'
import UiErrorState from '../../../components/ui/UiErrorState.vue'
import type { BlogPost } from '../types'
import './blog.css'

defineProps<{
  post: BlogPost | null
  relatedPosts: BlogPost[]
}>()
</script>

<template>
  <section class="blog-detail">
    <UiErrorState
      v-if="!post"
      title="Post not found"
      description="Bài viết bạn đang tìm không tồn tại hoặc đã được di chuyển."
    />

    <template v-else>
      <UiCard>
        <article class="blog-detail">
          <p class="text-eyebrow">{{ post.publishedAt }}</p>
          <h1>{{ post.title }}</h1>
          <p class="blog-detail__content">{{ post.content }}</p>
          <div class="blog-list__tags">
            <span v-for="tag in post.tags" :key="tag" class="ui-badge">#{{ tag }}</span>
          </div>
        </article>
      </UiCard>

      <section class="blog-detail">
        <h2>Related posts</h2>
        <div class="blog-detail__related">
          <UiCard v-for="item in relatedPosts" :key="item.slug" class="blog-detail__related-card">
            <h3>{{ item.title }}</h3>
            <p class="text-muted">{{ item.excerpt }}</p>
            <RouterLink :to="`/blog/${item.slug}`">
              <UiButton variant="soft" size="sm">Read</UiButton>
            </RouterLink>
          </UiCard>
        </div>
      </section>
    </template>
  </section>
</template>
