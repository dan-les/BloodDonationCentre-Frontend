<template>
  <b-container fluid>
    <b-jumbotron style="padding: 1.9rem">
      <h4>
        Zalogowano pomyślnie jako <strong>{{ currentUser.username }}!</strong>
      </h4>
    </b-jumbotron>


    <b-jumbotron>
      <template #lead>
        Twoje podstawowe dane
      </template>


      <p>
        <strong>Id:</strong>
        {{ currentUser.id }}
      </p>
      <p>
        <strong>Email:</strong>
        {{ currentUser.email }}
      </p>
      <strong>Role w systemie:</strong>
      <ul>
        <li v-for="(role,index) in currentUser.roles" :key="index">{{ role }}</li>
      </ul>

    </b-jumbotron>

  </b-container>
</template>

<script>
export default {
  name: 'Profile',
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },

};
</script>
