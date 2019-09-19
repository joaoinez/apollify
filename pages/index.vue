<template>
  <section class="container no-padding">
    <h1 class="title">Apollify</h1>
    <h2 class="subtitle">Create spotify playlists based on the artists you want</h2>
    <a
      :href="`https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}&response_type=token`"
      class="btn-green"
    >Login with Spotify</a>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["clientID", "redirectURI", "scope"])
};
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
}
</style>
