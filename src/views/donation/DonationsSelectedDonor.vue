<template>
  <b-container>
    <donor-details-header
        :donorIdx="this.$route.params.id"
        :title="this.headerTitle"
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
              <b-form-checkbox value="date">Data pobrania</b-form-checkbox>
              <b-form-checkbox value="donationType">Rodzaj pobrania</b-form-checkbox>


            </b-form-checkbox-group>
          </b-form-group>
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
import DonationService from '../../services/donation.service';
import Donation from "../../model/donation";

export default {
  computed: {
    sortOptions() {
      return this.fieldsDonations
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    }
  },
  mounted() {
    let loader = this.$loading.show();
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }

    DonationService.getAllDonationsByDonorId(this.$route.params.id).then(
        response => {
          const results_tmp = [];
          for (const idx in response.data) {
            results_tmp.push(
                new Donation(
                    response.data[idx].id,
                    response.data[idx].date,
                    response.data[idx].amount,
                    response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew'
                )
            );
          }
          this.donations = results_tmp;
          this.totalRows = this.donations.length;
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
  },
  data() {
    return {
      headerTitle: 'Spis wszystkich donacji',
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'date',
      sortDesc: true,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak dostępnych pobrań.',
      sortDirection: 'asc',
      filter: null,
      filterOn: [],

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
