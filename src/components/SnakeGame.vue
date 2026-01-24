<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import './SnakeGame.css'

type Point = {
  x: number
  y: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const isPaused = ref(false)
const isGameOver = ref(false)
const mode = ref<'walls' | 'wrap'>('walls')
const eventMessage = ref('')

const gridSize = 20
const cellSize = 18
const boardSize = gridSize * cellSize
const baseStepMs = 120
let currentStepMs = baseStepMs
let speedUntil = 0

let snake: Point[] = []
let direction: Point = { x: 1, y: 0 }
let nextDirection: Point = { x: 1, y: 0 }
let food: Point = { x: 8, y: 8 }
let animationId = 0
let lastTime = 0
let gameTime = 0
let accumulator = 0
let lastSpawnAttempt = 0
let specialItem: { position: Point; type: 'bonus' | 'slow' | 'speed'; expiresAt: number } | null = null
let eventUntil = 0

const getAvailableCells = () => {
  const available: Point[] = []
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (
        !snake.some((segment) => segment.x === x && segment.y === y) &&
        !(specialItem && specialItem.position.x === x && specialItem.position.y === y) &&
        !(food && food.x === x && food.y === y)
      ) {
        available.push({ x, y })
      }
    }
  }
  return available
}

const placeFood = () => {
  const available = getAvailableCells()
  if (!available.length) return
  const next = available[Math.floor(Math.random() * available.length)]
  food = next
}

const spawnSpecialItem = (time: number) => {
  if (specialItem) return
  const available = getAvailableCells()
  if (!available.length) return
  const roll = Math.random()
  if (roll > 0.25) return
  const types: Array<'bonus' | 'slow' | 'speed'> = ['bonus', 'slow', 'speed']
  const nextType = types[Math.floor(Math.random() * types.length)]
  const position = available[Math.floor(Math.random() * available.length)]
  specialItem = {
    position,
    type: nextType,
    expiresAt: time + 4000,
  }
}

const resetGame = () => {
  snake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ]
  direction = { x: 1, y: 0 }
  nextDirection = { x: 1, y: 0 }
  score.value = 0
  isGameOver.value = false
  eventMessage.value = ''
  eventUntil = 0
  accumulator = 0
  lastTime = 0
  gameTime = 0
  lastSpawnAttempt = 0
  currentStepMs = baseStepMs
  speedUntil = 0
  specialItem = null
  placeFood()
}

const isOppositeDirection = (next: Point) => direction.x + next.x === 0 && direction.y + next.y === 0

const handleKeydown = (event: KeyboardEvent) => {
  const { key } = event
  if (key === ' ') {
    event.preventDefault()
    if (!isGameOver.value) {
      isPaused.value = !isPaused.value
    }
    return
  }

  let desired: Point | null = null
  if (key === 'ArrowUp') desired = { x: 0, y: -1 }
  if (key === 'ArrowDown') desired = { x: 0, y: 1 }
  if (key === 'ArrowLeft') desired = { x: -1, y: 0 }
  if (key === 'ArrowRight') desired = { x: 1, y: 0 }

  if (!desired) return
  event.preventDefault()

  if (!isOppositeDirection(desired)) {
    nextDirection = desired
  }
}

const update = () => {
  direction = nextDirection
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

  if (mode.value === 'wrap') {
    head = {
      x: (head.x + gridSize) % gridSize,
      y: (head.y + gridSize) % gridSize,
    }
  }

  const hitWall = head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize
  const hitSelf = snake.some((segment) => segment.x === head.x && segment.y === head.y)

  if ((mode.value === 'walls' && hitWall) || hitSelf) {
    isGameOver.value = true
    return
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    score.value += 1
    placeFood()
    return
  }

  if (specialItem && head.x === specialItem.position.x && head.y === specialItem.position.y) {
    if (specialItem.type === 'bonus') {
      score.value += 5
      eventMessage.value = 'Ăn bonus +5 điểm!'
      eventUntil = gameTime + 2500
    }
    if (specialItem.type === 'slow') {
      currentStepMs = 180
      speedUntil = gameTime + 5000
      eventMessage.value = 'Làm chậm trong 5 giây!'
      eventUntil = gameTime + 2500
    }
    if (specialItem.type === 'speed') {
      currentStepMs = 80
      speedUntil = gameTime + 5000
      eventMessage.value = 'Tăng tốc trong 5 giây!'
      eventUntil = gameTime + 2500
    }
    specialItem = null
  }

  snake.pop()
}

