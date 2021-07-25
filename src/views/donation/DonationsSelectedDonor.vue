<template>
  <b-container>
    <donor-details-header
        :donorIdx=this.$route.params.id
        :title=this.headerTitle
    ></donor-details-header>

    <complex-table
        :key="showTable"
        :dataProp=this.donations
        :fieldsProp=this.fieldsDonations
        :headerTitleProp=this.headerTitle
        :sortByProp=this.sortBy
        :sortDescProp=this.sortDesc
        :totalRowsProp=this.totalRows
    ></complex-table>

    <b-link :to="'/donors'">
      <b-button style="margin: 1rem">
        Powrót na stronę z dawcami
      </b-button>
    </b-link>
  </b-container>

</template>

<script>
import DonationService from '../../services/donation.service';

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
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }

    DonationService.getAllDonationsByDonorId(this.$route.params.id).then(
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
          this.showTable = true;
        },
        error => {
          this.content =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
        }
    )


  },
  methods: {},
  data() {
    return {
      showTable: false,
      headerTitle: 'Spis wszystkich donacji',
      totalRows: 1,
      sortBy: 'date',
      sortDesc: true,
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
