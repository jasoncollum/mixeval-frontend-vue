import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './../node_modules/bulma/css/bulma.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/global.css'

createApp(App).use(store).use(router).mount('#app')
