<template>
  <b-container fluid>
    <b-jumbotron
        header="Twoje dane" header-level="5" header-tag="h2" style="padding: 1.5rem">
    </b-jumbotron>

    <b-jumbotron v-if="showData" style="padding: 1.5rem">
      <p>
        <strong>Imię:</strong> {{ user.firstName }}
      </p>
      <p>
        <strong>Nazwisko:</strong> {{ user.lastName }}
      </p>
      <p>
        <strong>Login:</strong> {{ user.username }}
      </p>
      <p>
        <strong>Email:</strong> {{ user.email }}
      </p>
      <p v-if=" user.pesel !== null">
        <strong>Pesel:</strong> {{ user.pesel }}
      </p>
      <p v-if=" user.bloodGroupWithRh !== null">
        <strong>Grupa krwi:</strong> {{ user.bloodGroupWithRh }}
      </p>
      <p v-if=" user.gender !== null">
        <strong>Płeć:</strong> {{ user.gender }}
      </p>
    </b-jumbotron>

  </b-container>
</template>

<script>
import DonorService from "../../services/donor.service";
import User from "../../model/donor";

export default {
  data() {
    return {
      user: null,
      showData: false
    }
  },

  mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }
    let loader = this.$loading.show();
    DonorService.getDonorById(this.$store.state.auth.user.id).then(
        response => {
          this.user = new User(
              response.data.id,
              response.data.username,
              response.data.email,
              response.data.firstName,
              response.data.lastName,
              response.data.pesel,
              response.data.bloodGroupWithRh,
              response.data.gender
          )
          this.showData = true;
          loader.hide();
        },
        () => {
          loader.hide();
        }
    )
  }
};
</script>
