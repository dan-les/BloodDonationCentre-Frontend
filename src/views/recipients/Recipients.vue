<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
    <b-jumbotron
        header="Przegląd wszystkich odbiorców materiału biologicznego" header-level="5" header-tag="h4"
        style="padding: 0.9rem">
    </b-jumbotron>

    <b-col md="4" offset-md="8">
      <b-button v-b-modal.modal-1 block variant="primary">Dodaj odbiorcę</b-button>
    </b-col>

    <b-modal
        id="modal-1"
        cancel-title="Rezygnuj"
        ok-title="Dodaj odbiorcę"
        title="Dodawanie odbiorcy materiału biologicznego"
        @close="resetData"
        @hide="resetData"
        @ok="addRecipient()"
    >
      <form name="form" @submit.prevent>
        <div class="form-group">
          <label>Nazwa odbiorcy</label>
          <input
              v-model="newRecipient"
              v-validate="'required'"
              class="form-control"
              data-vv-as="'nazwa odbiorcy'"
              name="recipient"
              type="text"
          />
          <div
              v-if="errors.has('recipient')"
              class="alert alert-danger"
              role="alert"
          >{{ errors.first('recipient') }}
          </div>
        </div>

      </form>
    </b-modal>

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

        <b-col class="my-1" offset="3" sm="3"></b-col>

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

        <b-col class="my-1" lg="3"></b-col>
        <b-col class="my-1" md="6" sm="5">
          <b-form-group
              class="mb-0"
              label="Ile wierszy"
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
          :items="recipients"
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
  </b-card>
</template>

<script>
import RecipientService from '../../services/recipient.service';
import Recipient from "../../model/recipient";

export default {
  data() {
    return {
      newRecipient: null,
      recipients: [],
      fields: [
        {key: 'id', label: 'ID', sortable: true, sortDirection: 'desc'},
        {key: 'name', label: 'Nazwa', sortable: true, sortDirection: 'desc'},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'time',
      sortDesc: false,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak odbiorców.',
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
      return this.fields
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
    this.getRecipients()

  },
  methods: {
    getRecipients() {
      let loader = this.$loading.show();
      RecipientService.getAllRecipients()
          .then(response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push(
                  new Recipient(response.data[idx].id, response.data[idx].name));
            }
            this.recipients = results_tmp;
            this.totalRows = this.recipients.length;
          })
          .finally(() => {
            loader.hide();
          })

    },
    addRecipient() {
      RecipientService.addNewRecipient({
        name: this.newRecipient,
      }).then(() => {
        this.getRecipients();
        this.$bvToast.toast('Odbiorca został pomyślnie dodany do systemu!', {
          title: `Sukces`,
          variant: 'info',
          autoHideDelay: 2000,
          solid: true
        })
        this.newRecipient = null;
      }).catch(() => {
        this.$bvToast.toast('Coś poszło nie tak...', {
          title: `Błąd`,
          variant: 'danger',
          autoHideDelay: 2000,
          solid: true
        })
      })
    },

    resetData() {
      this.newRecipient = null;
    },
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`
      this.infoModal.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  }
}
</script>


