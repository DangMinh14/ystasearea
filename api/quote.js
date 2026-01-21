export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const quoteResponse = await fetch('https://zenquotes.io/api/random')
    if (!quoteResponse.ok) {
      response.status(quoteResponse.status).json({ error: 'Quote fetch failed' })
      return
    }

    const data = await quoteResponse.json()
    const first = Array.isArray(data) ? data[0] : null
    if (!first?.q) {
      response.status(502).json({ error: 'Invalid quote payload' })
      return
    }

    response.status(200).json({
      content: first.q,
      author: first.a ?? 'Unknown',
    })
  } catch (error) {
    response.status(500).json({ error: 'Unexpected server error' })
  }
}
