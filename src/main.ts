import { createApp } from 'vue';
import App from './App.vue';
import '@/styles/index.scss';
// 导入路由
import router from '@/router/index';
// 导入vuex
import store from '@/store/index';
// 导入element3
import Element from '../plugins/element3';

createApp(App).use(store).use(router).use(Element).mount('#app');
