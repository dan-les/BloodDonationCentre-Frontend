<template>
  <div id="app">


    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand @click.prevent>Centrum Krwiodwstwa</b-navbar-brand>

      <b-navbar-nav>



        <b-nav-item>
          <b-link router-tag="li" to="/home">
            <font-awesome-icon icon="home"/>
            Strona główna
          </b-link>
        </b-nav-item>
        <b-nav-item v-if="showAdminBoard">
          <b-link router-tag="li" to="/admin">Panel Admina</b-link>
        </b-nav-item>
        <b-nav-item v-if="showStaffBoard">
          <b-link router-tag="li" to="/staff">Panel Pracownika</b-link>
        </b-nav-item>

        <!---->
        <b-nav-item v-if="showStaffBoard">
          <b-link router-tag="li" to="/donors">Wyświetl dawców</b-link>
        </b-nav-item>

        <b-nav-item-dropdown v-if="showStaffBoard" right text="Dawcy">
          <b-dropdown-item>
            <b-link router-tag="li" to="/donors">Wyświetl dawców</b-link>
            <!--            <router-link to="/donors" id="thisLink" class="nav-item">Wyświetl dawców</router-link>-->
          </b-dropdown-item>
          <b-dropdown-item>
            <b-link router-tag="li" to="/add">Dodaj dawcę</b-link>
            <!--            <router-link to="/donors">Dodaj dawcę</router-link>-->
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <!---->

        <b-nav-item v-if="showNormalUserBoard">
          <b-link v-if="currentUser" router-tag="li" to="/user">User</b-link>
        </b-nav-item>
      </b-navbar-nav>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <b-nav-item>
          <b-link router-tag="li" to="/register">
            <font-awesome-icon icon="user-plus"/>
            Sign Up
          </b-link>
        </b-nav-item>
        <b-nav-item>
          <b-link router-tag="li" to="/login">
            <font-awesome-icon icon="sign-in-alt"/>
            Login
          </b-link>
        </b-nav-item>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <b-nav-item>
          <b-link router-tag="li" to="/profile">
            <font-awesome-icon icon="user"/>
            {{ currentUser.username }}
          </b-link>
        </b-nav-item>
        <b-nav-item
            to="/logout" @click.prevent="logOut">
          <font-awesome-icon icon="sign-out-alt"/>
          Wyloguj się!

        </b-nav-item>
      </div>
    </b-navbar>

    <div class="container">
      <router-view/>
    </div>
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





