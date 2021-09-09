import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/board/Home.vue';

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
            component: () => import('./views/authorize/Login.vue')
        },
        {
            path: '/register',
            component: () => import('./views/authorize/Register.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/board/Profile.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('./views/board/BoardAdmin.vue')
        },
        {
            path: '/staff',
            name: 'staff',
            component: () => import('./views/board/BoardStaff.vue')
        },
        {
            path: '/donors',
            name: 'donors',
            component: () => import('./views/donor/Donors.vue')
        },
        {
            path: '/reservation',
            name: 'reservations',
            component: () => import('./views/reservation/Reservations.vue')
        },
        {
            path: '/recipients',
            name: 'recipients',
            component: () => import('./views/recipients/Recipients.vue')
        },
        {
            path: '/reservations/user/:id',
            name: 'DonorReservations',
            component: () => import('./views/reservation/ReservationsSelectedDonor.vue')
        },
        {
            path: '/donations/all',
            name: 'donationsAllDonors',
            component: () => import('./views/donation/DonationsAllDonors.vue')
        },
        {
            path: '/donations/user/:id',
            name: 'donationsSelectedDonor',
            component: () => import('./views/donation/DonationsSelectedDonor.vue')
        },
        {
            path: '/donations/add/:id',
            name: 'addDonation',
            component: () => import('./views/donation/AddDonation.vue')
        },
        {
            path: '/user',
            name: 'user',
            component: () => import('./views/board/BoardUser.vue')
        },
        {
            path: "/donors/edit/:id",
            name: "editDonor",
            component: () => import("./views/donor/EditDonor.vue")
        },
        {
            path: "/reservation/add/:id",
            name: "addReservation",
            component: () => import("./views/reservation/AddReservation.vue")
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
