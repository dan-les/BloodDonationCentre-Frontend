<template>
  <b-container>
    <b-jumbotron
        header="Dodawanie donacji" header-level="5" header-tag="h4" style="padding: 0.9rem">
      Wybrany dawca:
      <b-table
          :fields="fields" :items="donor" responsive="sm" small>
      </b-table>
    </b-jumbotron>

    <div v-if="shouldBeUnHide">
      <b-form-group v-slot="{ ariaDescribedby }" label="Typ pobrania:">
        <b-form-radio-group
            v-model="selectedDonationType"
            :aria-describedby="ariaDescribedby"
            :options="options"
            name="radios-stacked"
            required
            stacked
        ></b-form-radio-group>
      </b-form-group>

      <label>Ilość pobranego materiału biologicznego: <b>{{ amount }}</b> [ml]:</label><br>
      <b-row>
        <b-col class="mb-2" md="8">
          <b-form-input v-model="amount" max="1000" min="25" step="25" type="range"></b-form-input>
        </b-col>
      </b-row>

      <div @click="addNewDonation">
        <b-button block variant="primary">Dodaj pobranie materiału biologicznego do systemu</b-button>
      </div>
    </div>

    <b-link :to="'/reservation?date=false'">
      <b-button style="margin: 1rem">
        Powrót na stronę z rezerwacjami
      </b-button>
    </b-link>

  </b-container>

</template>

<script>
import DonorService from '../../services/donor.service';
import DonationService from '../../services/donation.service';
import ReservationService from '../../services/reservation.service'

export default {
  mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }

    ReservationService.getReservationById(this.$route.params.id).then(
        response => {
          const results_tmp = [];
          results_tmp.push({
            id: response.data.id,
            donorId: response.data.donorId,
            donorFirstName: response.data.donorFirstName,
            donorLastName: response.data.donorLastName,
            pesel: response.data.pesel,
            date: response.data.date,
            time: response.data.time,
            // donationType: response.data.donationType === 'plasma' ? 'osocze' : 'krew'
            donationType: response.data.donationType
          });
          this.reservationDetails = results_tmp;
          this.getDonor(response.data.donorId);
          this.selectedDonationType = response.data.donationType;
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
      shouldBeUnHide: true,
      isReleased: false,
      amount: '',
      reservationDetails: null,
      selectedDonationType: '',
      options: [
        {text: 'Pobranie krwi pełnej', value: 'blood'},
        {text: 'Donacja osocza', value: 'plasma'},
      ],
      donor: [],
      fields: [
        {key: 'id', label: 'ID'},
        {key: 'username', label: 'Login'},
        {key: 'email', label: 'Email'},
        {key: 'firstName', label: 'Imię'},
        {key: 'lastName', label: 'Nazwisko'},
        {key: 'pesel', label: 'PESEL'},
        {key: 'bloodGroupWithRh', label: 'Krew'},
        {key: 'gender', label: 'Płeć'},
      ],

    }
  },
  watch: {
    selectedDonationType() {
      this.amount = this.selectedDonationType === 'plasma' ? 600 : 450;
    }
  },
  methods: {
    addNewDonation() {
      DonationService.addNewDonation({
        amount: this.amount,
        date: this.reservationDetails[0].date,
        donationType: this.selectedDonationType,
        donorId: this.donor[0].id,
        isReleased: false,
        recipientId: null
      })
          .then(response => {
            this.makeToastSuccess('Donacja została została dodana do systemu!');
            this.shouldBeUnHide = false;
          })
          .catch(e => {
            this.makeToastError();
            console.log(e);
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
    getDonor(id) {
      DonorService.getDonorById(id).then(
          response => {
            const results_tmp = [];
            results_tmp.push({
              id: response.data.id,
              username: response.data.username,
              email: response.data.email,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              pesel: response.data.pesel,
              bloodGroupWithRh: response.data.bloodGroupWithRh,
              gender: response.data.gender
            });

            this.donor = results_tmp;
          },
          error => {
            this.content =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
          }
      )
    }
  }
}
</script>
