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
              v-model="selectedIsReleased" :aria-describedby="ariaDescribedby" value="false">Dostępne w magazynie
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
          :fields="visibleFieldsDonations"
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

        <template #cell(actions)="row">
          <b-button v-if="row.item.isReleased === 'nie'" class="mr-1" size="sm" variant="primary"
                    @click="info(row.item, row.item.id, $event.target)"> Wydaj
          </b-button>
        </template>
      </b-table>

      <b-modal :id="infoModal.id"
               :title="infoModal.title"
               cancel-title="Rezygnuj"
               ok-title="Potwierdź zmianę"
               @close="resetInfoModal"
               @hide="resetInfoModal"
               @ok="changeRecipient(infoModal.content)">
        <b-form-group label="Wybierz podmiot, do którego wydana będzie dawka materiału biologicznego:">
          <lookup-field
              :fields="recipients"
              :items="recipients"
              :placeholder="placeholder"
              :sort-by="'id'"
              @item-selected="setSelectedRecipient"
          >
          </lookup-field>
        </b-form-group>
      </b-modal>
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
import RecipientService from '../../services/recipient.service';

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
    visibleFieldsDonations() {
      return this.fieldsDonations.filter(fieldsDonations => fieldsDonations.visible)
    }
  },
  watch: {
    propertiesChangeChecker(newVal) {
      // sprawdzanie czy zmieniła się wartość którejś z trzech zmiennych
      let [newSelectedDonationType, newSelectedIsReleased, newSelectedBloodGroupWithRh] = newVal.split('|');
      newSelectedDonationType = newSelectedDonationType === 'null' ? null : newSelectedDonationType;
      newSelectedIsReleased = newSelectedIsReleased === 'null' ? null : newSelectedIsReleased;
      newSelectedBloodGroupWithRh = newSelectedBloodGroupWithRh === 'null' ? null : newSelectedBloodGroupWithRh;

      this.changeDisplayedFields(newSelectedIsReleased)

      this.getAllDonations(newSelectedDonationType, newSelectedIsReleased, newSelectedBloodGroupWithRh);
    },
    selectedRecipient() {
      if (this.selectedRecipient === null) {
        this.getAllDonations(this.selectedDonationType, this.selectedIsReleased, this.selectedBloodGroupWithRh);
      }
    },
    selectedIsReleased() {
      // ukrywanie kolumny "Akcje" gdy przeglądamy dawki już wydane
      if (this.selectedIsReleased === 'true') {
        this.fieldsDonations.pop();
      } else {
        this.fieldsDonations.push({key: 'actions', label: 'Akcje', active: false});
      }

    }
  },
  mounted() {

    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
      this.$router.push('/login');
    }
    this.getAllDonations(this.selectedDonationType, this.selectedIsReleased, this.selectedBloodGroupWithRh);
    this.getAllRecipients();
  },
  methods: {
    changeDisplayedFields(newSelectedIsReleased) {
      let objIndexRecipientName = this.fieldsDonations.findIndex((obj => obj.key === 'recipientName'));
      if (newSelectedIsReleased === 'false') {
        this.fieldsDonations[objIndexRecipientName].visible = false;
      } else {
        this.fieldsDonations[objIndexRecipientName].visible = true;
      }
      let objIndexActions = this.fieldsDonations.findIndex((obj => obj.key === 'actions'));
      if (newSelectedIsReleased === 'true') {
        this.fieldsDonations[objIndexActions].visible = false;
      } else {
        this.fieldsDonations[objIndexActions].visible = true;
      }
    },
    setSelectedRecipient(recipientData) {
      this.selectedRecipient = recipientData.id;
    },
    changeRecipient(id) {
      if (this.selectedRecipient !== null) {
        DonationService.patchDonationRecipient({
          id: id,
          isReleased: true,
          recipientId: this.selectedRecipient
        }).then(this.selectedRecipient = null)
      }
    },
    info(item, index, button) {
      this.infoModal.title = `Wydanie dawki numer ${index}`
      this.infoModal.content = `${index}`
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
      this.selectedRecipient = null
    },
    getAllDonations(selectedDonationType, selectedIsReleased, selectedBloodGroupWithRh) {
      let loader = this.$loading.show();
      DonationService.getAllDonations(selectedDonationType, selectedIsReleased, selectedBloodGroupWithRh).then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push({
                id: response.data[idx].id,
                date: response.data[idx].date,
                amount: response.data[idx].amount,
                donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew',
                donorId: response.data[idx].donorId,
                donorFirstName: response.data[idx].donorFirstName,
                donorLastName: response.data[idx].donorLastName,
                bloodGroupWithRh: response.data[idx].bloodGroupWithRh,
                isReleased: response.data[idx].isReleased === true ? 'tak' : 'nie',
                recipientId: response.data[idx].isReleased,
                recipientName: response.data[idx].recipientName,
              });
            }
            this.donations = results_tmp;
            // Set the initial number of items
            this.totalRows = this.donations.length;
            loader.hide();
          },

          () => {
            loader.hide();
          }
      )
    },
    getAllRecipients() {
      RecipientService.getAllRecipients().then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push({
                id: response.data[idx].id,
                name: response.data[idx].name
              });
            }
            this.recipients = results_tmp;

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
      placeholder: "Wyszukaj odbiorcę",
      selectedDonationType: null,
      selectedIsReleased: false,
      selectedBloodGroupWithRh: null,
      selectedRecipient: null,

      totalRows: 1,
      currentPage: 1,
      perPage: 20,
      pageOptions: [5, 10, 20, {value: 100, text: "Pokaż wszystko (max: 100)"}],
      sortBy: 'date',
      sortDesc: false,
      emptyFilteredText: 'Brak wyników wyszukiwania spełniających podane kryteria',
      emptyText: 'Brak dostępnych pobrań.',
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      bloods: [{text: 'Wszystkie rodzaje', value: null},
        'A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'],
      fieldsDonations: [
        {key: 'id', label: 'ID', sortable: true, class: 'text-center', visible: true},
        {key: 'date', label: 'Data', sortable: true, class: 'text-center', visible: true},
        {key: 'amount', label: 'Ilość [ml]', sortable: true, class: 'text-center', visible: true},
        {key: 'donationType', label: 'Typ', sortable: true, class: 'text-center', visible: true},
        {key: 'donorId', label: 'ID dawcy', sortable: true, class: 'text-center', visible: true},
        {key: 'bloodGroupWithRh', label: 'Krew', sortable: true, class: 'text-center', visible: true},
        {key: 'isReleased', label: 'Wydano?', sortable: true, class: 'text-center', visible: true},
        {key: 'recipientName', label: 'Nazwa odbiorcy', sortable: true, class: 'text-center', visible: false},
        {key: 'actions', label: 'Akcje', visible: true}
      ],
      recipients: [],
      donations: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      }
    }
  },
}
</script>
