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
    DonorService.getDonorById(this.donorIdx).then(
        response => {
          const results_tmp = [];
          results_tmp.push({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            pesel: response.data.pesel,
            bloodGroupWithRh: response.data.bloodGroupWithRh,
            gender: response.data.gender
          });

          this.donor = results_tmp;
        },
        error => {
          this.content =
              (error.response && error.response.data && error.response.data.message) ||
              error.message ||
              error.toString();
        }
    )
  },
}
</script>

