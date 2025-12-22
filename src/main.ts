import { createApp } from 'vue';

import App from './App.vue';

import router from './router/index';

import './styles/main.scss';

import "@danilovd/is-ui/src/styles/colors.scss";

const app = createApp(App);

app.use(router);

app.mount('#app');
