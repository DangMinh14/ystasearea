export type Locale = 'vi' | 'en'

type TranslationKeys = {
  welcomeBadge: string
  welcomeTitle: string
  welcomeSubtitle: string
  headerEyebrow: string
  headerTitle: string
  navHome: string
  navPosts: string
  navProjects: string
  navContact: string
  musicTitle: string
  musicText: string
  playerPrev: string
  playerNext: string
  playlistLabel: string
  footerCopy: string
  footerButton: string
  settingsLabel: string
  themeLabel: string
  languageLabel: string
  lightLabel: string
  darkLabel: string
}

export const translations: Record<Locale, TranslationKeys> = {
  vi: {
    welcomeBadge: '✨ Welcome',
    welcomeTitle: 'Blog của Minh Đăng (Estasy)',
    welcomeSubtitle: 'Nhấn vào màn hình để đi vào trang chính thức.',
    headerEyebrow: 'Blog của Minh Đăng (Estasy)',
    headerTitle: 'Trang chính thức',
    navHome: 'Trang chủ',
    navPosts: 'Bài viết',
    navProjects: 'Dự án',
    navContact: 'Liên hệ',
    musicTitle: 'Music corner',
    musicText: 'Trình phát nhạc yêu thích của mình — nghe thử một chút nhé.',
    playerPrev: 'Video trước',
    playerNext: 'Video kế tiếp',
    playlistLabel: 'Danh sách video',
    footerCopy: '© 2026 Minh Đăng (Estasy). All rights reserved.',
    footerButton: 'Gửi lời chào',
    settingsLabel: '⚙️ Settings',
    themeLabel: 'Theme',
    languageLabel: 'Ngôn ngữ',
    lightLabel: 'Light',
    darkLabel: 'Dark',
  },
  en: {
    welcomeBadge: '✨ Welcome',
    welcomeTitle: "Minh Đăng (Estasy)'s Blog",
    welcomeSubtitle: 'Tap the screen to enter the official site.',
    headerEyebrow: "Minh Đăng (Estasy)'s Blog",
    headerTitle: 'Official Home',
    navHome: 'Home',
    navPosts: 'Posts',
    navProjects: 'Projects',
    navContact: 'Contact',
    musicTitle: 'Music corner',
    musicText: 'A simple music player — enjoy a quick listen.',
    playerPrev: 'Previous video',
    playerNext: 'Next video',
    playlistLabel: 'Playlist',
    footerCopy: '© 2026 Minh Đăng (Estasy). All rights reserved.',
    footerButton: 'Say hello',
    settingsLabel: '⚙️ Settings',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    lightLabel: 'Light',
    darkLabel: 'Dark',
  },
}
