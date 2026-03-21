<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BlogDetail from '../features/blog/components/BlogDetail.vue'
import { getBlogPostBySlug, getBlogPosts } from '../features/blog/services/blogService'
import type { BlogPost } from '../features/blog/types'
import UiSkeleton from '../components/ui/UiSkeleton.vue'

const route = useRoute()
const post = ref<BlogPost | null>(null)
const loading = ref(true)
const allPosts = ref<BlogPost[]>([])

const relatedPosts = computed(() => {
  if (!post.value) return []
  return allPosts.value.filter((item) => item.slug !== post.value?.slug).slice(0, 2)
})

const loadPost = async (slug: string) => {
  loading.value = true
  post.value = await getBlogPostBySlug(slug)
  allPosts.value = await getBlogPosts()
  loading.value = false
}

watch(
  () => route.params.slug,
  (slug) => {
    loadPost(String(slug))
  },
  { immediate: true }
)
</script>

<template>
  <section>
    <UiSkeleton v-if="loading" variant="block" />
    <BlogDetail v-else :post="post" :related-posts="relatedPosts" />
  </section>
</template>
