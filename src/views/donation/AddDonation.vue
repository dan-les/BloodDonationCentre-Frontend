<template>
  <b-container>
    <donor-details-header
        v-if="donorIdx !== null"
        :donorIdx=this.donorIdx
        :title=this.headerTitle
    ></donor-details-header>

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
          this.donorIdx = response.data.donorId;
          this.selectedDonationType = response.data.donationType;
        }
    )
  },
  data() {
    return {
      headerTitle: "Dodawanie donacji",
      donorIdx: null,
      shouldBeUnHide: true,
      isReleased: false,
      amount: '',
      reservationDetails: null,
      selectedDonationType: '',
      options: [
        {text: 'Pobranie krwi pełnej', value: 'blood'},
        {text: 'Donacja osocza', value: 'plasma'},
      ]
    }
  },
  watch: {
    selectedDonationType() {
      this.amount = this.selectedDonationType === 'plasma' ? 600 : 450;
    }
  },
  methods: {
    addNewDonation() {
      console.log(this.reservationDetails)
      DonationService.addNewDonation({
        amount: this.amount,
        date: this.reservationDetails[0].date,
        donationType: this.selectedDonationType,
        donorId: this.donorIdx,
        isReleased: false,
        recipientId: null
      }).then(response => {
        this.makeToastSuccess('Donacja została została dodana do systemu!');
        this.shouldBeUnHide = false;
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
    }
  }
}
</script>
