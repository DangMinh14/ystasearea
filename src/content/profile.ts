// Central contact + social data, reused by the footer, contact section, and hero.
export type SocialLink = {
  id: string
  label: string
  url: string
  icon: string
}

export const CONTACT = {
  phoneDisplay: '+84 392 704 465',
  phoneHref: 'tel:+84392704465',
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
