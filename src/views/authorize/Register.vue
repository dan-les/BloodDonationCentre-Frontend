<template>
  <b-container style="margin-top: -2rem">


    <div :class="{'card card-container' : role === undefined}">
      <b-row>
        <img
            v-if="role === undefined"
            id="profile-img"
            class="profile-img-card"
            src="../../assets/user_img.png"
        />
      </b-row>

      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <b-row>
            <b-col>
              <div class="form-group">
                <label>Login</label>
                <input
                    v-model="user.username"
                    v-validate="'required|min:3|max:20'"
                    class="form-control"
                    data-vv-as="'login'"
                    name="username"
                    type="text"
                />
                <div
                    v-if="submitted && errors.has('username')"
                    class="alert-danger"
                >{{ errors.first('username') }}
                </div>
              </div>

              <div class="form-group">
                <label>Hasło</label>
                <input
                    ref="password"
                    v-model="user.password"
                    v-validate="'required|min:6|max:40'"
                    class="form-control"
                    data-vv-as="'hasło'"
                    name="password"
                    type="password"
                />
                <div
                    v-if="submitted && errors.has('password')"
                    class="alert-danger"
                >{{ errors.first('password') }}
                </div>
              </div>
              <div class="form-group">
                <label>Powtórz hasło</label>
                <input
                    v-validate="'required|min:6|max:40|confirmed:password'"
                    class="form-control"
                    data-vv-as="'powtórzone hasło'"
                    name="passwordRepeated"
                    type="password"
                />
                <div
                    v-if="submitted && errors.has('passwordRepeated')"
                    class="alert-danger"
                >{{ errors.first('passwordRepeated') }}
                </div>
              </div>
            </b-col>

            <b-col>
              <div class="form-group">
                <label>Imię</label>
                <input
                    v-model="user.firstName"
                    v-validate="'required|min:1|max:40'"
                    class="form-control"
                    data-vv-as="'imię'"
                    name="firstName"
                    type="text"
                />
                <div
                    v-if="submitted && errors.has('firstName')"
                    class="alert-danger"
                >{{ errors.first('firstName') }}
                </div>
              </div>
              <div class="form-group">
                <label>Nazwisko</label>
                <input
                    v-model="user.lastName"
                    v-validate="'required|min:1|max:40'"
                    class="form-control"
                    data-vv-as="'Nazwisko'"
                    name="lastName"
                    type="text"
                />
                <div
                    v-if="submitted && errors.has('lastName')"
                    class="alert-danger"
                >{{ errors.first('lastName') }}
                </div>
              </div>

              <div class="form-group">
                <label>E-mail</label>
                <input
                    v-model="user.email"
                    v-validate="'required|email|max:50'"
                    class="form-control"
                    data-vv-as="'e-mail'"
                    name="email"
                    type="email"
                />
                <div
                    v-if="submitted && errors.has('email')"
                    class="alert-danger"
                >{{ errors.first('email') }}
                </div>
              </div>
            </b-col>
          </b-row>

          <div class="form-group" style="margin-top: 1rem">
            <button v-if="role === undefined" class="btn btn-primary btn-block"> Zarejestruj się</button>
            <button v-else class="btn btn-primary btn-block">Zarejestruj nowego pracownika w systemie</button>
          </div>
        </div>
      </form>

      <div
          v-if="message"
          :class="successful ? 'alert-success' : 'alert-danger'"
          class="alert"
      >{{ message }}
      </div>
    </div>

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
                  setTimeout(() => this.$router.push({path: '/login'}), 5000);
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

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 650px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
