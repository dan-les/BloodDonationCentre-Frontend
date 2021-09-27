<template>
  <b-container>
<span v-if="!successful">

</span>
    <b-row align-h="center">
      <b-col md="7">
        <b-card bg-variant="light">
          <b-img
              v-if="role === undefined"
              :srcset="require('../../assets/user_img_blue_darker.png')"
              alt="User image"
              center
              height="88"
              style="margin: 1rem 0 1rem"
              width="88">
          </b-img>
          <b-form @submit.prevent="handleRegister">
            <span v-if="!successful">
              <b-row>
              <b-col>
                <b-form-group>
                  <label>Login</label>
                  <b-form-input
                      v-model.trim="user.username"
                      v-validate="'required|min:5|max:20'"
                      data-vv-as="'login'"
                      name="username"
                      type="text"
                      @keydown.space.prevent
                  ></b-form-input>
                  <b-alert
                      :show="submitted && errors.has('username')"
                      variant="danger"
                  >{{ errors.first('username') }}
                  </b-alert>
                </b-form-group>
                <b-form-group>
                  <label>Hasło</label>
                  <b-form-input
                      ref="password"
                      v-model="user.password"
                      v-validate="'required|min:6|max:40'"
                      data-vv-as="'hasło'"
                      name="password"
                      type="password"
                  ></b-form-input>
                  <b-alert
                      :show="submitted && errors.has('password')"
                      variant="danger"
                  >{{ errors.first('password') }}
                  </b-alert>
                </b-form-group>
                <b-form-group>
                  <label>Powtórz hasło</label>
                  <b-form-input
                      v-model="passwordRepeated"
                      v-validate="'required|min:6|max:40|confirmed:password'"
                      data-vv-as="'powtórzone hasło'"
                      name="passwordRepeated"
                      type="password"
                  ></b-form-input>
                  <b-alert
                      :show="submitted && errors.has('passwordRepeated')"
                      variant="danger"
                  >{{ errors.first('passwordRepeated') }}
                  </b-alert>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group>
                  <label>Imię</label>
                  <b-form-input
                      v-model="user.firstName"
                      v-validate="'required|min:1|max:40|alpha'"
                      data-vv-as="'imię'"
                      name="firstName"
                      type="text"
                  ></b-form-input>
                  <b-alert
                      :show="submitted && errors.has('firstName')"
                      variant="danger"
                  >{{ errors.first('firstName') }}
                  </b-alert>
                </b-form-group>
                <b-form-group>
                  <label>Nazwisko</label>
                  <b-form-input
                      v-model="user.lastName"
                      v-validate="'required|min:1|max:40|alpha'"
                      data-vv-as="'Nazwisko'"
                      name="lastName"
                      type="text"
                  ></b-form-input>
                  <b-alert
                      :show="submitted && errors.has('lastName')"
                      variant="danger"
                  >{{ errors.first('lastName') }}
                  </b-alert>
                </b-form-group>
                <b-form-group>
                  <label>E-mail</label>
                  <b-form-input
                      v-model="user.email"
                      v-validate="'required|email|max:50'"
                      data-vv-as="'e-mail'"
                      name="email"
                      type="text"
                  ></b-form-input>
                  <b-alert
                      :show="submitted && errors.has('email')"
                      variant="danger"
                  >{{ errors.first('email') }}
                  </b-alert>
                </b-form-group>
              </b-col>
              </b-row>
              <b-form-group>
                    <b-button v-if="role === undefined" block type="sumbit"
                              variant="primary"> Zarejestruj się</b-button>
                    <b-button v-else block type="sumbit"
                              variant="primary">Zarejestruj nowego pracownika w systemie</b-button>
              </b-form-group>
            </span>
          </b-form>

          <b-form-group>
            <b-alert
                :show="message.length > 0"
                :variant="successful ? 'success' : 'danger'"
            >{{ message }}
            </b-alert>
          </b-form-group>

          <footer>
            <b-container v-if="role === undefined" class="text-center">
              <small>Masz już założone konto? Możesz zalogować się
                <b-link to="/login"> tutaj</b-link>
                .
              </small>
            </b-container>
          </footer>
        </b-card>
      </b-col>
    </b-row>
    <!-- -->
    <!--    <div-->
    <!--        v-if="message"-->
    <!--        :class="successful ? 'alert-success' : 'alert-danger'"-->
    <!--        class="alert"-->
    <!--    >{{ message }}-->
    <!--    </div>-->
    <!--    </div>-->

  </b-container>
</template>

<script>
import User from '../../model/user';

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', '', '', '', '', []),
      passwordRepeated: '',
      submitted: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn && !this.$store.state.auth.user.roles.includes('ROLE_ADMIN')) {
      this.$router.push('/profile');
    }
  },
  props: ['role'],
  methods: {
    handleRegister() {

      let tmp_array = [];
      if (this.role === 'staff') {
        tmp_array.push(this.role);
        this.user.role = tmp_array;
      } else {
        tmp_array.push('user');
        this.user.role = tmp_array;
      }
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
              data => {
                if (this.role === undefined) {
                  this.message = data.message + ' Za chwilę nastąpi przekierowanie na stronę logowania...';
                  setTimeout(() => this.$router.push({path: '/login'}), 3000);
                } else {
                  this.message = data.message;
                }
                this.successful = true;
              },
              error => {
                this.message =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.successful = false;
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

