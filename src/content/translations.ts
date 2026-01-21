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
  dailyQuoteTitle: string
  dailyQuoteLoading: string
  dailyQuoteError: string
  clockTitle: string
  clockTimeLabel: string
  clockDateLabel: string
  clockTimezoneLabel: string
  weatherTitle: string
  weatherLocationLabel: string
  weatherLoading: string
  weatherError: string
  weatherTempLabel: string
  weatherWindLabel: string
  catTitle: string
  catButton: string
  catLoading: string
  dogTitle: string
  dogButton: string
  dogLoading: string
  musicTitle: string
  musicText: string
  playerPrev: string
  playerNext: string
  playlistLabel: string
  footerCopy: string
  footerButton: string
  settingsLabel: string
  themeLabel: string
  themeSelectLabel: string
  languageLabel: string
  lightLabel: string
  darkLabel: string
  christmasLabel: string
  lunarLabel: string
  halloweenLabel: string
}

export const translations: Record<Locale, TranslationKeys> = {
  vi: {
    welcomeBadge: '✨ Welcome',
    welcomeTitle: 'Blog của Minh Đăng (Estasy)',
    welcomeSubtitle: 'Nhấn vào màn hình để đi vào trang chính thức.',
    headerEyebrow: 'Blog của Minh Đăng (Estasy)',
    headerTitle: '',
    navHome: 'Trang chủ',
    navPosts: 'Bài viết',
    navProjects: 'Dự án',
    navContact: 'Liên hệ',
    dailyQuoteTitle: 'Daily quote',
    dailyQuoteLoading: 'Đang tải trích dẫn...',
    dailyQuoteError: 'Không thể tải trích dẫn lúc này.',
    clockTitle: 'Đồng hồ',
    clockTimeLabel: 'Giờ hiện tại',
    clockDateLabel: 'Ngày',
    clockTimezoneLabel: 'Múi giờ',
    weatherTitle: 'Thời tiết',
    weatherLocationLabel: 'Khu vực',
    weatherLoading: 'Đang tải thời tiết...',
    weatherError: 'Không thể tải thời tiết lúc này.',
    weatherTempLabel: 'Nhiệt độ',
    weatherWindLabel: 'Gió',
    catTitle: 'Một chút mèo cho ngày mới',
    catButton: 'Đổi mèo',
    catLoading: 'Mèo đang đến ...',
    dogTitle: 'Một chút chó cho ngày mới',
    dogButton: 'Đổi chó',
    dogLoading: 'Chó đang đến ...',
    musicTitle: 'Music corner',
    musicText: 'Trình phát nhạc yêu thích của mình — nghe thử một chút nhé.',
    playerPrev: 'Video trước',
    playerNext: 'Video kế tiếp',
    playlistLabel: 'Danh sách video',
    footerCopy: '© 2026 Minh Đăng (Estasy). All rights reserved.',
    footerButton: 'Gửi lời chào',
    settingsLabel: '⚙️ Settings',
    themeLabel: 'Theme',
    themeSelectLabel: 'Chọn theme',
    languageLabel: 'Ngôn ngữ',
    lightLabel: 'Light',
    darkLabel: 'Dark',
    christmasLabel: 'Giáng sinh',
    lunarLabel: 'Tết',
    halloweenLabel: 'Halloween',
  },
  en: {
    welcomeBadge: '✨ Welcome',
    welcomeTitle: "Minh Đăng (Estasy)'s Blog",
    welcomeSubtitle: 'Tap the screen to enter the official site.',
    headerEyebrow: "Minh Đăng (Estasy)'s Blog",
    headerTitle: '',
    navHome: 'Home',
    navPosts: 'Posts',
    navProjects: 'Projects',
    navContact: 'Contact',
    dailyQuoteTitle: 'Daily quote',
    dailyQuoteLoading: 'Loading quote...',
    dailyQuoteError: 'Unable to load quote right now.',
    clockTitle: 'Clock',
    clockTimeLabel: 'Current time',
    clockDateLabel: 'Date',
    clockTimezoneLabel: 'Time zone',
    weatherTitle: 'Weather',
    weatherLocationLabel: 'Location',
    weatherLoading: 'Loading weather...',
    weatherError: 'Unable to load weather right now.',
    weatherTempLabel: 'Temperature',
    weatherWindLabel: 'Wind',
    catTitle: 'A little cat for your day',
    catButton: 'New cat',
    catLoading: 'Cat incoming ...',
    dogTitle: 'A little dog for your day',
    dogButton: 'New dog',
    dogLoading: 'Dog incoming ...',
    musicTitle: 'Music corner',
    musicText: 'A simple music player — enjoy a quick listen.',
    playerPrev: 'Previous video',
    playerNext: 'Next video',
    playlistLabel: 'Playlist',
    footerCopy: '© 2026 Minh Đăng (Estasy). All rights reserved.',
    footerButton: 'Say hello',
    settingsLabel: '⚙️ Settings',
    themeLabel: 'Theme',
    themeSelectLabel: 'Select theme',
    languageLabel: 'Language',
    lightLabel: 'Light',
    darkLabel: 'Dark',
    christmasLabel: 'Christmas',
    lunarLabel: 'Lunar New Year',
    halloweenLabel: 'Halloween',
  },
}
