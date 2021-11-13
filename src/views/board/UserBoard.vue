<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
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
          <b-alert v-if="!showDonations && showDonations !== null" show variant="info">
            Nie oddawałeś/aś jeszcze krwi ani osocza, dlatego nie możemy wyświetlić twoich statystyk. 😢
          </b-alert>
          <mdb-container v-if="showDonations">
            <mdb-horizontal-bar-chart
                :data="barChartData"
                :height="270"
                :options="barChartOptions"
                :width="600"
            ></mdb-horizontal-bar-chart>
          </mdb-container>
        </b-tab>

        <b-tab lazy title="Zarezerwowane terminy">
          <b-alert v-if="!showReservations" show variant="info">
            Brak dostępnych rezerwacji 😢
          </b-alert>
          <b-row class="justify-content-end" style="margin-bottom: 1rem">
            <b-col col lg="3">
              <b-button v-b-modal.modal-prevent-closing class="mr-1 mt-1" size="sm" variant="primary">
                Zarezerwuj termin na pobranie
              </b-button>
            </b-col>
          </b-row>
          <b-table
              v-if="showReservations"
              :fields="fieldsReservations"
              :items="reservations"
              hover
              striped
          >
            <template #cell(actions)="row">
              <span v-if="!row.item.isAppointmentFinished">
                <b-button class="mr-1 mt-1" size="sm" variant="danger" @click="deleteReservation(row.item.id)">
                  Usuń rezerwację
                </b-button>
              </span>
              <span v-else>
               <b-button
                   v-b-popover.hover.top="'Dla tej rezerwacji odnotowano już pobranie, zatem nie można jej usunąć'"
                   class="mr-1 mt-1"
                   size="sm"
                   title="Pobranie zostało zarejestrowane w systemie"
                   variant="info">
                <font-awesome-icon icon="question"/>
               </b-button>
              </span>
            </template>
          </b-table>
        </b-tab>


        <b-tab lazy title="Historia pobrań">
          <b-alert v-if="!showDonations" show variant="info">
            Brak dostępnych pobrań 😢
          </b-alert>
          <b-table v-if="showDonations" :fields="fieldsDonations" :items="donations" hover striped></b-table>
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
        @close="reloadData"
        @ok="reloadData"
    >
      <form ref="form" @submit.stop.prevent>
        <add-reservation-model
            :donorIdx="this.$store.state.auth.user.id"
        ></add-reservation-model>
      </form>
    </b-modal>
  </b-card>
</template>
<script>

import DonationService from "../../services/donation.service";
import {mdbContainer, mdbHorizontalBarChart} from "mdbvue";
import ReservationService from "../../services/reservation.service";
import Reservation from "../../models/reservation";
import Donation from "../../models/donation";

export default {
  components: {
    mdbHorizontalBarChart,
    mdbContainer
  },
  data() {
    return {
      donations: null,
      fieldsDonations: [
        {key: 'date', label: 'Data pobrania', sortable: true, sortDirection: 'desc'},
        {key: 'amount', label: 'Ilość pobranego materiału [ml]', sortable: true, class: 'text-center'},
        {key: 'donationType', label: 'Rodzaj pobrania', sortable: true, class: 'text-center'},
      ],
      reservations: null,
      fieldsReservations: [
        {key: 'date', label: 'Data', sortable: true, sortDirection: 'desc', class: 'text-center'},
        {key: 'time', label: 'Godzina', sortable: true, class: 'text-center'},
        {key: 'donationType', label: 'Rodzaj pobrania', sortable: true, class: 'text-center'},
        {key: 'actions', label: 'Akcje', class: 'text-center'}
      ],
      showReservations: false,
      showDonations: null,
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
        legend: {
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
        })
        .finally(() => {
          loader.hide();
        })

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
              results_tmp.push(
                  new Reservation(
                      response.data[idx].id,
                      response.data[idx].donorId,
                      response.data[idx].donorFirstName,
                      response.data[idx].donorLastName,
                      response.data[idx].pesel,
                      response.data[idx].date,
                      response.data[idx].time,
                      response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew',
                      response.data[idx].isAppointmentFinished
                  ));
            }
            this.reservations = results_tmp;
            if (results_tmp.length > 0) {
              this.showReservations = true;
            }
          }
      )
    },
    getAllDonationsByDonor() {
      DonationService.getAllDonationsByDonorId(this.$store.state.auth.user.id).then(
          response => {
            const results_tmp = [];
            for (const idx in response.data) {
              results_tmp.push(
                  new Donation(
                      response.data[idx].id,
                      response.data[idx].date,
                      response.data[idx].amount,
                      response.data[idx].donationType === 'plasma' ? 'osocze' : 'krew',
                  ));
            }
            this.donations = results_tmp;
            if (results_tmp.length > 0) {
              this.showDonations = true;
            } else {
              this.showDonations = false;
            }
          })
    },
    deleteReservation(id) {
      ReservationService.deleteReservation(id)
          .then(() => {
            this.getAllReservationsByDonor();
            this.makeToastSuccess('Pomyślnie usunięto rezerwację');
          })
          .catch(() => {
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
