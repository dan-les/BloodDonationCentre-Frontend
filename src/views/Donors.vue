<template>
  <b-container fluid style="margin-top: 1rem">

    <b-row>
      <b-col md="2" offset-md="10">
        <b-button block variant="primary">Dodaj dawcę!</b-button>
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
                  placeholder="Type to Search"
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
              <b-form-checkbox value="name">Imię</b-form-checkbox>
              <b-form-checkbox value="age">Wiek</b-form-checkbox>
              <b-form-checkbox value="isActive">Czy aktywny</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>

        <b-col class="my-1" md="6" sm="5" >
          <b-form-group
              class="mb-0"
              label="Ile danych"
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
          {{ row.value.first }} {{ row.value.last }}
        </template>

        <template #cell(actions)="row">
          <b-button class="mr-1" size="sm" @click="info(row.item, row.index, $event.target)">
            Info modal
          </b-button>
          <b-button size="sm" @click="row.toggleDetails">
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
          </b-button>
        </template>

        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
            </ul>
          </b-card>
        </template>
      </b-table>

      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-row>
  </b-container>


</template>

<script>
export default {
  data() {
    return {
      items: [
        {isActive: true, age: 40, name: {first: 'Dickerson', last: 'Macdonald'}},
        {isActive: false, age: 21, name: {first: 'Larsen', last: 'Shaw'}},
        {
          isActive: false,
          age: 9,
          name: {first: 'Mini', last: 'Navarro'},

        },
        {isActive: false, age: 89, name: {first: 'Geneva', last: 'Wilson'}},
        {isActive: true, age: 38, name: {first: 'Jami', last: 'Carney'}},
        {isActive: false, age: 27, name: {first: 'Essie', last: 'Dunlap'}},
        {isActive: true, age: 40, name: {first: 'Thor', last: 'Macdonald'}},
        {
          isActive: true,
          age: 87,
          name: {first: 'Larsen', last: 'Shaw'},
        },
        {isActive: false, age: 26, name: {first: 'Mitzi', last: 'Navarro'}},
        {isActive: false, age: 22, name: {first: 'Genevieve', last: 'Wilson'}},
        {isActive: true, age: 38, name: {first: 'John', last: 'Carney'}},
        {isActive: false, age: 29, name: {first: 'Dick', last: 'Dunlap'}}
      ],
      fields: [
        {key: 'name', label: 'Pełne imię', sortable: true, sortDirection: 'desc'},
        {key: 'age', label: 'Wiek', sortable: true, class: 'text-center'},
        {
          key: 'isActive',
          label: 'Czy aktywny?',
          formatter: (value, key, item) => {
            return value ? 'Yes' : 'No'
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        {key: 'actions', label: 'Akcje'}
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 8,
      pageOptions: [4, 8, 12, {value: 100, text: "Show a lot (100)"}],
      sortBy: '',
      sortDesc: false,
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
    // Set the initial number of items
    this.totalRows = this.items.length
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
    }
  }
}
</script>


