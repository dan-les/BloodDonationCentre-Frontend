<template>
  <b-container>
      <b-jumbotron
          header="Rezerwacja terminu na pobranie krwi" header-tag="h4" header-level="5" style="padding: 0.9rem">
      </b-jumbotron>

    <b>Wybrany dawca:</b>
    <b-table
        small :fields="fields" :items="donor" responsive="sm">
    </b-table>


    <b-form-group label="Wybór typu pobrania:" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
          v-model="selectedCollectionType"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radios-stacked"
          stacked
      ></b-form-radio-group>
    </b-form-group>
<!--    <div class="mt-3">Selected: <strong>{{ selected }}</strong></div>-->

    Wybierz termin:
    <b-form-datepicker  v-model="value" :min="min" :max="max" locale="pl" v-bind="labelsLanguagePL['pl']"></b-form-datepicker>


    <b-form-group style="margin-top: 1.3rem"
        label="Wybierz godzinę:"
        v-slot="{ ariaDescribedby }"
    >
      <b-form-radio-group
          id="btn-radios-2"
          v-model="selectedTime"
          :options="optionsTime"
          :aria-describedby="ariaDescribedby"
          button-variant="outline-primary"
          name="radio-btn-outline"
          buttons

      ></b-form-radio-group>
    </b-form-group>


    <b-card class="mt-3" header="JSON - POST">
      <pre class="m-0">{{ donor }}</pre>
      {{max}}
    </b-card>
  </b-container>

</template>

<script>
import DonorService from '../services/donor.service';

export default {
  mounted() {
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

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // 15th two months prior
    const minDate = new Date(today)
    minDate.setMonth(minDate.getMonth() - 2)
    minDate.setDate(15)
    // 15th in two months
    const maxDate = new Date(today)
    maxDate.setMonth(maxDate.getMonth() + 2)
    maxDate.setDate(15)
    // maxDate.setFullYear(2022);

    return {
      value: '',
      min: minDate,
      max: maxDate,
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

        }},
      selectedCollectionType: 'blood',
      options: [
        { text: 'Pobranie krwi pełnej', value: 'blood' },
        { text: 'Donacja osocza', value: 'plasma' },
        // { text: 'Third radio', value: 'third' }
      ],
      selectedTime: null,
      optionsTime: [
        { text: '8:00', value: 'radio1' },
        { text: '9:00', value: 'radio2' },
        { text: '10:00', value: 'radio3', disabled: true },
        { text: '11:00', value: 'radio4' },
        { text: '12:00', value: 'radio5' },
        { text: '13:00', value: 'radio6' },
        { text: '14:00', value: 'radio7', disabled: true },
        { text: '15:00', value: 'radio8' },
        { text: '16:00', value: 'radio9' },
        { text: '17:00', value: 'radio10' },
        { text: '18:00', value: 'radio11', disabled: true },
        { text: '19:00', value: 'radio12' }],
      donor: [{
        // email: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        pesel: '',
        bloodGroupWithRh: null,
        gender: null
        // checked: []
      }],
      fields: [
        {key: 'id', label: 'ID' },
        {key: 'username', label: 'Login' },
        {key: 'email', label: 'Email' },
        {key: 'firstName', label: 'Imię' },
        {key: 'lastName', label: 'Nazwisko' },
        {key: 'pesel', label: 'PESEL' },
        {key: 'bloodGroupWithRh', label: 'Krew' },
        {key: 'gender', label: 'Płeć' },
      ],

      bloods: [{text: 'wybierz grupę krwi', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      genders: [{text: 'wybierz płeć', value: null}, {text: 'Kobieta', value: 'K'}, {text: 'Mężczyzna', value: 'M'}],
      show: true

    }
  },
  methods: {
    // onSubmit(event) {
    //   console.log(this.form);
    //
    //   event.preventDefault()
    //   // alert(JSON.stringify(this.form))
    //
    //   DonorService.putDonor(this.$route.params.id, this.form)
    //       .then(response => {
    //         this.makeToastSuccess('Dane dawcy zostały pomyślnie zmienione');
    //       })
    //       .catch(e => {
    //         this.makeToastError();
    //         console.log(e);
    //       });
    //
    // }
    // ,
    // onReset(event) {
    //   event.preventDefault()
    //   // Reset our form values
    //   this.form.username = '',
    //       this.form.email = '',
    //       this.form.firstName = '',
    //       this.form.lastName = '',
    //       this.form.pesel = '',
    //       this.form.bloodGroupWithRh = null
    //   this.form.gender = null
    //
    //   // Trick to reset/clear native browser form validation state
    //   this.show = false
    //   this.$nextTick(() => {
    //     this.show = true
    //   })
    // },
    //
    // makeToastSuccess: function (message) {
    //   this.$bvToast.toast(message, {
    //     title: `Sukces`,
    //     variant: 'info',
    //     autoHideDelay: 2000,
    //     solid: true
    //   })
    //
    // },
    // makeToastError() {
    //   this.$bvToast.toast('Coś poszło nie tak...', {
    //     title: `Błąd`,
    //     variant: 'danger',
    //     autoHideDelay: 2000,
    //     solid: true
    //   })
    // },
    // deleteDonor() {
    //   DonorService.deleteDonor(this.$route.params.id)
    //       .then(response => {
    //         this.form.username = '',
    //             this.form.email = '',
    //             this.form.firstName = '',
    //             this.form.lastName = '',
    //             this.form.pesel = '',
    //             this.form.bloodGroupWithRh = null
    //         this.form.gender = null
    //
    //         this.makeToastSuccess('Pomyślnie usunięto dawcę');
    //       })
    //       .catch(e => {
    //         this.makeToastError();
    //         console.log(e);
    //       });
    // }
  }
}
</script>
