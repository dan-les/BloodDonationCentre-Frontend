<template>
  <b-row align-h="center">
    <b-col md="4">
      <b-card bg-variant="light" class="p-xl-3" style="margin-top: 2rem">
        <b-card-sub-title class="mb-2">LOGOWANIE</b-card-sub-title>
        <b-img
            :srcset="require('../../assets/user_icon_image.png')"
            alt="User image"
            center
            height="88"
            style="margin: 1rem 0 1rem"
            width="88">
        </b-img>

        <b-form @submit.prevent="triggerLogin">
          <b-form-group>
            <label>Login</label>
            <b-form-input
                v-model.trim="user.username"
                v-validate="'required'"
                data-vv-as="'login'"
                name="username"
                type="text"
            ></b-form-input>
            <b-alert
                :show="errors.has('username')"
                variant="danger"
            >{{ errors.first('username') }}
            </b-alert>
          </b-form-group>

          <b-form-group>
            <label>Hasło</label>
            <b-form-input
                v-model="user.password"
                v-validate="'required'"
                data-vv-as="'hasło'"
                name="password"
                type="password"
            ></b-form-input>
            <b-alert
                :show="errors.has('password')"
                variant="danger"
            >{{ errors.first('password') }}
            </b-alert>
          </b-form-group>

          <b-form-group>
            <b-button :disabled="isLoading" block type="sumbit" variant="primary">
              <span v-show="isLoading" class="spinner-border spinner-border-sm"></span>
              <span> Zaloguj się</span>
            </b-button>
          </b-form-group>

          <b-form-group>
            <b-alert
                :show="message.length > 0"
                variant="danger"
            >{{ message }}
            </b-alert>
          </b-form-group>
        </b-form>

        <footer>
          <b-container class="text-center">
            <small>Nie masz jeszcze założonego konta? <br> Możesz zarejestrować się
              <b-link to="/register"> tutaj</b-link>
              .
            </small>
          </b-container>
        </footer>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import User from '../../models/user';

export default {
  data() {
    return {
      user: new User(),
      isLoading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/home');
    }
  },
  methods: {
    triggerLogin() {
      this.isLoading = true;
      this.$validator.validateAll().then(isValidForm => {
        if (!isValidForm) {
          this.isLoading = false;
          return;
        }
        const username = this.user.username;
        const password = this.user.password;
        if (username && password) {
          this.$store.dispatch('auth/login', this.user).then(
              () => {
                this.$router.push('/home');
              },
              () => {
                this.isLoading = false;
                this.message = "Błąd logowania!"
              }
          );
        }
      });
    }
  }
};
</script>

<style>
.alert {
  margin-top: 0.25rem;
  padding: 0.25rem 0.25rem;
}
</style>
