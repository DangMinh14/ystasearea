import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import PostsPage from '../pages/PostsPage.vue'
import WelcomePage from '../pages/WelcomePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomePage,
      meta: { shell: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsPage,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

export default router
