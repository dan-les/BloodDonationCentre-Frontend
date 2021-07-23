<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>
</template>

<script>

export default {
  name: 'Admin',
  data() {
    return {
      content: ''
    };
  },
  mounted() {
    if (!this.$store.state.auth.user || !this.$store.state.auth.user.roles.includes('ROLE_ADMIN')) {
      this.$router.push('/login');
    }

    // UserService.getAdminBoard().then(
    //     response => {
    //       this.content = response.data;
    //     },
    //     error => {
    //       this.content =
    //           (error.response && error.response.data && error.response.data.message) ||
    //           error.message ||
    //           error.toString();
    //     }
    // );
  }
};
</script>