const draw = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, boardSize, boardSize)
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, boardSize, boardSize)

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)'
  ctx.lineWidth = 1
  for (let i = 0; i <= gridSize; i += 1) {
    const pos = i * cellSize
    ctx.beginPath()
    ctx.moveTo(pos, 0)
    ctx.lineTo(pos, boardSize)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, pos)
    ctx.lineTo(boardSize, pos)
    ctx.stroke()
  }

  ctx.fillStyle = '#f97316'
  ctx.beginPath()
  ctx.arc((food.x + 0.5) * cellSize, (food.y + 0.5) * cellSize, cellSize * 0.35, 0, Math.PI * 2)
  ctx.fill()

  if (specialItem) {
    const colors = {
      bonus: '#facc15',
      slow: '#22c55e',
      speed: '#ef4444',
    }
    ctx.fillStyle = colors[specialItem.type]
    ctx.beginPath()
    ctx.arc(
      (specialItem.position.x + 0.5) * cellSize,
      (specialItem.position.y + 0.5) * cellSize,
      cellSize * 0.32,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#38bdf8' : '#0ea5e9'
    ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2)
  })
}

const loop = (time: number) => {
  animationId = window.requestAnimationFrame(loop)
  if (!lastTime) {
    lastTime = time
  }
  const delta = time - lastTime
  lastTime = time

  if (specialItem && gameTime > specialItem.expiresAt) {
    specialItem = null
  }
  if (eventUntil && gameTime > eventUntil) {
    eventMessage.value = ''
    eventUntil = 0
  }
  if (speedUntil && gameTime > speedUntil) {
    currentStepMs = baseStepMs
    speedUntil = 0
  }

  if (!isPaused.value && !isGameOver.value) {
    gameTime += delta
    accumulator += delta
    if (gameTime - lastSpawnAttempt > 1200) {
      spawnSpecialItem(gameTime)
      lastSpawnAttempt = gameTime
    }
    while (accumulator >= currentStepMs) {
      update()
      accumulator -= currentStepMs
    }
  }

  draw()
}

const togglePause = () => {
  if (!isGameOver.value) {
    isPaused.value = !isPaused.value
  }
}

const restart = () => {
  isPaused.value = false
  resetGame()
}

const setMode = (value: 'walls' | 'wrap') => {
  mode.value = value
  resetGame()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.width = boardSize
    canvas.height = boardSize
  }
  resetGame()
  window.addEventListener('keydown', handleKeydown)
  animationId = window.requestAnimationFrame(loop)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="snake">
    <header class="snake__header">
      <div>
        <h3 class="snake__title">Snake Game</h3>
        <p class="snake__subtitle">Dùng phím mũi tên để di chuyển. Nhấn Space để tạm dừng.</p>
        <div class="snake__modes" role="group" aria-label="Game mode">
          <button
            class="snake__mode"
            :class="{ 'snake__mode--active': mode === 'walls' }"
            type="button"
            @click="setMode('walls')"
          >
            Có tường
          </button>
          <button
            class="snake__mode"
            :class="{ 'snake__mode--active': mode === 'wrap' }"
            type="button"
            @click="setMode('wrap')"
          >
            Không có tường
          </button>
        </div>
      </div>
      <div class="snake__controls">
        <div class="snake__score">
          <span>Score</span>
          <strong>{{ score }}</strong>
        </div>
        <button class="snake__button" type="button" @click="togglePause">
          {{ isPaused ? 'Tiếp tục' : 'Tạm dừng' }}
        </button>
        <button class="snake__button snake__button--ghost" type="button" @click="restart">
          Chơi lại
        </button>
      </div>
    </header>

    <div class="snake__board">
      <canvas ref="canvasRef" class="snake__canvas" aria-label="Snake game"></canvas>
      <p v-if="eventMessage" class="snake__event" aria-live="polite">{{ eventMessage }}</p>
      <div v-if="isGameOver" class="snake__overlay">
        <div class="snake__overlay-card">
          <p class="snake__over-title">Game Over</p>
          <p class="snake__over-text">Điểm của bạn: {{ score }}</p>
          <button class="snake__button" type="button" @click="restart">Chơi lại</button>
        </div>
      </div>
    </div>
  </div>
</template>
