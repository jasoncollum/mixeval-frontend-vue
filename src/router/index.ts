import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserProfile from '../views/UserProfile.vue'
import CreateArtist from '../views/CreateArtist.vue'
import CreateSong from '../views/CreateSong.vue'
import VersionEdit from '../views/VersionEdit.vue'
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
    name: 'userProfile',
    component: UserProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    // *** rename this path '/artist/create' and refactor where needed ***
    // *** rename name 'artistCreate' and component 'ArtistCreate' and refactor ***
    path: '/create-artist',
    name: 'createArtist',
    component: CreateArtist,
    meta: {
      requiresAuth: true
    }
  },
  {
    // *** rename this path '/song/create' and refactor where needed ***
    // *** rename name 'songCreate' and component 'SongCreate' and refactor ***
    path: '/create-song',
    name: 'createSong',
    component: CreateSong,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/song/:id',
    name: 'songView',
    component: SongView,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/version/edit',
    name: 'versionEdit',
    component: VersionEdit,
    meta: {
      requiresAuth: true
    },
  }
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
