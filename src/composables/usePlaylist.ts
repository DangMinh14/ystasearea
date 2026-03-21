import { computed, ref } from 'vue'

export type PlaylistVideo = {
  id: string
  title: string
}

export type Mp3Track = {
  title: string
  url: string
}

const playlist: PlaylistVideo[] = [
  { id: '8scL5oJX6CM', title: 'Cigarettes After Sex Playlist' },
  { id: 'tbfumVRH7Ls', title: 'Hoa - Doãn Hoài Nam' },
  { id: 'SO_zCJkZdkY', title: 'Mơ - Doãn Hoài Nam' },
  { id: 'f3jlAJ6CxDo', title: 'Bóng - Doãn Hoài Nam' },
]

const mp3Modules = import.meta.glob('../assets/mp3/*.mp3', { eager: true, as: 'url' })

const mp3Tracks = Object.entries(mp3Modules)
  .map(([path, url]) => {
    const fileName = decodeURIComponent(path.split('/').pop() ?? '')
    const title = fileName.replace(/\.mp3$/i, '').replace(/_/g, ' ').trim()
    return { title, url }
  })
  .sort((a, b) => a.title.localeCompare(b.title)) as Mp3Track[]

export const usePlaylist = () => {
  const currentVideoIndex = ref(0)

  const onNextVideo = () => {
    currentVideoIndex.value = (currentVideoIndex.value + 1) % playlist.length
  }

  const onPrevVideo = () => {
    currentVideoIndex.value = (currentVideoIndex.value - 1 + playlist.length) % playlist.length
  }

  const onSelectVideo = (index: number) => {
    currentVideoIndex.value = index
  }

  const currentVideo = computed(() => playlist[currentVideoIndex.value])

  return {
    playlist,
    currentVideoIndex,
    currentVideo,
    onNextVideo,
    onPrevVideo,
    onSelectVideo,
    mp3Tracks,
  }
}
