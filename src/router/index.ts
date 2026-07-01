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
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, top: 88, behavior: 'smooth' }
    }
    return { top: 0 }
  },
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
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

export default router
