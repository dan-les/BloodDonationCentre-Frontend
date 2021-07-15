<template>
  <b-container fluid>
    <b-jumbotron
        header="Przegląd dawców" header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>
    <b-row>
      <b-col md="2" offset-md="10">
        <!--        <b-link :to="{ name: 'editDonor', param:  12}">-->
        <b-button block variant="primary">Dodaj dawcę!</b-button>
        <!--        </b-link>-->
      </b-col>
    </b-row>

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
              <b-form-checkbox value="firstName">Imię</b-form-checkbox>
              <b-form-checkbox value="lastName">Nazwisko</b-form-checkbox>
              <b-form-checkbox value="pesel">Pesel</b-form-checkbox>
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
        <template #cell(name)="row">
          {{ row.value.firstName }} {{ row.value.lastName }}
        </template>

        <template #cell(actions)="row">
          <!--          <b-button class="mr-1" size="sm" @click="info(row.item, row.index, $event.target)">-->
          <!--            Info modal - JSON-->
          <!--          </b-button>-->
          <!--          <b-button size="sm" style="margin-right: 0.8rem;" @click="row.toggleDetails">-->
          <!--            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details - JSON-->
          <!--          </b-button>-->

          <b-link :to="{ name: 'addReservation', params: { id: row.item.id}  }">
            <b-button class="mr-1" size="sm" variant="primary">Umów wizytę</b-button>
          </b-link>

          <b-link :to="{ name: 'editDonor', params: { id: row.item.id}  }">
            <b-button class="mr-1" size="sm" style="margin-left: 0.6rem">Edytuj</b-button>
          </b-link>

        </template>

        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>

          </b-card>

        </template>
        <!--        <template #cell(actions)="row">-->
        <!--        <b-link :to="{ name: 'addDonor' }">-->
        <!--          <b-button block variant="primary">Dodaj dawcę!</b-button>-->
        <!--        </b-link>-->
        <!--        </template>-->

      </b-table>

      <!-- Info modal -->
      <!--      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">-->
      <!--        <pre>{{ infoModal.content }}</pre>-->
      <!--      </b-modal>-->
    </b-row>
  </b-container>


</template>

<script>
import DonorService from '../services/donor.service';

export default {
  data() {
    return {
      items: [],
      fields: [
        {key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
        {key: 'username', label: 'Login', sortable: true, sortDirection: 'desc'},
        {key: 'email', label: 'Email', sortable: true, sortDirection: 'desc'},
        {key: 'firstName', label: 'Imię', sortable: true, sortDirection: 'desc'},
        {key: 'lastName', label: 'Nazwisko', sortable: true, sortDirection: 'desc'},
        {key: 'pesel', label: 'PESEL', sortable: true, class: 'text-center'},
        {key: 'bloodGroupWithRh', label: 'Krew', sortable: true,},
        {key: 'gender', label: 'Płeć', sortable: true,},
        // {
        //   key: 'blood',
        //   label: 'Czy aktywny?',
        //   formatter: (value, key, item) => {
        //     return value ? 'Yes' : 'No'
        //   },
        //   sortable: true,
        //   sortByFormatted: true,
        //   filterByFormatted: true
        // },
        {key: 'actions', label: 'Akcje'}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'lastName',
      sortDesc: false,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak danych. Coś poszło nie tak... ☹',
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
  mounted() {
    DonorService.getAllDonors().then(
        response => {
          // console.log(response);
          const results_tmp = [];
          for (const idx in response.data) {

            results_tmp.push({
              id: response.data[idx].id,
              username: response.data[idx].username,
              email: response.data[idx].email,
              firstName: response.data[idx].firstName,
              lastName: response.data[idx].lastName,
              pesel: response.data[idx].pesel,
              bloodGroupWithRh: response.data[idx].bloodGroupWithRh,
              gender: response.data[idx].gender
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


  },
  methods: {
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
      // Trigger pagination to update the number of buttons/pages due to filtering
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


