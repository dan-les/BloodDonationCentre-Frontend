<template>

  <b-container class="bv-example-row">
    <b-jumbotron
        header="Edycja danych dawcy" header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>
    <b-row>
      <b-col md="6">
        <b-form v-if="show" @reset="onReset" @submit.prevent="onSubmit">


          <b-form-group id="input-group-2" label="Wpisz login:" label-for="input-11">
            <b-form-input
                id="first-name"
                v-model="form.username"
                placeholder="login"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Wpisz imię:" label-for="input-1">
            <b-form-input
                id="first-name"
                v-model="form.firstName"
                placeholder="imię"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Wpisz nazwisko:" label-for="input-2">
            <b-form-input
                id="last-name"
                v-model="form.lastName"
                placeholder="nazwisko"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group
              id="input-group-1"
              label="Wpisz Email:"
              label-for="input-1"

          >
            <b-form-input
                id="input-1"
                v-model="form.email"
                placeholder=" email"
                required
                type="email"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Wpisz PESEL:" label-for="input-3">
            <b-form-input
                id="pesel"
                v-model="form.pesel"
                placeholder="pesel"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Grupa krwi:" label-for="input-4">
            <b-form-select
                id="blood"
                v-model="form.bloodGroupWithRh"
                :options="bloods"
                required
            ></b-form-select>
          </b-form-group>
          <b-form-group id="input-group-4" label="Płeć:" label-for="input-5">
            <b-form-select
                id="gender"
                v-model="form.gender"
                :options="genders"
                required
            ></b-form-select>
          </b-form-group>

          <b-button style="margin: 1rem" type="submit" variant="primary">Zapisz dane dawcy</b-button>
          <b-button type="reset" variant="danger">Resetuj pola</b-button>
        </b-form>
      </b-col>

      <b-col align-self="end">
        <b-row>
          <b-link :to="'/donors'">
            <b-button style="margin: 1rem">
              Powrót na stronę z dawcami
            </b-button>
          </b-link>
          <b-button style="margin: 1rem" variant="danger" @click="deleteDonor">
            Usuń dawcę
          </b-button>
        </b-row>
      </b-col>
    </b-row>

    <b-card class="mt-3" header="JSON - POST">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </b-container>

</template>

<script>
import DonorService from '../../services/donor.service';

export default {
  mounted() {
    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
      this.$router.push('/login');
    }

    DonorService.getDonorById(this.$route.params.id).then(
        response => {
          // console.log(response);
          this.form.username = response.data.username;
          this.form.email = response.data.email;
          this.form.firstName = response.data.firstName;
          this.form.lastName = response.data.lastName;
          this.form.pesel = response.data.pesel;

          if (response.data.bloodGroupWithRh !== '') {
            this.form.bloodGroupWithRh = response.data.bloodGroupWithRh;
          }

          if (response.data.gender !== '') {
            this.form.gender = response.data.gender;
          }


        },
        error => {
          this.content =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
        }
    )
  },
  data() {
    return {
      form: {
        // email: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        pesel: '',
        bloodGroupWithRh: null,
        gender: null,
        // checked: []
      },
      bloods: [{text: 'wybierz grupę krwi', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      genders: [{text: 'wybierz płeć', value: null}, {text: 'Kobieta', value: 'K'}, {text: 'Mężczyzna', value: 'M'}],
      show: true

    }
  },
  methods: {
    onSubmit(event) {
      console.log(this.form);

      event.preventDefault()
      // alert(JSON.stringify(this.form))

      DonorService.putDonor(this.$route.params.id, this.form)
          .then(response => {
            this.makeToastSuccess('Dane dawcy zostały pomyślnie zmienione');
          })
          .catch(e => {
            this.makeToastError();
            console.log(e);
          });

    }
    ,
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.username = '',
          this.form.email = '',
          this.form.firstName = '',
          this.form.lastName = '',
          this.form.pesel = '',
          this.form.bloodGroupWithRh = null
      this.form.gender = null

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    makeToastSuccess(message) {
      this.$bvToast.toast(message, {
        title: `Sukces`,
        variant: 'info',
        autoHideDelay: 2000,
        solid: true
      })

    },
    makeToastError() {
      this.$bvToast.toast('Coś poszło nie tak...', {
        title: `Błąd`,
        variant: 'danger',
        autoHideDelay: 2000,
        solid: true
      })
    },
    deleteDonor() {
      DonorService.deleteDonor(this.$route.params.id)
          .then(response => {
            this.form.username = '',
                this.form.email = '',
                this.form.firstName = '',
                this.form.lastName = '',
                this.form.pesel = '',
                this.form.bloodGroupWithRh = null
            this.form.gender = null

            this.makeToastSuccess('Pomyślnie usunięto dawcę');
          })
          .catch(e => {
            this.makeToastError();
            console.log(e);
          });
    }
  }
}
</script>
