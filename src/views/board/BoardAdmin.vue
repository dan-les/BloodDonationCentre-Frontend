<template>
  <b-container>

    <b-jumbotron style="padding: 1.4rem">
      <h4>
        Panel administratora
      </h4>
    </b-jumbotron>

    <b-card no-body>
      <b-tabs card>
        <b-tab active title="Dodawanie nowego pracownika do systemu">
          <b-row>
            <b-col col lg="6">
              <register
                  :role="'staff'"
                  style="margin-top: 2rem"
              />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab disabled title="Zarządzanie pracownikami"><p>I'm the first tab</p></b-tab>
        <b-tab disabled title="Zgłoszenia zarejestowane w systemie"><p>I'm a disabled tab!</p></b-tab>
      </b-tabs>
    </b-card>

  </b-container>
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
  }
};
</script>
