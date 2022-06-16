import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserProfile from '../views/UserProfile.vue'
import CreateArtist from '../views/CreateArtist.vue'
import CreateSong from '../views/CreateSong.vue'
import SignupForm from '../views/SignupForm.vue'
import SigninForm from '../views/SigninForm.vue'
import SongView from '../views/SongView.vue'
import store from '../store/index'

const routes: Array<RouteRecordRaw> = [
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
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: UserProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-artist',
    name: 'createArtist',
    component: CreateArtist,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-song',
    name: 'createSong',
    component: CreateSong,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/song-view',
    name: 'SongView',
    component: SongView,
    meta: {
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authenticatedUser = store.state.username
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authenticatedUser) {
    next('signin')
  } else {
    next()
  }
})

export default router
