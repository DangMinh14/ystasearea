<script setup>
const hello = () => {
  alert('Xin chào từ ystasearea.space!')
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <p class="badge">🚀 ystasearea.space</p>
      <h1>Website đầu tiên của mình</h1>
      <p class="subtitle">Vue 3 UI/UX tối giản, sẵn sàng deploy lên Vercel.</p>
      <button class="primary" type="button" @click="hello">Click me</button>
    </section>
  </main>
</template>
