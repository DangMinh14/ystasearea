import { ref } from 'vue'
import { fetchDailyQuote, type QuoteResponse } from '../services/quoteService'

export const useQuote = () => {
  const quote = ref<QuoteResponse | null>(null)
  const quoteLoading = ref(false)
  const quoteError = ref('')

  const loadQuote = async () => {
    quoteLoading.value = true
    quoteError.value = ''

    try {
      quote.value = await fetchDailyQuote()
    } catch (error) {
      quoteError.value = 'error'
      quote.value = null
    } finally {
      quoteLoading.value = false
    }
  }

  return {
    quote,
    quoteLoading,
    quoteError,
    loadQuote,
  }
}
