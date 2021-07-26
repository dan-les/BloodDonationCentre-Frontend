<template>
  <b-container>
    <donor-details-header
        :donorIdx=this.$route.params.id
        :title=this.headerTitle
    ></donor-details-header>

    <add-reservation-model
        :donorIdx="this.$route.params.id"
    ></add-reservation-model>

    <b-link :to="'/donors'">
      <b-button style="margin: 1rem">
        Powrót na stronę z dawcami
      </b-button>
    </b-link>
  </b-container>

</template>

<script>

export default {
  mounted() {
    if (!this.$store.state.auth.user) {
      this.$router.push('/login');
    }
  },
  data() {
    return {
      headerTitle: 'Rezerwacja terminu na pobranie materiału biologicznego'
    }
  },


}
</script>
