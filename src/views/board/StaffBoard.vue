<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
    <b-jumbotron
        header="Panel pracownika - aktualny stan materiału biologicznego w magazynie"
        header-level="5" header-tag="h4" style="padding: 0.9rem">
    </b-jumbotron>

    <b-card no-body>
      <b-tabs card>
        <b-tab active lazy title="Aktualny stan krwi">
          <mdb-container>
            <mdb-bar-chart
                :key="showBloodChart"
                :data="barChartDataBlood"
                :height="400"
                :options="barChartOptions"
                :width="700"
            ></mdb-bar-chart>
          </mdb-container>

        </b-tab>
        <b-tab lazy title="Aktualny stan osocza">
          <mdb-container>
            <mdb-bar-chart
                :key="showPlasmaChart"
                :data="barChartDataPlasma"
                :height="400"
                :options="barChartOptions"
                :width="700"
            ></mdb-bar-chart>
          </mdb-container>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-card>
</template>


<script>
import {mdbBarChart, mdbContainer} from "mdbvue";
import DonationService from '../../services/donation.service';

export default {
  components: {
    mdbBarChart,
    mdbContainer
  },
  mounted() {
    let loader = this.$loading.show();
    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_STAFF')) {
      this.$router.push('/login');
    }
    DonationService.getDonationsStatistics("plasma")
        .then(response => {
          for (const idx in response.data) {
            this.barChartDataPlasma.labels.push(response.data[idx].bloodGroupWithRh)
            this.barChartDataPlasma.datasets[0].data.push(response.data[idx].quantity)
          }
          this.showPlasmaChart = true
        })
    DonationService.getDonationsStatistics("blood").then(
        response => {
          for (const idx in response.data) {
            this.barChartDataBlood.labels.push(response.data[idx].bloodGroupWithRh)
            this.barChartDataBlood.datasets[0].data.push(response.data[idx].quantity)
          }
          this.showBloodChart = true
        })
        .finally(() => {
          loader.hide();
        })
  },
  data() {
    return {
      showBloodChart: false,
      showPlasmaChart: false,
      barChartDataBlood: {
        labels: [],
        datasets: [{
          label: "Ilość krwi w magazynie [ml]",
          labelColor: "rgba(75, 192, 192, 0.2)",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(126, 241, 155, 0.2)",
            "rgba(102, 97, 186, 0.2)"
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(78,190,106, 1)",
            "rgba(71,87,241, 1)",
          ],
          borderWidth: 2
        }]
      },
      barChartDataPlasma: {
        labels: [],
        datasets: [{
          label: "Ilość osocza w magazynie [ml]",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(126, 241, 155, 0.2)",
            "rgba(102, 97, 186, 0.2)"
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(78,190,106, 1)",
            "rgba(71,87,241, 1)",
          ],
          borderWidth: 2
        }]
      },
      barChartOptions: {
        legend: {
          boxWidth: 2222,
          labels: {
            fontSize: 15,
            // remove filled rectangle in title
            boxWidth: 0
          }
        },
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
  }
};
</script>
