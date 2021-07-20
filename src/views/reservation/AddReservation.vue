<template>
  <b-container>
    <b-jumbotron
        header="Rezerwacja terminu na pobranie krwi" header-level="5" header-tag="h4" style="padding: 0.9rem">
      Wybrany dawca:
      <b-table
          :fields="fields" :items="donor" responsive="sm" small>
      </b-table>
    </b-jumbotron>


    <b-form-group v-slot="{ ariaDescribedby }" label="Wybór typu pobrania:">
      <b-form-radio-group
          v-model="selectedDonationType"
          :aria-describedby="ariaDescribedby"
          :options="options"
          name="radios-stacked"
          stacked
      ></b-form-radio-group>
    </b-form-group>

    <div v-if="selectedDonationType !== ''">
      Wybierz termin:
      <b-form-datepicker
          v-model="dateValue" v-bind="labelsLanguagePL['pl']" :date-disabled-fn="dateDisabled" :min="min" locale="pl"
          start-weekday="1">

      </b-form-datepicker>
    </div>

    <div v-if="dateValue !== ''">
      <b-form-group v-slot="{ ariaDescribedby }"
                    label="Wybierz godzinę:"
                    style="margin-top: 1.3rem"
      >
        <b-form-radio-group
            id="btn-radios-2"
            v-model="selectedTime"
            :aria-describedby="ariaDescribedby"
            :options="optionsTime"
            button-variant="outline-primary"
            buttons
            name="radio-btn-outline"
        ></b-form-radio-group>
      </b-form-group>

    </div>

    <div v-if="selectedTime !== null && dateValue !== '' &&  selectedDonationType !== ''" @click="addNewReservation">
      <b-button block variant="primary">Zarezerwuj termin na pobranie materiału biologicznego</b-button>
    </div>

    <!--    <b-card class="mt-3" header="JSON - POST">-->
    <!--      <pre class="m-0">{{ donor }}</pre>-->
    <!--      {{ max }}-->
    <!--    </b-card>-->
    <b-link :to="'/donors'">
      <b-button style="margin: 1rem">
        Powrót na stronę z dawcami
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

    DonorService.getDonorById(this.$route.params.id).then(
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
  },
  data() {
    return {
      dateValue: '',
      min: null,

      labelsLanguagePL: {
        pl: {
          labelPrevDecade: "Poprzednia dekada",
          labelPrevYear: "Poprzedni rok",
          labelPrevMonth: "Poprzedni miesiąc",
          labelCurrentMonth: "Bieżący miesiąc",
          labelNextMonth: "Następny miesiąc",
          labelNextYear: "Następny rok",
          labelNextDecade: "Następna dekada",
          labelToday: "Dzisiaj",
          labelSelected: "Wybrana data",
          labelNoDateSelected: "Nie wybrano żadnej daty",
          labelCalendar: "Kalendarz",
          labelNav: "Nawigacja kalendarza",
          labelHelp: "Poruszaj się po kalendarzu za pomocą klawiszy strzałek"

        }
      },
      selectedDonationType: '',
      options: [
        {text: 'Pobranie krwi pełnej', value: 'blood'},
        {text: 'Donacja osocza', value: 'plasma'},
        // { text: 'Third radio', value: 'third' }
      ],
      selectedTime: null,
      optionsTime: [],
      donor: [{}],
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

      bloods: [{text: 'wybierz grupę krwi', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      genders: [{text: 'wybierz płeć', value: null}, {text: 'Kobieta', value: 'K'}, {text: 'Mężczyzna', value: 'M'}],
      show: true

    }
  },

  watch: {
    selectedDonationType: function () {
      this.getDateForDonation();
    },
    dateValue: function () {

      this.getHours();
    }
  },
  methods: {
    addNewReservation() {
      ReservationService.addNewReservation({
        donorId: this.donor[0].id,
        date: this.dateValue,
        time: this.selectedTime,
        donationType: this.selectedDonationType
      })
          .then(response => {
            this.makeToastSuccess('Rezerwacja została dodana!');
            this.selectedTime = null;
            this.dateValue = '';
            this.selectedDonationType = '';
          })
          .catch(e => {
            this.makeToastError();
            console.log(e);
          })
    },

    getHours() {
      ReservationService.getHours(this.dateValue).then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {

              results_tmp.push({
                text: response.data[idx].hour,
                value: response.data[idx].hour,
                disabled: response.data[idx].disabled,
              });
            }
            this.optionsTime = results_tmp;

          },
          error => {
            this.content =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
          }
      )
    },
    getDateForDonation() {
      DonationService.getSoonestPossibleDateForNextDonation(this.selectedDonationType, this.$route.params.id)
          .then(
              response => {
                this.min = response.data.date;
              }
          )

    },
    dateDisabled(ymd, date) {
      // Disable weekends (Sunday = `0`, Saturday = `6`) and
      // disable days that fall on the 13th of the month
      const weekday = date.getDay()
      // const day = date.getDate()
      // Return `true` if the date should be disabled
      // return weekday === 0 || weekday === 6 || day === 13
      return weekday === 0
    },
    makeToastSuccess: function (message) {
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
