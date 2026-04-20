import { createRouter, createWebHistory } from 'vue-router'
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
      component: () => import('../views/WelcomeView.vue'),
      meta: { shell: false },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { showSidebar: true, fullWidth: false },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogListView.vue'),
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/GamesView.vue'),
      meta: { showSidebar: false, fullWidth: false },
    },
    {
      path: '/music',
      name: 'music',
      component: () => import('../views/MusicView.vue'),
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
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('../views/AuthCallbackView.vue'),
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
