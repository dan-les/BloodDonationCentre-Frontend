<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
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
  </b-card>
</template>

<script>
import DonationService from '../../services/donation.service';
import ReservationService from '../../services/reservation.service'
import Donation from "../../model/donation";
import Reservation from "../../model/reservation";

export default {
  mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }
    let loader = this.$loading.show();
    ReservationService.getReservationById(this.$route.params.id)
        .then(response => {
          const results_tmp = [];
          results_tmp.push(
              new Reservation(
                  response.data.id,
                  response.data.donorId,
                  response.data.donorFirstName,
                  response.data.donorLastName,
                  response.data.pesel,
                  response.data.date,
                  response.data.time,
                  response.data.donationType
              ));
          this.reservationDetails = results_tmp;
          this.donorIdx = response.data.donorId;
          this.selectedDonationType = response.data.donationType;
        })
        .finally(() => {
          loader.hide();
        })
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
      DonationService.addNewDonation(
          new Donation(
              null,
              this.reservationDetails[0].date,
              this.amount,
              this.selectedDonationType,
              this.donorIdx,
              '',
              '',
              '',
              false,
              null,
              '',
              this.$route.params.id
          )
      ).then(() => {
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
