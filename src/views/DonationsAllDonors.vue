<template>
  <b-container>
    <b-jumbotron
        header="Spis wszystkich donacji" header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>

    <b-row>

      <b-col>
        <b-form-group v-slot="{ ariaDescribedby }" label="Dostępność dawek z materiałem biologicznym:">
          <b-form-radio
              v-model="selectedIsReleased" :aria-describedby="ariaDescribedby" value=null>Wszystkie rodzaje dostępności
          </b-form-radio>
          <b-form-radio
              v-model="selectedIsReleased" :aria-describedby="ariaDescribedby" value="false">Dostępne
          </b-form-radio>
          <b-form-radio
              v-model="selectedIsReleased" :aria-describedby="ariaDescribedby" value="true">Wydane innym
            podmiotom
          </b-form-radio>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group v-slot="{ ariaDescribedby }" label="Filtruj według typu pobrania:">
          <b-form-radio
              v-model="selectedDonationType" :aria-describedby="ariaDescribedby" value=null>Wszystkie rodzaje pobrań
          </b-form-radio>
          <b-form-radio
              v-model="selectedDonationType" :aria-describedby="ariaDescribedby" value="blood">Pobranie krwi
          </b-form-radio>
          <b-form-radio
              v-model="selectedDonationType" :aria-describedby="ariaDescribedby" value="plasma">Pobranie osocza
          </b-form-radio>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group id="input-group-3" label="Filtruj według grupy krwi:">
          <b-form-select
              id="blood"
              v-model="selectedBloodGroupWithRh"
              :options="bloods"
              required
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>


    <!--    <div class="mt-3">Selected: <strong>{{ selectedDonationType }}</strong></div>-->


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


        <b-col class="my-1" md="6" sm="5">
          <b-form-group
              class="mb-0"
              label="Ile wierszy na stronę"
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
          :fields="fieldsDonations"
          :filter="filter"
          :filter-included-fields="filterOn"
          :items="donations"
          :per-page="perPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          show-empty
          small
          stacked="md"
          @filtered="onFiltered"
      >
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
import DonationService from '../services/donation.service';

export default {
  computed: {
    sortOptions() {
      return this.fieldsDonations
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    },

    propertiesChangeChecker() {
      return `${this.selectedDonationType}|${this.selectedIsReleased}|${this.selectedBloodGroupWithRh}`;
    },
  },
  watch:{
    propertiesChangeChecker(newVal) {
      // sprawdzanie czy zmieniła się wartość którejś z trzech zmiennych
      const [newSelectedDonationType, newSelectedIsReleased, newSelectedBloodGroupWithRh] = newVal.split('|');
      newSelectedDonationType = newSelectedDonationType === 'null' ? null : newSelectedDonationType;


      if(newSelectedDonationType === 'null' && newSelectedIsReleased === 'null' && newSelectedBloodGroupWithRh === 'null'){
        this.getAllDonations();
      }

    },
  },
  mounted() {
    // this.getAllDonations();
  },
  methods: {
    getAllDonations(){
      DonationService.getAllDonations().then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push({
                id: response.data[idx].id,
                date: response.data[idx].date,
                amount: response.data[idx].amount,
                donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew',
              });
            }
            this.donations = results_tmp;
            // Set the initial number of items
            this.totalRows = this.donations.length;
          },
          error => {
            this.content =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
          }
      )
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

  },
  data() {
    return {
      selectedDonationType: null,
      selectedIsReleased: null,
      selectedBloodGroupWithRh: null,

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'date',
      sortDesc: true,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak dostępnych pobrań.',
      sortDirection: '',
      filter: null,
      filterOn: [],
      bloods: [{text: 'Wszystkie rodzaje', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      fieldsDonations: [
        {key: 'id', label: 'ID', sortable: true, class: 'text-center'},
        {key: 'date', label: 'Data pobrania', sortable: true, class: 'text-center'},
        {key: 'amount', label: 'Ilość pobranego materiału biolgicznego [ml]', sortable: true, class: 'text-center'},
        {key: 'donationType', label: 'Typ pobrania', sortable: true, class: 'text-center'}
      ],
      donations: [],
    }
  },


}
</script>
