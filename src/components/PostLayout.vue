<script setup lang="ts">
import './PostLayout.css'
</script>

<template>
  <section class="post-layout">
    <header class="post-layout__header">
      <p class="post-layout__eyebrow">Bài viết</p>
      <h2 class="post-layout__title">Góc chia sẻ</h2>
      <p class="post-layout__subtitle">
        Nơi mình tổng hợp các bài viết, ghi chú và dự án cá nhân.
      </p>
    </header>

    <div class="post-layout__grid">
      <article class="post-layout__card">
        <h3 class="post-layout__card-title">Chưa có bài viết</h3>
        <p class="post-layout__card-text">
          Nội dung sẽ được cập nhật trong thời gian tới. Hãy quay lại sau nhé.
        </p>
        <div class="post-layout__card-meta">Cập nhật: 2026</div>
      </article>
      <article class="post-layout__card post-layout__card--ghost">
        <div class="post-layout__placeholder">
          <span class="post-layout__placeholder-icon">✍️</span>
          <p class="post-layout__placeholder-text">Draft đang được chuẩn bị.</p>
        </div>
      </article>
    </div>
  </section>
</template>
