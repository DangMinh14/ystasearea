<script setup lang="ts">
import { ref } from 'vue'
import UiButton from '../../../components/ui/UiButton.vue'
import UiCard from '../../../components/ui/UiCard.vue'
import UiModal from '../../../components/ui/UiModal.vue'
import UiSectionHeader from '../../../components/ui/UiSectionHeader.vue'
import SnakeGame from './SnakeGame.vue'
import './games.css'

type GameId = 'snake'

type GameItem = {
  id: GameId
  title: string
  description: string
  action: string
}

const games: GameItem[] = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Di chuyển bằng phím mũi tên, ăn mồi để ghi điểm.',
    action: 'Chơi ngay',
  },
]

const isOpen = ref(false)
const activeGame = ref<GameId | null>(null)

const openGame = (id: GameId) => {
  activeGame.value = id
  isOpen.value = true
}
</script>

<template>
  <section class="games">
    <UiSectionHeader eyebrow="Games" title="Game Hub" subtitle="Mini game để thư giãn trong vài phút." />

    <div class="games__grid">
      <UiCard v-for="game in games" :key="game.id" class="games__card">
        <h3>{{ game.title }}</h3>
        <p class="text-muted">{{ game.description }}</p>
        <UiButton class="games__action" @click="openGame(game.id)">{{ game.action }}</UiButton>
      </UiCard>
    </div>

    <UiModal v-model="isOpen" aria-label="Game popup">
      <div class="games__modal-header">
        <div>
          <p class="text-eyebrow">Đang chơi</p>
          <h3>{{ activeGame === 'snake' ? 'Snake Game' : 'Game' }}</h3>
        </div>
        <UiButton variant="ghost" size="sm" @click="isOpen = false">Đóng</UiButton>
      </div>
      <SnakeGame v-if="activeGame === 'snake'" />
    </UiModal>
  </section>
</template>
