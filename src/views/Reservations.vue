<template>
  <b-container fluid>
    <b-jumbotron
        header="Przegląd wszystkich rezerwacji" header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>
    <b-row>
      <!--       TODO - dodawanie rozerwacji bez wcześniej wybranego dawncy-->
      <!--      <b-col md="2" offset-md="10">-->
      <!--        &lt;!&ndash;        <b-link :to="{ name: 'editDonor', param:  12}">&ndash;&gt;-->
      <!--        <b-button block variant="primary">Dodaj dawcę!</b-button>-->
      <!--        &lt;!&ndash;        </b-link>&ndash;&gt;-->
      <!--      </b-col>-->
    </b-row>

    <div v-if="isDatePickerEnabled === 'true' || isDatePickerEnabled === true">
      Ustaw termin:
      <b-form-datepicker
          v-model="dateValue"
          v-bind="labelsLanguagePL['pl']"
          :initial-date="dateValue"
          label-today
          locale="pl"
          start-weekday="1"
          today-button>

      </b-form-datepicker>
    </div>

    <b-row style="margin-top: 1rem;">
      <!-- User Interface controls -->
      <b-row>
        <!-- sortowanie-->
        <b-col class="my-1" lg="6">
          <b-form-group
              v-slot="{ ariaDescribedby }"
              class="mb-0"
              label="Sortowanie danych"
              label-align-sm="right"
              label-cols-sm="3"
              label-for="sort-by-select"
              label-size="sm"
          >
            <b-input-group size="sm">
              <b-form-select
                  id="sort-by-select"
                  v-model="sortBy"
                  :aria-describedby="ariaDescribedby"
                  :options="sortOptions"
                  class="w-50"
              >
                <template #first>
                  <option value="">-- brak sortowania --</option>
                </template>
              </b-form-select>

              <b-form-select
                  v-model="sortDesc"
                  :aria-describedby="ariaDescribedby"
                  :disabled="!sortBy"
                  class="w-25"
                  size="sm"
              >
                <option :value="false">Rosnąco (A-Z)</option>
                <option :value="true">Malejąco (Z-A)</option>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col class="my-1" lg="6">

        </b-col>

        <b-col class="my-1" lg="6">
          <b-form-group
              class="mb-0"
              label="Filtrowanie danych"
              label-align-sm="right"
              label-cols-sm="3"
              label-for="filter-input"
              label-size="sm"
          >
            <b-input-group size="sm">
              <b-form-input
                  id="filter-input"
                  v-model="filter"
                  placeholder="Wpisz, aby wyszukać"
                  type="search"
              ></b-form-input>

              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Wyczyść pole</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>

        <b-col class="my-1" lg="6">
          <b-form-group
              v-slot="{ ariaDescribedby }"
              v-model="sortDirection"
              class="mb-0"
              description="Aby filtrować po wszystkich danych odznacz wszystko"
              label="Filtruj według"
              label-align-sm="right"
              label-cols-sm="3"
              label-size="sm"
          >
            <b-form-checkbox-group
                v-model="filterOn"
                :aria-describedby="ariaDescribedby"
                class="mt-1"
            >
              <b-form-checkbox value="donorFirstName">Imię</b-form-checkbox>
              <b-form-checkbox value="donorLastName">Nazwisko</b-form-checkbox>
              <b-form-checkbox value="pesel">Pesel</b-form-checkbox>
              <b-form-checkbox value="donationType">Typ pobrania</b-form-checkbox>

            </b-form-checkbox-group>
          </b-form-group>
        </b-col>

        <b-col class="my-1" md="6" sm="5">
          <b-form-group
              class="mb-0"
              label="Ile osób na stronę"
              label-align-sm="right"
              label-cols-lg="3"
              label-cols-md="4"
              label-cols-sm="6"
              label-for="per-page-select"
              label-size="sm"
          >
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>

        <b-col class="my-1" md="6" sm="7">
          <b-pagination
              v-model="currentPage"
              :per-page="perPage"
              :total-rows="totalRows"
              align="fill"
              class="my-0"
              size="sm"
          ></b-pagination>
        </b-col>
      </b-row>

      <b-table
          :current-page="currentPage"
          :empty-filtered-text="emptyFilteredText"
          :empty-text="emptyText"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :items="items"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          show-empty
          small
          stacked="md"
          @filtered="onFiltered"
      >
        <template #cell(actions)="row">
          <b-link :to="{ name: 'addDonation', params: { id: row.item.id}  }">
            <b-button class="mr-1" size="sm" variant="primary">Dodaj pobranie</b-button>
          </b-link>
          <b-button class="mr-1" size="sm" variant="danger" @click="deleteReservation(row.item.id)">Usuń</b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-row>
  </b-container>


