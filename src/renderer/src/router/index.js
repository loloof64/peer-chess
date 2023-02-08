import {createRouter, createWebHashHistory} from 'vue-router'
import GamePage from '../pages/GamePage.vue'
import CameraPreviewPage from '../pages/CameraPreviewPage.vue';

const routes = [
    {path: '/', component: CameraPreviewPage},
    {path: '/game', GamePage}
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
});