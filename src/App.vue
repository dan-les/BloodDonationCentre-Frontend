<template>
  <div id="app">
    <b-navbar style="margin-bottom: 1.5rem;" toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand @click.prevent>Centrum Krwiodwstwa</b-navbar-brand>

      <b-navbar-nav>
        <b-nav-item>
          <b-link router-tag="li" style="padding: 0.1rem;" to="/home">
            <font-awesome-icon icon="home"/>
            Strona główna
          </b-link>
        </b-nav-item>
        <b-nav-item v-if="showAdminBoard">
          <b-link router-tag="li" style="padding: 0.1rem;" to="/admin">Panel Administratora</b-link>
        </b-nav-item>
        <b-nav-item v-if="showStaffBoard">
          <b-link router-tag="li" style="padding: 0.1rem;" to="/staff">Panel Pracownika</b-link>
        </b-nav-item>

        <b-nav-item v-if="showStaffBoard">
          <b-link router-tag="li" style="padding: 0.1rem;" to="/donors">Dawcy</b-link>
        </b-nav-item>
        <b-nav-item-dropdown v-if="showStaffBoard" right style="padding: 0.1rem;" text="Rezerwacje">
          <b-dropdown-item>
            <b-link :to="{name: 'reservations', query: {date: false} }" router-tag="li" style="padding: 0.1rem;">
              Wszystkie zarezerwowane terminy
            </b-link>
          </b-dropdown-item>
          <b-dropdown-item>
            <b-link :to="{name: 'reservations', query: {date: true} }" router-tag="li" style="padding: 0.1rem;">
              Rezerwacje według daty
            </b-link>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item v-if="showStaffBoard">
          <b-link :to="{name: 'donationsAllDonors'}" router-tag="li" style="padding: 0.1rem;">Pobrania</b-link>
        </b-nav-item>

        <b-nav-item v-if="showStaffBoard">
          <b-link :to="{name: 'recipients'}" router-tag="li" style="padding: 0.1rem;">Odbiorcy</b-link>
        </b-nav-item>

        <b-nav-item v-if="showNormalUserBoard">
          <b-link v-if="currentUser" router-tag="li" style="padding: 0.1rem;" to="/user">Panel użytkownika</b-link>
        </b-nav-item>
      </b-navbar-nav>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <b-nav-item>
          <b-link
              router-tag="li"
              style="padding: 0.1rem;"
              to="/register">
            <font-awesome-icon icon="user-plus"/>
            Zarejestruj się!
          </b-link>
        </b-nav-item>
        <b-nav-item>
          <b-link router-tag="li" style="padding: 0.1rem;" to="/login">
            <font-awesome-icon icon="sign-in-alt"/>
            Zaloguj się!
          </b-link>
        </b-nav-item>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <b-nav-item>
          <b-link router-tag="li" style="padding: 0.1rem;" to="/profile">
            <font-awesome-icon icon="user"/>
            <span v-if="currentUser.firstName === null || currentUser.lastName === null">
              {{ currentUser.username }}
            </span>
            <span v-else>
               {{ currentUser.firstName }} {{ currentUser.lastName }}
            </span>
          </b-link>
        </b-nav-item>
        <b-nav-item
            style="padding: 0.1rem;" to="/logout" @click.prevent="logOut">
          <font-awesome-icon icon="sign-out-alt"/>
          Wyloguj się!
        </b-nav-item>
      </div>
    </b-navbar>

    <b-container>
      <b-card class="p-xl-3">
        <transition mode="out-in" name="fade">
          <router-view :key="$route.fullPath"/>
        </transition>
      </b-card>
    </b-container>

  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }

      return false;
    },
    showStaffBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_STAFF');
      }

      return false;
    },
    showNormalUserBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_USER');
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
#app {
  background-image: url("../public/bg.png");
  background-repeat: no-repeat;
  background-size: 125%;
  background-position-x: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>





