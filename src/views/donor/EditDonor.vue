<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
    <b-jumbotron
        header="Edycja danych dawcy" header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>
    <b-row>
      <b-col md="6">
        <b-form v-if="show" @reset="onReset" @submit.prevent="onSubmit">
          <b-form-group id="input-group-2" label="Login:">
            <b-form-input
                id="first-name"
                v-model="donor.username"
                disabled
                placeholder="login"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Wpisz imię:">
            <b-form-input
                id="first-name"
                v-model="donor.firstName"
                placeholder="imię"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Wpisz nazwisko:">
            <b-form-input
                id="last-name"
                v-model="donor.lastName"
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
                v-model="donor.email"
                placeholder=" email"
                required
                type="email"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Wpisz PESEL:">
            <b-form-input
                id="pesel"
                v-model="donor.pesel"
                placeholder="pesel"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Grupa krwi:">
            <b-form-select
                id="blood"
                v-model="donor.bloodGroupWithRh"
                :options="bloods"
                required
            ></b-form-select>
          </b-form-group>
          <b-form-group id="input-group-4" label="Płeć:">
            <b-form-select
                id="gender"
                v-model="donor.gender"
                :options="genders"
                required
            ></b-form-select>
          </b-form-group>

          <b-button class="m-3" type="submit" variant="primary">Zapisz dane dawcy</b-button>
          <b-button type="reset" variant="danger">Resetuj pola</b-button>
          <b-button class="m-3" variant="danger" @click="deleteDonor">
            Usuń dawcę
          </b-button>
        </b-form>

        <b-row class="mt-3">
          <b-link :to="'/donors'">
            <b-button>
              Powrót na stronę z dawcami
            </b-button>
          </b-link>
        </b-row>
      </b-col>

    </b-row>

  </b-card>
</template>

<script>
import DonorService from '../../services/donor.service';
import Donor from "../../model/donor";

export default {
  mounted() {
    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
      this.$router.push('/login');
    }
    let loader = this.$loading.show();
    DonorService.getDonorById(this.$route.params.id)
        .then(response => {
          this.donor = new Donor(
              response.data.id,
              response.data.username,
              response.data.email,
              response.data.firstName,
              response.data.lastName,
              response.data.pesel,
              response.data.bloodGroupWithRh,
              response.data.gender
          )
        })
        .finally(() => {
          loader.hide();
        })
  },
  data() {
    return {
      isDeleted: false,
      donor: null,
      bloods: [{text: 'wybierz grupę krwi', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      genders: [{text: 'wybierz płeć', value: null}, {text: 'Kobieta', value: 'K'}, {text: 'Mężczyzna', value: 'M'}],
      show: true
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      DonorService.putDonor(this.$route.params.id, this.donor)
          .then(() => {
            this.makeToastSuccess('Dane dawcy zostały pomyślnie zmienione');
          })
          .catch(() => {
            this.makeToastError();
          });
    },
    onReset(event) {
      event.preventDefault()
      this.resetDonorProperties()
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    resetDonorProperties() {
      this.donor.username = ''
      this.donor.email = ''
      this.donor.firstName = ''
      this.donor.lastName = ''
      this.donor.pesel = ''
      this.donor.bloodGroupWithRh = null
      this.donor.gender = null
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
          .then(() => {
            this.isDeleted = true;
            this.show = false;
            this.makeToastSuccess('Pomyślnie usunięto dawcę');
          })
          .catch(() => {
            this.makeToastError();
          });
    }
  }
}
</script>
