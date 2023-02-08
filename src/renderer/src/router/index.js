import {createRouter, createWebHashHistory} from 'vue-router'
import GamePage from '../pages/GamePage.vue'
import CameraPreviewPage from '../pages/CameraPreviewPage.vue';

const routes = [
    {path: '/', component: GamePage},
    {path: '/camera-preview', CameraPreviewPage}
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
});