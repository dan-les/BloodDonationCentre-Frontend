<template>
  <b-jumbotron
      :header="title" header-level="5" header-tag="h4" style="padding: 0.9rem">
    Wybrany dawca:
    <b-table
        :fields="donorDetails" :items="donor" responsive="sm" small>
    </b-table>
  </b-jumbotron>
</template>

<script>
import DonorService from "../services/donor.service";
import Donor from "../models/donor";

export default {
  data() {
    return {
      donorDetails: [
        {key: 'id', label: 'ID'},
        {key: 'username', label: 'Login'},
        {key: 'email', label: 'Email'},
        {key: 'firstName', label: 'Imię'},
        {key: 'lastName', label: 'Nazwisko'},
        {key: 'pesel', label: 'PESEL'},
        {key: 'bloodGroupWithRh', label: 'Krew'},
        {key: 'gender', label: 'Płeć'},
      ],
      donor: null
    }
  },
  props: {
    'donorIdx': {
      type: Number
    },
    'title': {
      type: String
    }
  },
  mounted() {
    let loader = this.$loading.show();
    DonorService.getDonorById(this.donorIdx)
        .then(response => {
          const results_tmp = [];
          results_tmp.push(
              new Donor(
                  response.data.id,
                  response.data.username,
                  response.data.email,
                  response.data.firstName,
                  response.data.lastName,
                  response.data.pesel,
                  response.data.bloodGroupWithRh,
                  response.data.gender
              ));
          this.donor = results_tmp;

        })
        .finally(() => {
          loader.hide();
        })
  }
}
</script>

