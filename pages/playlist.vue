<template>
  <section class="container">
    <h2 class="subtitle">Here's the playlist</h2>
    <nuxt-link to="/profile" class="btn-green">Want to go back?</nuxt-link>
  </section>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style>
</style>