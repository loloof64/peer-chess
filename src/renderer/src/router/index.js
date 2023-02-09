import {createRouter, createWebHashHistory} from 'vue-router'
import GamePage from '../pages/GamePage.vue'
import CameraPreviewPage from '../pages/CameraPreviewPage.vue';

const routes = [
    {path: '/', name: 'home', component: CameraPreviewPage},
    {path: '/game', name: 'game', component: GamePage}
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
});