</template>

<script>
import ReservationService from '../services/reservation.service';

export default {
  data() {
    const todayDate = new Date().toISOString().slice(0, 10);
    return {
      labelsLanguagePL: {
        pl: {
          labelPrevDecade: "Poprzednia dekada",
          labelPrevYear: "Poprzedni rok",
          labelPrevMonth: "Poprzedni miesiąc",
          labelCurrentMonth: "Bieżący miesiąc",
          labelNextMonth: "Następny miesiąc",
          labelNextYear: "Następny rok",
          labelNextDecade: "Następna dekada",
          labelTodayButton: "Dzisiaj",
          labelSelected: "Wybrana data",
          labelNoDateSelected: "Nie wybrano żadnej daty",
          labelCalendar: "Kalendarz",
          labelNav: "Nawigacja kalendarza",
          labelHelp: "Poruszaj się po kalendarzu za pomocą klawiszy strzałek"
        }
      },
      isDatePickerEnabled: '',
      dateValue: todayDate,
      items: [],
      fields: [
        {key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
        {key: 'donorFirstName', label: 'Imię', sortable: true, sortDirection: 'desc'},
        {key: 'donorLastName', label: 'Nazwisko', sortable: true, sortDirection: 'desc'},
        {key: 'pesel', label: 'PESEL', sortable: true, class: 'text-center'},
        {key: 'date', label: 'Data', sortable: true,},
        {key: 'time', label: 'Godzina', sortable: true,},
        {key: 'donationType', label: 'Typ pobrania', sortable: true,},
        {key: 'actions', label: 'Akcje'}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'time',
      sortDesc: false,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak rezerwacji.',
      sortDirection: ' ',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      }
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    }
  },
  watch: { //rozwiązanie na zmieniające sie linki
    $route() {
      this.$router.go(this.$router.currentRoute)
    },
    dateValue() {
      this.getProperReservations();

    },
    isDatePickerEnabled() {
      this.getProperReservations();

    }

  },
  mounted() {
    // sprawdzenie, czy w ścieżce jest date jako true czy jako false
    this.isDatePickerEnabled = this.$route.query.date;
    // this.getProperReservations();

  },
  methods: {
    deleteReservation(id) {
      ReservationService.deleteReservation(id)
          .then(response => {
            this.getProperReservations();
            this.makeToastSuccess('Pomyślnie usunięto rezerwację');
          })
          .catch(e => {
            this.makeToastError();
            console.log(e);
          });

    },
    getProperReservations() {
      if (this.isDatePickerEnabled === 'true') {
        ReservationService.getAllReservationsByDate(this.dateValue).then(
            response => {
              const results_tmp = [];
              for (const idx in response.data) {

                results_tmp.push({
                  id: response.data[idx].id,
                  donorFirstName: response.data[idx].donorFirstName,
                  donorLastName: response.data[idx].donorLastName,
                  pesel: response.data[idx].pesel,
                  date: response.data[idx].date,
                  time: response.data[idx].time,
                  donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew'
                });
              }
              this.items = results_tmp;
              // Set the initial number of items
              this.totalRows = this.items.length;
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
            }
        )
      } else {
        ReservationService.getAllReservations().then(
            response => {
              const results_tmp = [];
              for (const idx in response.data) {

                results_tmp.push({
                  id: response.data[idx].id,
                  donorFirstName: response.data[idx].donorFirstName,
                  donorLastName: response.data[idx].donorLastName,
                  pesel: response.data[idx].pesel,
                  date: response.data[idx].date,
                  time: response.data[idx].time,
                  donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew'
                });
              }
              this.items = results_tmp;
              // Set the initial number of items
              this.totalRows = this.items.length;
            },
            error => {
              this.content =
                  (error.response && error.response.data && error.response.data.message) ||
                  error.message ||
                  error.toString();
            }
        )
      }
    },

    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
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


