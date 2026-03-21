import { ref, watch } from 'vue'
import { fetchWeather, weatherLocations, type WeatherSnapshot } from '../services/weatherService'

export const useWeather = () => {
  const weatherLocation = ref(weatherLocations[0].value)
  const weatherLoading = ref(false)
  const weatherError = ref('')
  const weather = ref<WeatherSnapshot | null>(null)

  const loadWeather = async () => {
    weatherLoading.value = true
    weatherError.value = ''

    try {
      weather.value = await fetchWeather(weatherLocation.value)
    } catch (error) {
      weather.value = null
      weatherError.value = 'error'
    } finally {
      weatherLoading.value = false
    }
  }

  watch(weatherLocation, () => {
    loadWeather()
  })

  return {
    weatherLocations,
    weatherLocation,
    weatherLoading,
    weatherError,
    weather,
    loadWeather,
  }
}
