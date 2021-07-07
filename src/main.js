import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VeeValidate from 'vee-validate';
import Vuex from 'vuex';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faHome, faSignInAlt, faSignOutAlt, faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons';

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Vuex);
Vue.config.devtools = true
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
