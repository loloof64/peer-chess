import { createApp } from 'vue'
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue'

const pinia = createPinia()

import '@loloof64/chessboard-component/dist'

createApp(App)
.use(router)
.use(pinia)
.mount('#app')
