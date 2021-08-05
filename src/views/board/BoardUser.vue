<template>
  <b-container>
    <b-jumbotron style="padding: 1.9rem">
      <h4 v-if="this.$store.state.auth.user.firstName === null">
        Witaj ponownie na naszej stronie!
      </h4>
      <h4 v-else>
        Witaj ponownie <strong>{{ this.$store.state.auth.user.firstName }}</strong>!
      </h4>
    </b-jumbotron>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Twoje statystyki">
          <mdb-container v-if="show">
            <mdb-horizontal-bar-chart
                :data="barChartData"
                :height="270"
                :options="barChartOptions"
                :width="600"
            ></mdb-horizontal-bar-chart>
          </mdb-container>
        </b-tab>

        <b-tab lazy title="Historia pobrań">
          <b-table :fields="fieldsDonations" :items="donations" hover striped></b-table>
        </b-tab>

        <b-tab lazy title="Zarezerwowane terminy">

          <b-row class="justify-content-end" style="margin-bottom: 1rem">
            <b-col col lg="3">
              <b-button v-b-modal.modal-prevent-closing class="mr-1" size="sm" variant="primary">Zarezerwuj termin na
                pobranie
              </b-button>
            </b-col>
          </b-row>
          <b-table
              :fields="fieldsReservations"
              :items="reservations"
              hover
              striped
          >
            <template #cell(actions)="row">
              <b-button class="mr-1" size="sm" variant="danger" @click="deleteReservation(row.item.id)">Usuń
                rezerwację
              </b-button>
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </b-card>

    <b-modal
        id="modal-prevent-closing"
        ref="modal"
        ok-only
        ok-title="Zamknij okno"
        ok-variant="secondary"
        size="xl"
        title="Rezerwacja terminu na pobranie"
        @ok="reloadData"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <add-reservation-model
            :donorIdx="this.$store.state.auth.user.id"
        ></add-reservation-model>
      </form>
    </b-modal>
  </b-container>
</template>
<script>


import DonationService from "../../services/donation.service";
import {mdbContainer, mdbHorizontalBarChart} from "mdbvue";
import ReservationService from "../../services/reservation.service";

export default {
  components: {
    mdbHorizontalBarChart,
    mdbContainer
  },
  data() {
    return {
      donations: null,
      reservations: null,
      fieldsDonations: [
        {key: 'date', label: 'Data pobrania', sortable: true, sortDirection: 'desc'},
        {key: 'amount', label: 'Ilość pobranego materiału [ml]', sortable: true, class: 'text-center'},
        {key: 'donationType', label: 'Rodzaj pobrania', sortable: true, class: 'text-center'},
      ],

      fieldsReservations: [
        {key: 'date', label: 'Data', sortable: true, sortDirection: 'desc', class: 'text-center'},
        {key: 'time', label: 'Godzina', sortable: true, class: 'text-center'},
        {key: 'donationType', label: 'Rodzaj pobrania', sortable: true, class: 'text-center'},
        {key: 'actions', label: 'Akcje', class: 'text-center'}
      ],
      show: false,
      barChartData: {
        labels: ["krew", "osocze"],
        datasets: [{
          label: "Ilość oddanego materiału biologicznego [ml]",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 2
        }]
      },
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              barPercentage: 1,
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)"
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.1)"
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_USER')) {
      this.$router.push('/login');
    }
    let loader = this.$loading.show();
    DonationService.getDonationsStatisticsByDonor(this.$store.state.auth.user.id).then(
        response => {
          this.barChartData.datasets[0].data.push(response.data.blood)
          this.barChartData.datasets[0].data.push(response.data.plasma)
          this.show = true
          loader.hide();
        },
        () => {
          loader.hide();
        }
    )

    this.getAllDonationsByDonor()
    this.getAllReservationsByDonor()
  },
  methods: {
    reloadData() {
      this.getAllReservationsByDonor()
    },

    getAllReservationsByDonor() {
      ReservationService.getAllReservationsByDonorId(this.$store.state.auth.user.id).then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push({
                id: response.data[idx].id,
                date: response.data[idx].date,
                time: response.data[idx].time,
                donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew'
              });
            }
            this.reservations = results_tmp;
          }
      )
    },
    getAllDonationsByDonor() {
      DonationService.getAllDonationsByDonorId(this.$store.state.auth.user.id).then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push({
                date: response.data[idx].date,
                amount: response.data[idx].amount,
                donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew',
              });
            }
            this.donations = results_tmp;
          })
    },
    deleteReservation(id) {
      ReservationService.deleteReservation(id)
          .then(response => {
            this.getAllReservationsByDonor();
            this.makeToastSuccess('Pomyślnie usunięto rezerwację');
          })
          .catch(e => {
            this.makeToastError();
          });

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
};
</script>
