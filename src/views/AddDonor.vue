<template>

  <b-container class="bv-example-row">
    <b-row>
      <b-col md="6">
        <b-form v-if="show" @reset="onReset" @submit.prevent="onSubmit">
          <!--      <b-form-group-->
          <!--          id="input-group-1"-->
          <!--          label="Email address:"-->
          <!--          label-for="input-1"-->
          <!--          description="We'll never share your email with anyone else."-->
          <!--      >-->
          <!--        <b-form-input-->
          <!--            id="input-1"-->
          <!--            v-model="form.email"-->
          <!--            type="email"-->
          <!--            placeholder="Enter email"-->
          <!--            required-->
          <!--        ></b-form-input>-->
          <!--      </b-form-group>-->

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
                :options="foods"
                required
            ></b-form-select>
          </b-form-group>

          <b-button type="submit" variant="primary">Dodaj dawcę</b-button>
          <b-button type="reset" variant="danger">Resetuj pola</b-button>
        </b-form>
      </b-col>

      <b-col align-self="end">
        <b-row>
          <b-link :to="'/donors'">
            <b-button>Powrót na stronę z dawcami
            </b-button>
          </b-link>
        </b-row>
      </b-col>
    </b-row>


        <b-card class="mt-3" header="JSON - POST">
          <pre class="m-0">{{ form }}</pre>
        </b-card>
  </b-container>

</template>

<script>
import DonorService from '../services/donor.service';

export default {
  data() {
    return {
      form: {
        // email: '',
        firstName: '',
        lastName: '',
        pesel: '',
        bloodGroupWithRh: null,
        // checked: []
      },
      foods: [{text: 'Wybierz grupę krwi', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      show: true
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      // alert(JSON.stringify(this.form))


      DonorService.addDonor(this.form)
          .then(response => {

            console.log(response.data);

            this.form.firstName = '';
            this.form.lastName = '';
            this.form.pesel = '';
            this.form.bloodGroupWithRh = null;
            this.makeToastSuccess();
          })
          .catch(e => {
            this.makeToastError();
            console.log(e);
          });

    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.firstName = ''
      this.form.bloodGroupWithRh = null

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    makeToastSuccess() {
      this.$bvToast.toast('Nowy dawca został pomyslnie dodany', {
        title: `Dodanie nowego dawcy.`,
        variant: 'info',
        solid: true
      })
    },
    // makeToastError() {
    //   this.$bvToast.toast('Coś poszło nie tak...', {
    //     title: `Dodanie nowego dawcy.`,
    //     variant: 'error',
    //     solid: true
    //   })


  }
}
</script>
