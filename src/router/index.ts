import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'
import BlogListView from '../views/BlogListView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import GamesView from '../views/GamesView.vue'
import MusicView from '../views/MusicView.vue'
import { toolRegistry } from '../features/tools/config/toolRegistry'

const toolRoutes = toolRegistry.map((tool) => ({
  path: tool.id,
  name: tool.routeName,
  component: tool.component,
  meta: { toolId: tool.id, showSidebar: false, fullWidth: true },
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      meta: { shell: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { showSidebar: true, fullWidth: false },
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogListView,
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: BlogDetailView,
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView,
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/music',
      name: 'music',
      component: MusicView,
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/tools',
      component: () => import('../features/tools/layouts/ToolsLayout.vue'),
      meta: { showSidebar: false, fullWidth: true },
      children: [
        {
          path: '',
          name: 'tools',
          component: () => import('../features/tools/components/ToolsHub.vue'),
          meta: { showSidebar: false, fullWidth: true },
        },
        ...toolRoutes,
      ],
    },
    {
      path: '/posts',
      redirect: '/blog',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

export default router
