export type QuoteResponse = {
  content: string
  author: string
}

export const fetchDailyQuote = async (): Promise<QuoteResponse> => {
  const response = await fetch('/api/quote')
  if (!response.ok) {
    throw new Error('Quote request failed')
  }

  const data = (await response.json()) as Partial<QuoteResponse> | Array<{ q?: string; a?: string }>

  if (Array.isArray(data)) {
    const first = data[0]
    if (!first?.q) {
      throw new Error('Invalid quote payload')
    }

    return {
      content: first.q,
      author: first.a ?? 'Unknown',
    }
  }

  if (!data.content) {
    throw new Error('Invalid quote payload')
  }

  return {
    content: data.content,
    author: data.author ?? 'Unknown',
  }
}
