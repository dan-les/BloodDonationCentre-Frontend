<template>
  <b-container>
    <b-jumbotron
        header="Panel pracownika - aktualny stan krwi w centrum krwiodawstwa" header-level="5" header-tag="h4"
        style="padding: 0.9rem">
    </b-jumbotron>

    <mdb-container v-if="show">
      <mdb-bar-chart
          :data="barChartData"
          :height="500"
          :options="barChartOptions"
          :width="700"
      ></mdb-bar-chart>
    </mdb-container>
  </b-container>

</template>


<script>
import {mdbBarChart, mdbContainer} from "mdbvue";
import DonationService from '../services/donation.service';

export default {
  name: "ChartPage",
  components: {
    mdbBarChart,
    mdbContainer
  },
  mounted() {
    DonationService.getDonationsStatistics().then(
        response => {
          for (const idx in response.data) {
            this.barChartData.labels.push(response.data[idx].bloodGroupWithRh)
            this.barChartData.datasets[0].data.push(response.data[idx].quantity)
          }
          this.show = true
        })
  },
  data() {
    return {
      show: false,
      barChartData: {
        labels: [],
        datasets: [{
          label: "Ilość krwi w magazynie [ml]",
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
