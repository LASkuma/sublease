import Vue from 'vue';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App.vue';
import router from './router';
import store from './store';
import apolloProvider from './apolloProvider';

Vue.config.productionTip = false;
Vue.use(MintUI);

new Vue({
  router,
  store,
  provide: apolloProvider.provide(),
  render: h => h(App),
}).$mount('#app');
