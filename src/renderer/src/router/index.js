import {createRouter, createWebHashHistory} from 'vue-router'
import CameraPreviewPage from '../pages/CameraPreviewPage.vue';

const routes = [
    {path: '/', component: CameraPreviewPage},
]

export default createRouter({
    history: createWebHashHistory(),
    routes,
});