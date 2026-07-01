// Central contact + social data, reused by the footer, contact section, and hero.
import type { Locale } from './translations'

export type SocialLink = {
  id: string
  label: string
  url: string
  icon: string
}

export const CONTACT = {
  phoneDisplay: '+84 392 704 465',
  phoneHref: 'tel:+84392704465',
  email: 'minhdang14902@gmail.com',
  emailHref: 'mailto:minhdang14902@gmail.com',
}

// About paragraph as tokens so recruiter-facing keywords can be highlighted inline.
export type AboutToken = { t: string; hl?: boolean }

export const ABOUT: Record<Locale, AboutToken[]> = {
  en: [
    { t: 'A ' },
    { t: 'Full Stack Engineer', hl: true },
    { t: ' with ' },
    { t: '2+ years of experience', hl: true },
    { t: ' designing, building, and maintaining ' },
    { t: 'scalable web applications', hl: true },
    { t: '. Strong sense of ' },
    { t: 'ownership', hl: true },
    { t: ' in delivering ' },
    { t: 'end-to-end solutions', hl: true },
    { t: ', from development to deployment and long-term maintenance. Experienced with ' },
    { t: 'CI/CD pipelines', hl: true },
    { t: ', ' },
    { t: 'microservices architecture', hl: true },
    { t: ', and ' },
    { t: 'production environments', hl: true },
    { t: ', ensuring stable and reliable systems. Continuously improving efficiency by leveraging modern tools and ' },
    { t: 'agentic AI workflows', hl: true },
    { t: ' to optimize problem-solving and iteration speed.' },
  ],
  vi: [
    { t: 'Một ' },
    { t: 'Full Stack Engineer', hl: true },
    { t: ' với ' },
    { t: 'hơn 2 năm kinh nghiệm', hl: true },
    { t: ' thiết kế, xây dựng và duy trì các ' },
    { t: 'ứng dụng web mở rộng', hl: true },
    { t: '. Tinh thần ' },
    { t: 'làm chủ', hl: true },
    { t: ' cao khi mang lại ' },
    { t: 'giải pháp trọn vẹn', hl: true },
    { t: ', từ phát triển đến triển khai và bảo trì lâu dài. Có kinh nghiệm với ' },
    { t: 'CI/CD', hl: true },
    { t: ', ' },
    { t: 'kiến trúc microservices', hl: true },
    { t: ' và ' },
    { t: 'môi trường production', hl: true },
    { t: ', đảm bảo hệ thống ổn định, đáng tin cậy. Liên tục nâng cao hiệu suất bằng công cụ hiện đại và ' },
    { t: 'quy trình agentic AI', hl: true },
    { t: ' để tối ưu việc giải quyết vấn đề và tốc độ lặp.' },
  ],
}

export const SOCIALS: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/dangnguyenminh1409',
    icon: 'fa-brands fa-linkedin-in',
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/DangMinh14',
    icon: 'fa-brands fa-github',
  },
]

export const LINKEDIN_URL = SOCIALS[0].url
