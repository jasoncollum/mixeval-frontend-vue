import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupForm from '../views/SignupForm.vue'
import SigninForm from '../views/SigninForm.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path:'/signin',
    name: 'signin',
    component: SigninForm
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupForm
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authenticatedUser = localStorage.getItem('user_name')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authenticatedUser) {
    next('signin')
  } else {
    next()
  }
})

export default router
