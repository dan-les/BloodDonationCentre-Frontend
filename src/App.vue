<template>
  <b-container id="app" fluid>
    <!--    #ab3739-->
    <!--    #a53234-->
    <b-navbar fixed="top" style="background-color: #3773AB" toggleable="lg" type="dark">
      <b-link style="padding: 0.1rem;" to="/home">
        <b-navbar-brand>Centrum Krwiodwstwa</b-navbar-brand>
      </b-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <b-link active-class="font-weight-bold text-light" router-tag="li" style="padding: 0.1rem;" to="/home">
              <font-awesome-icon icon="home"/>
              Strona główna
            </b-link>
          </b-nav-item>
          <b-nav-item v-if="showAdminBoard">
            <b-link active-class="font-weight-bold text-light" router-tag="li" style="padding: 0.1rem;" to="/admin">
              Panel Administratora
            </b-link>
          </b-nav-item>
          <b-nav-item v-if="showStaffBoard">
            <b-link active-class="font-weight-bold text-light" router-tag="li" style="padding: 0.1rem;" to="/staff">
              Panel Pracownika
            </b-link>
          </b-nav-item>

          <b-nav-item v-if="showStaffBoard">
            <b-link active-class="font-weight-bold text-light" router-tag="li" style="padding: 0.1rem;" to="/donors">
              Dawcy
            </b-link>
          </b-nav-item>

          <b-nav-item-dropdown v-if="showStaffBoard"
                               :toggle-class="($route.name==='reservations') ? 'font-weight-bold text-light' : ''"
                               right
                               style="padding: 0.1rem;" text="Rezerwacje"
          >
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
            <b-link :to="{name: 'donationsAllDonors'}" active-class="font-weight-bold text-light" router-tag="li"
                    style="padding: 0.1rem;">Pobrania
            </b-link>
          </b-nav-item>

          <b-nav-item v-if="showStaffBoard">
            <b-link :to="{name: 'recipients'}" active-class="font-weight-bold text-light" router-tag="li"
                    style="padding: 0.1rem;">Odbiorcy
            </b-link>
          </b-nav-item>

          <b-nav-item v-if="showNormalUserBoard">
            <b-link v-if="currentUser" active-class="font-weight-bold text-light" router-tag="li"
                    style="padding: 0.1rem;" to="/user">Panel użytkownika
            </b-link>
          </b-nav-item>
        </b-navbar-nav>

        <div v-if="!currentUser" class="navbar-nav ml-auto">
          <b-nav-item>
            <b-link
                active-class="font-weight-bold text-light"
                router-tag="li"
                style="padding: 0.1rem;"
                to="/register">
              <font-awesome-icon icon="user-plus"/>
              Zarejestruj się
            </b-link>
          </b-nav-item>
          <b-nav-item>
            <b-link active-class="font-weight-bold text-light"
                    router-tag="li"
                    style="padding: 0.1rem;"
                    to="/login">
              <font-awesome-icon icon="sign-in-alt"/>
              Zaloguj się
            </b-link>
          </b-nav-item>
        </div>

        <div v-if="currentUser" class="navbar-nav ml-auto">
          <b-nav-item>
            <b-link active-class="font-weight-bold text-light" router-tag="li" style="padding: 0.1rem;" to="/profile">
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
            Wyloguj się
          </b-nav-item>
        </div>
      </b-collapse>
    </b-navbar>

    <b-container style="padding-top: 5rem">
      <b-card class="p-xl-3" style="margin-bottom: 2rem">
        <transition mode="out-in" name="fade">
          <router-view :key="$route.fullPath"/>
        </transition>
        <b-card-text class=" small text-muted text-center font-weight-light" style="margin-top: 2rem">Copyright © 2021
          Daniel Leśniewicz
        </b-card-text>
      </b-card>
    </b-container>

  </b-container>
</template>

<script>
import DocumentEventService from "./services/common/DocumentEventService";

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
  },
  mounted() {
    DocumentEventService.on("logout", () => {
      this.logOut();
    });
  },
  beforeDestroy() {
    DocumentEventService.remove("logout");
  }

};
</script>

<style lang="scss">
#app {
  background-image: url("assets/background_image_blue_darker_cut.png");
  background-repeat: no-repeat;
  background-size: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.45s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>





