import { createApp } from 'vue'
import { createPinia } from 'pinia';
import router from './router';
import i18n from './i18n';
import App from './App.vue'

const pinia = createPinia()

import '@loloof64/chessboard-component/dist'

createApp(App)
.use(router)
.use(i18n)
.use(pinia)
.mount('#app')
