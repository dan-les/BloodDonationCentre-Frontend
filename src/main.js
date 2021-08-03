import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VeeValidate, {Validator} from 'vee-validate'
import pl from 'vee-validate/dist/locale/pl'
import Vuex from 'vuex';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {faHome, faSignInAlt, faSignOutAlt, faUser, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import AddReservationModel from "./components/AddReservationForm";
import DonorDetailsHeader from "./components/DonorDetailsHeader";
import LookupField from "./components/LookupField";
import Register from "./views/authorize/Register";
import setupInterceptors from './services/setupInterceptors';

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.config.productionTip = false;
Vue.config.devtools = true

Validator.localize({pl: pl})

Vue.use(IconsPlugin)
Vue.use(Vuex);
Vue.use(BootstrapVue)
Vue.use(VeeValidate, {
    locale: 'pl',
    inject: true,
    fieldsBagName: 'veeFields'
});
Vue.use(VueLoading, {
    color: "#1f4fa0",
    loader: "dots",
    width: 120,
    height: 120,
    opacity: 0.35
});

Vue.component("add-reservation-model", AddReservationModel);
Vue.component("donor-details-header", DonorDetailsHeader);
Vue.component("lookup-field", LookupField);
Vue.component("register", Register);
Vue.component('font-awesome-icon', FontAwesomeIcon);
library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

setupInterceptors(store);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
