export type WeatherLocation = {
  value: string
  label: string
  lat: number
  lon: number
}

export type WeatherSnapshot = {
  temperature: number
  wind: number
}

export const weatherLocations: WeatherLocation[] = [
  { value: 'hcm', label: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { value: 'hanoi', label: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { value: 'danang', label: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { value: 'cantho', label: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
  { value: 'haiphong', label: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
]

export const fetchWeather = async (locationValue: string): Promise<WeatherSnapshot> => {
  const location = weatherLocations.find((item) => item.value === locationValue)
  if (!location) {
    throw new Error('Invalid weather location')
  }

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(location.lat))
  url.searchParams.set('longitude', String(location.lon))
  url.searchParams.set('current', 'temperature_2m,wind_speed_10m')
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error('Weather request failed')
  }

  const data = (await response.json()) as { current?: { temperature_2m?: number; wind_speed_10m?: number } }
  if (!data.current || data.current.temperature_2m === undefined || data.current.wind_speed_10m === undefined) {
    throw new Error('Invalid weather payload')
  }

  return {
    temperature: data.current.temperature_2m,
    wind: data.current.wind_speed_10m,
  }
}
