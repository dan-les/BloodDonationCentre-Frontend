import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/board/Home.vue';
import Login from './views/authorize/Login.vue';
import Register from './views/authorize/Register.vue';

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
            component: () => import('./views/board/Profile.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            // lazy-loaded
            component: () => import('./views/board/BoardAdmin.vue')
        },
        {
            path: '/staff',
            name: 'staff',
            // lazy-loaded
            component: () => import('./views/board/BoardStaff.vue')
        },
        {
            path: '/donors',
            name: 'donors',
            // lazy-loaded
            component: () => import('./views/donor/Donors.vue')
        },
        {
            path: '/reservation',
            name: 'reservations',
            // lazy-loaded
            component: () => import('./views/reservation/Reservations.vue')
        },
        {
            path: '/recipients',
            name: 'recipients',
            // lazy-loaded
            component: () => import('./views/recipients/Recipients.vue')
        },
        {
            path: '/reservations/user/:id',
            name: 'DonorReservations',
            // lazy-loaded
            component: () => import('./views/reservation/ReservationsSelectedDonor.vue')
        },
        {
            path: '/donations/all',
            name: 'donationsAllDonors',
            // lazy-loaded
            component: () => import('./views/donation/DonationsAllDonors.vue')
        },
        {
            path: '/donations/user/:id',
            name: 'donationsSelectedDonor',
            // lazy-loaded
            component: () => import('./views/donation/DonationsSelectedDonor.vue')
        },
        {
            path: '/donations/add/:id',
            name: 'addDonation',
            // lazy-loaded
            component: () => import('./views/donation/AddDonation.vue')
        },
        {
            path: '/user',
            name: 'user',
            // lazy-loaded
            component: () => import('./views/board/BoardUser.vue')
        },
        {
            path: "/donors/edit/:id",
            name: "editDonor",
            // lazy-loaded
            component: () => import("./views/donor/EditDonor.vue")
        },
        {
            path: "/reservation/add/:id",
            name: "addReservation",
            // lazy-loaded
            component: () => import("./views/reservation/AddReservation.vue")
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
