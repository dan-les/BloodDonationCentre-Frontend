<template>
  <b-container>
    <b-jumbotron
        header="Przegląd dawców" header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>

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
              <b-form-checkbox value="id">ID</b-form-checkbox>
              <b-form-checkbox value="username">Login</b-form-checkbox>
              <b-form-checkbox value="firstName">Imię</b-form-checkbox>
              <b-form-checkbox value="lastName">Nazwisko</b-form-checkbox>
              <b-form-checkbox value="pesel">PESEL</b-form-checkbox>
              <b-form-checkbox value="bloodGroupWithRh">Krew</b-form-checkbox>
              <b-form-checkbox value="gender">Płeć</b-form-checkbox>
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

      <!-- Main table element -->
      <b-table
          :current-page="currentPage"
          :empty-filtered-text="emptyFilteredText"
          :empty-text="emptyText"
          :fields="tableFields"
          :filter="filter"
          :filter-included-fields="filterOn"
          :items="donors"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          show-empty
          small


          stacked="md"
          @filtered="onFiltered"
      >
        <!--        <template #cell(name)="row">-->
        <!--          {{ row.value.firstName }} {{ row.value.lastName }}-->
        <!--        </template>-->

        <template #cell(actions)="row">

          <b-button class="mr-1 mt-1" size="sm" variant="info" @click="row.toggleDetails">
            {{ row.detailsShowing ? 'Ukryj' : 'Szczegóły' }}
          </b-button>


          <b-link :to="{ name: 'donationsSelectedDonor', params: { id: row.item.id}  }">
            <b-button class="mr-1 mt-1" size="sm" variant="primary">Pobrania</b-button>
          </b-link>
          <!--          <b-link :to="{ name: 'addReservation', params: { id: row.item.id}  }">-->
          <!--            <b-button class="mr-1" size="sm" variant="primary">Umów termin</b-button>-->
          <!--          </b-link>-->

          <b-dropdown class="mr-1 mt-1" size="sm" text="Rezerwacje" variant="primary">
            <b-dropdown-item>
              <b-link :to="{ name: 'addReservation', params: { id: row.item.id}  }">
                <b-button class="mr-1 mt-1" size="sm" variant="primary">Zarezerwuj termin na pobranie</b-button>
              </b-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <b-link :to="{ name: 'DonorReservations', params: { id: row.item.id}  }">
                <b-button class="mr-1 mt-1" size="sm" variant="primary">Historia rezerwacji terminów</b-button>
              </b-link>
            </b-dropdown-item>
          </b-dropdown>

          <b-link :to="{ name: 'editDonor', params: { id: row.item.id}  }">
            <b-button class="mr-1 mt-1" size="sm">Edytuj</b-button>
          </b-link>
        </template>
        <template #row-details="row">
          <b-card>
            <ul>
              <li><strong>Id</strong>: {{ row.item.id }}</li>
              <li><strong>Login</strong>: {{ row.item.username }}</li>
              <li><strong>E-mail</strong>: {{ row.item.email }}</li>
              <li><strong>Imię</strong>: {{ row.item.firstName }}</li>
              <li><strong>Nazwisko</strong>: {{ row.item.lastName }}</li>
              <li><strong>PESEL</strong>: {{ row.item.pesel }}</li>
              <li><strong>Grupa kwri</strong>: {{ row.item.bloodGroupWithRh }}</li>
              <li><strong>Płeć</strong>: {{ row.item.gender }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>
    </b-row>

  </b-container>
</template>

<script>
import DonorService from '../../services/donor.service';
import Donor from "../../model/donor";

export default {
  data() {
    return {
      donors: [],
      tableFields: [
        {key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
        // {key: 'username', label: 'Login', sortable: true, sortDirection: 'desc'},
        // {key: 'email', label: 'Email', sortable: true, sortDirection: 'desc'},
        {key: 'firstName', label: 'Imię', sortable: true, sortDirection: 'desc'},
        {key: 'lastName', label: 'Nazwisko', sortable: true, sortDirection: 'desc'},
        {key: 'pesel', label: 'PESEL', sortable: true, class: 'text-center'},
        {key: 'bloodGroupWithRh', label: 'Krew', sortable: true,},
        // {key: 'gender', label: 'Płeć', sortable: true,},
        {key: 'actions', label: 'Akcje', class: 'text-center'}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'lastName',
      sortDesc: false,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak danych. ',
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
      return this.tableFields
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    }
  },
  mounted() {
    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
      this.$router.push('/login');
    }

    let loader = this.$loading.show();
    DonorService.getAllDonors().then(
        response => {
          const results_tmp = [];
          for (const idx in response.data) {
            results_tmp.push(
                new Donor(
                    response.data[idx].id,
                    response.data[idx].username,
                    response.data[idx].email,
                    response.data[idx].firstName,
                    response.data[idx].lastName,
                    response.data[idx].pesel,
                    response.data[idx].bloodGroupWithRh,
                    response.data[idx].gender
                ));
          }
          this.donors = results_tmp;
          this.totalRows = this.donors.length;
          loader.hide();
        },
        () => {
          loader.hide();
        }
    )
  },
  methods: {
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
    },
  }
}
</script>


