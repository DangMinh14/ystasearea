<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import SnakeGame from './SnakeGame.vue'
import './GameHub.css'

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

const closeGame = () => {
  isOpen.value = false
  activeGame.value = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeGame()
  }
}

watch(isOpen, (value) => {
  if (value) {
    document.body.classList.add('has-game-modal')
    window.addEventListener('keydown', handleKeydown)
  } else {
    document.body.classList.remove('has-game-modal')
    window.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.body.classList.remove('has-game-modal')
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="game-hub">
    <header class="game-hub__header">
      <div>
        <h2 class="game-hub__title">Game Hub</h2>
        <p class="game-hub__subtitle">Chọn một game để chơi.</p>
      </div>
    </header>

    <div class="game-hub__list">
      <article v-for="game in games" :key="game.id" class="game-card">
        <div class="game-card__body">
          <h3 class="game-card__title">{{ game.title }}</h3>
          <p class="game-card__text">{{ game.description }}</p>
        </div>
        <button class="game-card__button" type="button" @click="openGame(game.id)">
          {{ game.action }}
        </button>
      </article>
    </div>

    <teleport to="body">
      <div v-if="isOpen" class="game-modal" role="dialog" aria-modal="true" aria-label="Game popup">
        <div class="game-modal__backdrop" @click="closeGame"></div>
        <div class="game-modal__panel" role="document">
          <div class="game-modal__header">
            <div>
              <p class="game-modal__eyebrow">Đang chơi</p>
              <h3 class="game-modal__title">
                {{ activeGame === 'snake' ? 'Snake Game' : 'Game' }}
              </h3>
            </div>
            <button class="game-modal__close" type="button" @click="closeGame">Đóng</button>
          </div>
          <div class="game-modal__content">
            <SnakeGame v-if="activeGame === 'snake'" />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
