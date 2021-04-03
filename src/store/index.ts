import { createStore } from 'vuex';
import user from './modules/user';
const store = createStore({
  state: {
    counter: 0,
  },
  mutations: {},
  actions: {},
  modules: {
    user,
  },
});

export default store;
