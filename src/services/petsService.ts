export type PetType = 'cat' | 'dog'

export const fetchRandomPetImage = async (type: PetType): Promise<string> => {
  const url = type === 'cat' ? 'https://api.thecatapi.com/v1/images/search' : 'https://dog.ceo/api/breeds/image/random'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`${type} request failed`)
  }

  const data = (await response.json()) as unknown

  if (type === 'cat') {
    if (Array.isArray(data) && data[0] && typeof data[0] === 'object' && 'url' in data[0]) {
      const urlValue = (data[0] as { url?: string }).url
      if (urlValue) {
        return urlValue
      }
    }
    throw new Error('Invalid cat payload')
  }

  if (typeof data === 'object' && data && 'message' in data) {
    const message = (data as { message?: string }).message
    if (message) {
      return message
    }
  }

  throw new Error('Invalid dog payload')
}
