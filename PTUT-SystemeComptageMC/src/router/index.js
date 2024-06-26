// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/LoginView.vue'),
      },
    ],
  },
  {
    path: '/home',
    component: () => import('@/layouts/default/HomeLayout.vue'),

  },
  {
    path: '/historique',
    component: () => import('@/layouts/default/HistoriqueLayout.vue'),
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/layouts/default/AccountLayout.vue'),
    meta: {
      auth: true
    }
  }, {
    path: '/changepassword',
    name: 'ChangePassword',
    component: () => import('@/layouts/default/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'changePassword',

        component: () => import('@/views/ChangePasswordView.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
