import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'

type SortMode = 'asc' | 'desc'

type WheelPickerOptions = {
  errorMin: Ref<string>
  errorMax: Ref<string>
}

const normalize = (value: number) => {
  const twoPi = Math.PI * 2
  return ((value % twoPi) + twoPi) % twoPi
}

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

const randomUnit = () => {
  const cryptoObj = window.crypto
  if (!cryptoObj || !cryptoObj.getRandomValues) {
    return Math.random()
  }

  const values = new Uint32Array(1)
  cryptoObj.getRandomValues(values)
  return values[0] / 0xffffffff
}

export const useWheelPicker = ({ errorMin, errorMax }: WheelPickerOptions) => {
  const namesText = ref('Alice\nBob\nCharlie')
  const rotation = ref(0)
  const spinning = ref(false)
  const winner = ref<string | null>(null)
  const history = ref<string[]>([])
  const highlightedIndex = ref<number | null>(null)
  const resultModalOpen = ref(false)
  const canvasRef = ref<HTMLCanvasElement | null>(null)

  let frameId = 0
  let popupTimer = 0

  const names = computed(() => {
    return namesText.value
      .split('\n')
      .map((name) => name.trim())
      .filter(Boolean)
      .slice(0, 200)
  })

  const count = computed(() => names.value.length)

  const error = computed(() => {
    if (count.value < 2) {
      return errorMin.value
    }

    if (namesText.value.split('\n').filter((item) => item.trim()).length > 200) {
      return errorMax.value
    }

    return ''
  })

  const canSpin = computed(() => !error.value && !spinning.value)

  const palette = computed(() => {
    return names.value.map((_, index) => {
      const hue = (index * 360) / Math.max(names.value.length, 1)
      return `hsl(${hue}deg 72% 52%)`
    })
  })

  const drawWheel = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const radius = Math.min(width, height) / 2 - 8
    const centerX = width / 2
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)

    if (!names.value.length) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
      return
    }

    const segmentAngle = (Math.PI * 2) / names.value.length

    names.value.forEach((name, index) => {
      const startAngle = index * segmentAngle + rotation.value - Math.PI / 2
      const endAngle = startAngle + segmentAngle
      const isWinnerSegment = highlightedIndex.value === index

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = palette.value[index]
      ctx.fill()

      if (isWinnerSegment) {
        ctx.save()
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 4
        ctx.shadowBlur = 20
        ctx.shadowColor = 'rgba(255,255,255,0.9)'
        ctx.stroke()
        ctx.restore()
      }

      const textAngle = startAngle + segmentAngle / 2
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(textAngle)
      ctx.fillStyle = '#ffffff'
      ctx.font = isWinnerSegment ? '700 15px "Be Vietnam Pro", sans-serif' : '600 14px "Be Vietnam Pro", sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(name.slice(0, 18), radius - 12, 4)
      ctx.restore()
    })

    ctx.beginPath()
    ctx.arc(centerX, centerY, 24, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(19, 12, 31, 0.95)'
    ctx.fill()
  }

  watch([rotation, names, highlightedIndex], () => {
    drawWheel()
  })

  const shuffleNames = () => {
    const copy = [...names.value]
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(randomUnit() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    namesText.value = copy.join('\n')
    winner.value = null
    highlightedIndex.value = null
  }

  const sortNames = (mode: SortMode) => {
    const sorted = [...names.value].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    namesText.value = (mode === 'asc' ? sorted : sorted.reverse()).join('\n')
    winner.value = null
    highlightedIndex.value = null
  }

  const closeResultModal = () => {
    resultModalOpen.value = false
  }

  const removeWinner = () => {
    if (!winner.value) return

    const copy = [...names.value]
    const index = copy.findIndex((name) => name === winner.value)
    if (index >= 0) {
      copy.splice(index, 1)
    }

    namesText.value = copy.join('\n')
    winner.value = null
    highlightedIndex.value = null
    resultModalOpen.value = false
  }

  const keepWinner = () => {
    resultModalOpen.value = false
  }

  const spin = () => {
    if (!canSpin.value || names.value.length < 2) return

    spinning.value = true
    winner.value = null
    highlightedIndex.value = null
    resultModalOpen.value = false
    window.clearTimeout(popupTimer)

    const from = rotation.value
    const extraTurns = Math.PI * 2 * (5 + randomUnit() * 3)
    const randomOffset = randomUnit() * Math.PI * 2
    const to = from + extraTurns + randomOffset
    const duration = 4600
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutQuint(progress)

      rotation.value = from + (to - from) * eased

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
        return
      }

      rotation.value = normalize(rotation.value)
      spinning.value = false

      const segmentAngle = (Math.PI * 2) / names.value.length
      const index = Math.floor(normalize(-rotation.value) / segmentAngle) % names.value.length
      const selected = names.value[index]

      highlightedIndex.value = index
      winner.value = selected
      history.value = [selected, ...history.value].slice(0, 30)

      popupTimer = window.setTimeout(() => {
        resultModalOpen.value = true
      }, 280)
    }

    frameId = requestAnimationFrame(tick)
  }

  onBeforeUnmount(() => {
    cancelAnimationFrame(frameId)
    window.clearTimeout(popupTimer)
  })

  return {
    canvasRef,
    namesText,
    count,
    error,
    canSpin,
    spinning,
    winner,
    history,
    resultModalOpen,
    shuffleNames,
    sortNames,
    removeWinner,
    keepWinner,
    closeResultModal,
    spin,
    drawWheel,
  }
}
