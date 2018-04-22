import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Challenge from './views/Challenge.vue';
import Signup from './views/Signup.vue';

import store from './store';

Vue.use(Router);

const authToLink = ['/login', '/', '/challenge'];
const loginGuard = link => async (to, from, next) => {
  let { authenticated } = store.state.user;

  // Successful login (type 1), would save credentials in local storage
  // Authenticate and update user's login status before navigation
  if (authenticated !== 1) {
    try {
      await store.dispatch('authenticate');
      // eslint-disable-next-line prefer-destructuring
      authenticated = store.state.user.authenticated;
    } catch (e) {} // eslint-disable-line no-empty
  }
  if (link === '/' || authToLink[authenticated] === link) {
    next();
  } else {
    next(authToLink[authenticated]);
  }
};

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: loginGuard('/'),
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: loginGuard('/login'),
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: Challenge,
      beforeEnter: loginGuard('/challenge'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
  ],
});
