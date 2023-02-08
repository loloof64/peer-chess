import { createApp } from 'vue'
import router from './router';
import App from './App.vue'

import '@loloof64/chessboard-component/dist'

createApp(App)
.use(router)
.mount('#app')
