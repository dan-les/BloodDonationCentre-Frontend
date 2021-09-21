<template>
  <b-container fluid>
    <donor-details-header
        :donorIdx=this.$route.params.id
        :title=this.headerTitle
    ></donor-details-header>

    <b-row style="margin-top: 1rem;">
      <b-row>
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
          :fields="fieldsReservations"
          :filter="filter"
          :filter-included-fields="filterOn"
          :items="reservations"
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
          <b-button class="mr-1" size="sm" variant="danger" @click="deleteReservation(row.item.id)">Usuń</b-button>
        </template>

      </b-table>
    </b-row>

    <b-link :to="'/donors'">
      <b-button style="margin: 1rem">
        Powrót na stronę z dawcami
      </b-button>
    </b-link>
  </b-container>


</template>

<script>
import ReservationService from '../../services/reservation.service';
import DonorService from "../../services/donor.service";
import Reservation from "../../model/reservation";
import Donor from "../../model/donor";

export default {
  data() {
    return {
      headerTitle: 'Przegląd rezerwacji terminów dla danego użytkownika',
      reservations: [],
      fieldsReservations: [
        {key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
        {key: 'date', label: 'Data', sortable: true,},
        {key: 'time', label: 'Godzina', sortable: true,},
        {key: 'donationType', label: 'Typ pobrania', sortable: true,},
        {key: 'actions', label: 'Akcje'}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'date',
      sortDesc: true,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak rezerwacji.',
      sortDirection: 'asc',
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
      return this.fieldsReservations
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    }
  },

  mounted() {
    if (!this.$store.state.auth.user && !this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
      this.$router.push('/login');
    }
    DonorService.getDonorById(this.$route.params.id).then(
        response => {
          const results_tmp = [];
          results_tmp.push(
              new Donor(
                  response.data.id,
                  response.data.username,
                  response.data.email,
                  response.data.firstName,
                  response.data.lastName,
                  response.data.pesel,
                  response.data.bloodGroupWithRh,
                  response.data.gender
              )
          );
          this.donor = results_tmp;
        }
    )
    this.getAllReservationsByDonorId()
  },

  methods: {
    deleteReservation(id) {
      ReservationService.deleteReservation(id)
          .then(() => {
            this.$bvToast.toast('Pomyślnie usunięto rezerwację', {
              title: `Sukces`,
              variant: 'info',
              autoHideDelay: 2000,
              solid: true
            })
            this.getAllReservationsByDonorId();
          })
          .catch(() => {
            this.$bvToast.toast('Coś poszło nie tak...', {
              title: `Błąd`,
              variant: 'danger',
              autoHideDelay: 2000,
              solid: true
            })
          });
    },
    getAllReservationsByDonorId() {
      let loader = this.$loading.show();
      ReservationService.getAllReservationsByDonorId(this.$route.params.id)
          .then(response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push(
                  new Reservation(
                      response.data[idx].id,
                      response.data[idx].donorId,
                      response.data[idx].donorFirstName,
                      response.data[idx].donorLastName,
                      response.data[idx].pesel,
                      response.data[idx].date,
                      response.data[idx].time,
                      response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew'
                  ));
            }
            this.reservations = results_tmp;
            this.totalRows = this.reservations.length;
          })
          .finally(() => {
            loader.hide();
          })
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
  },


}
</script>


