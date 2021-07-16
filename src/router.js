import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            // lazy-loaded
            component: () => import('./views/Profile.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            // lazy-loaded
            component: () => import('./views/BoardAdmin.vue')
        },
        {
            path: '/staff',
            name: 'staff',
            // lazy-loaded
            component: () => import('./views/BoardStaff.vue')
        },
        {
            path: '/donors',
            name: 'donors',
            // lazy-loaded
            component: () => import('./views/Donors.vue')
        },
        {
            path: '/reservation',
            name: 'reservations',
            // lazy-loaded
            component: () => import('./views/Reservations.vue')
        },
        {
            path: '/donations/user/:id',
            name: 'donationsSelectedDonor',
            // lazy-loaded
            component: () => import('./views/DonationsSelectedDonor.vue')
        },
        {
            path: '/donations/add/:id',
            name: 'addDonation',
            // lazy-loaded
            component: () => import('./views/AddDonation.vue')
        },
        {
            path: '/user',
            name: 'user',
            // lazy-loaded
            component: () => import('./views/BoardUser.vue')
        },
        {
            path: "/donors/edit/:id",
            name: "editDonor",
            // lazy-loaded
            component: () => import("./views/EditDonor.vue")
        },
        {
            path: "/reservation/add/:id",
            name: "addReservation",
            // lazy-loaded
            component: () => import("./views/AddReservation.vue")
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');
//
//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });
