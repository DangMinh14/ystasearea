import type { BlogPost } from '../types'

export const mockPosts: BlogPost[] = [
  {
    slug: 'ui-refactor-diary',
    title: 'UI Refactor Diary: Từ Layout Cũ Đến Hệ Thiết Kế Mới',
    excerpt: 'Nhật ký triển khai refactor UI theo kiến trúc component modular và mobile-first.',
    content:
      'Trong lần nâng cấp này, mục tiêu chính là chuẩn hóa spacing scale, tăng readability, cải thiện semantic structure và tránh layout cứng theo viewport. Chúng mình chia hệ thống thành UI primitives, layout shell và feature modules để mở rộng an toàn hơn.',
    tags: ['refactor', 'vue', 'design-system'],
    publishedAt: '2026-03-20',
  },
  {
    slug: 'music-and-game-ux',
    title: 'Tối Ưu UX Cho Music + Games Trong Một App Cá Nhân',
    excerpt: 'Những quyết định UX giúp cân bằng giải trí và khả năng sử dụng trên mobile.',
    content:
      'Điểm quan trọng nhất là kiểm soát tương tác modal, keyboard navigation và trạng thái loading. Mọi bề mặt tương tác đều cần focus rõ ràng, chuyển động vừa phải và hierarchy nhất quán.',
    tags: ['ux', 'music', 'games'],
    publishedAt: '2026-03-18',
  },
  {
    slug: 'responsive-grid-playbook',
    title: 'Responsive Grid Playbook',
    excerpt: 'Các nguyên tắc practical để không overflow khi scale từ mobile lên desktop lớn.',
    content:
      'Khi thiết kế responsive, ưu tiên content flow theo chiều dọc, sau đó mở rộng thành hai cột ở breakpoint hợp lý. Không dùng fixed positioning cho nội dung chính; chỉ dùng sticky có kiểm soát cho thành phần phụ trợ.',
    tags: ['responsive', 'css', 'frontend'],
    publishedAt: '2026-03-15',
  },
]
