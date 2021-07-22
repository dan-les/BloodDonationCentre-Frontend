<template>
  <b-container>
    <b-jumbotron style="padding: 1.9rem">
      <h4>
        Witaj ponownie <strong>{{ this.$store.state.auth.user.username }}</strong>!
      </h4>
    </b-jumbotron>
    <b-card no-body>
      <b-tabs card>
        <b-tab title="Twoje statystyki">
          <mdb-container v-if="show">
            <mdb-horizontal-bar-chart
                :data="barChartData"
                :height="200"
                :options="barChartOptions"
                :width="600"
            ></mdb-horizontal-bar-chart>
          </mdb-container>
        </b-tab>

        <b-tab lazy title="Historia pobrań">
          <b-table :fields="fieldsDonations" :items="donations" hover striped></b-table>
        </b-tab>

        <b-tab lazy title="Zarezerwowane terminy">
          <b-table :fields="fieldsReservations" :items="reservations" hover striped></b-table>
        </b-tab>

        <!--      <b-tab title="Zarezerwowane terminy" lazy>-->
        <!--        <b-alert show>I'm lazy mounted!</b-alert>-->
        <!--      </b-tab>-->

      </b-tabs>
    </b-card>
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
        {key: 'date', label: 'Data', sortable: true, sortDirection: 'desc'},
        {key: 'time', label: 'Godzina', sortable: true, class: 'text-center'},
        {key: 'donationType', label: 'Rodzaj pobrania', sortable: true, class: 'text-center'},
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
        maintainAspectRatio: true,
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

    DonationService.getDonationsStatisticsByDonor(this.$store.state.auth.user.id).then(
        response => {
          this.barChartData.datasets[0].data.push(response.data.blood)
          this.barChartData.datasets[0].data.push(response.data.plasma)
          this.show = true
        })

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
        }
    )

    ReservationService.getAllReservationsByDonor(this.$store.state.auth.user.id).then(
        response => {
          const results_tmp = [];
          for (const idx in response.data) {
            results_tmp.push({
              date: response.data[idx].date,
              time: response.data[idx].time,
              donationType: response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew'
            });
          }
          this.reservations = results_tmp;
        }
    )
  }
};
</script>
