<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import BlogList from '../features/blog/components/BlogList.vue'
import { getBlogPosts } from '../features/blog/services/blogService'
import type { BlogPost } from '../features/blog/types'
import UiErrorState from '../components/ui/UiErrorState.vue'
import UiSkeleton from '../components/ui/UiSkeleton.vue'
import { appShellContextKey, type AppShellContext } from '../composables/appShellContext'

const shell = inject<AppShellContext>(appShellContextKey)
if (!shell) {
  throw new Error('BlogListView requires shell context')
}

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  loading.value = true
  error.value = false

  try {
    posts.value = await getBlogPosts()
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section>
    <UiSkeleton v-if="loading" variant="block" />
    <UiErrorState v-else-if="error" title="Unable to load posts" description="Please try again in a moment." />
    <BlogList
      v-else
      :title="shell.t.value.blogTitle"
      :subtitle="shell.t.value.blogSubtitle"
      :read-more-label="shell.t.value.blogReadMore"
      :empty-title="shell.t.value.blogEmptyTitle"
      :empty-text="shell.t.value.blogEmptyText"
      :posts="posts"
    />
  </section>
</template>
