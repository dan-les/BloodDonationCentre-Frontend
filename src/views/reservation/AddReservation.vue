<template>
  <b-card class="p-xl-4" style="margin-bottom: 2rem">
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
  </b-card>
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
  }
}
</script>
