<template>
  <b-container style="z-index: 9999">
    <b-form-group v-slot="{ ariaDescribedby }" label="Wybór typu pobrania:">
      <b-form-radio-group
          v-model="selectedDonationType"
          :aria-describedby="ariaDescribedby"
          :options="options"
          name="radios-stacked"
          stacked
      ></b-form-radio-group>
    </b-form-group>

    <div v-if="selectedDonationType !== null">
      Wybierz termin:
      <b-form-datepicker
          v-model="dateValue"
          v-bind="labelsLanguagePL['pl']"
          :date-disabled-fn="dateDisabled"
          :min="soonestPossibleDate"
          locale="pl"
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

    <div ref="hoursContainer"/>

    <div v-if="selectedTime !== null && dateValue !== '' &&  selectedDonationType !== ''" @click="addNewReservation">
      <b-button block variant="primary">Zarezerwuj termin na pobranie materiału biologicznego</b-button>
    </div>

  </b-container>

</template>

<script>
import DonationService from '../services/donation.service';
import ReservationService from '../services/reservation.service'


export default {
  mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }

  },
  props: {
    'donorIdx': {
      type: Number
    }
  },
  data() {
    return {
      dateValue: '',
      donorId: this.donorIdx,
      soonestPossibleDate: null,
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
      selectedDonationType: null,
      options: [
        {text: 'Pobranie krwi pełnej', value: 'blood'},
        {text: 'Donacja osocza', value: 'plasma'},
        // { text: 'Third radio', value: 'third' }
      ],
      selectedTime: null,
      optionsTime: [],
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
      this.getHoursWithAvailability();
    }
  },
  methods: {
    addNewReservation() {
      ReservationService.addNewReservation({
        donorId: this.donorId,
        date: this.dateValue,
        time: this.selectedTime,
        donationType: this.selectedDonationType
      })
          .then(() => {
            this.makeToastSuccess('Rezerwacja została dodana!');
            this.selectedTime = null;
            this.dateValue = '';
            this.selectedDonationType = '';
          })
    },
    getHoursWithAvailability() {
      let loader;
      if (this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
        loader = this.$loading.show();
      } else {
        loader = this.$loading.show({
          container: this.$refs.hoursContainer,
          backgroundColor: "#ffffff"
        });
      }
      ReservationService.getHoursWithAvailability(this.dateValue).then(
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
            loader.hide();
          },
          () => {
            loader.hide();
          })
    },
    getDateForDonation() {
      let loader;
      if (this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
        loader = this.$loading.show();
      } else {
        loader = this.$loading.show({
          container: this.$refs.hoursContainer,
          backgroundColor: "#ffffff"
        });
      }

      DonationService.getSoonestPossibleDateForNextDonation(this.selectedDonationType, this.donorIdx)
          .then(
              response => {
                this.soonestPossibleDate = response.data.date;
                loader.hide();
              },
              () => {
                loader.hide();
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
