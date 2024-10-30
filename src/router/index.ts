import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import TasksView from '../views/TasksView.vue'
import LoginView from '../views/LoginView.vue'
import { api } from '@/services/ApiService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Tasks',
    component: TasksView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !api.accessToken) next({ name: 'Login' })
  else next()
})

export default router
