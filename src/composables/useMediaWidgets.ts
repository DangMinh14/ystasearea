import { ref } from 'vue'
import { fetchRandomPetImage } from '../services/petsService'

export const useMediaWidgets = () => {
  const catImageUrl = ref('')
  const catLoading = ref(false)
  const dogImageUrl = ref('')
  const dogLoading = ref(false)

  const loadCatImage = async () => {
    catLoading.value = true
    try {
      catImageUrl.value = await fetchRandomPetImage('cat')
    } catch (error) {
      catImageUrl.value = ''
    } finally {
      catLoading.value = false
    }
  }

  const loadDogImage = async () => {
    dogLoading.value = true
    try {
      dogImageUrl.value = await fetchRandomPetImage('dog')
    } catch (error) {
      dogImageUrl.value = ''
    } finally {
      dogLoading.value = false
    }
  }

  return {
    catImageUrl,
    catLoading,
    dogImageUrl,
    dogLoading,
    loadCatImage,
    loadDogImage,
  }
}
