<template>
  <b-container fluid>
    <!--    <b-jumbotron style="padding: 1.9rem">-->
    <!--      <h4>-->
    <!--        Zalogowano pomyślnie jako <strong>{{ currentUser.username }}!</strong>-->
    <!--      </h4>-->
    <!--    </b-jumbotron>-->
    <b-jumbotron
        header="Twoje dane" header-level="5" header-tag="h2" style="padding: 1.5rem">
    </b-jumbotron>

    <b-jumbotron style="padding: 1.5rem">
      <p>
        <strong>Imię:</strong> {{ user[0].firstName }}
      </p>
      <p>
        <strong>Nazwisko:</strong> {{ user[0].lastName }}
      </p>
      <p>
        <strong>Login:</strong> {{ user[0].username }}
      </p>
      <p>
        <strong>Email:</strong> {{ user[0].email }}
      </p>
      <p>
        <strong>Pesel:</strong> {{ user[0].pesel }}
      </p>
      <p>
        <strong>Grupa krwi:</strong> {{ user[0].bloodGroupWithRh }}
      </p>
      <p>
        <strong>Płeć:</strong> {{ user[0].gender }}
      </p>
    </b-jumbotron>

  </b-container>
</template>

<script>
import DonorService from "../../services/donor.service";

export default {
  data() {
    return {
      user: [],
    }
  },

  mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }

    DonorService.getDonorById(this.$store.state.auth.user.id).then(
        response => {
          const results_tmp = [];
          results_tmp.push({
            username: response.data.username,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            pesel: response.data.pesel,
            bloodGroupWithRh: response.data.bloodGroupWithRh,
            gender: response.data.gender
          });
          this.user = results_tmp;

        },
        error => {

        }
    )
  }


};
</script>
