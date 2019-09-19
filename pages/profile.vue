<template>
  <section class="container">
    <h2 class="subtitle">Pick your artists</h2>
    <ul>
      <Artist v-for="artist in artists" :key="artist.id" :artist="artist"></Artist>
    </ul>
    <nuxt-link to="/playlist" class="btn-green">Create Playlist</nuxt-link>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as R from "ramda";
import Artist from "~/components/Artist";

export default {
  components: {
    Artist
  },
  computed: mapState(["accessToken", "artists"]),
  created() {
    if (!this.artists.length) {
      const hash = this.$route.hash.split("&");
      const accessToken = R.compose(
        R.replace(/#access_token=/g, ""),
        R.head
      )(hash);
      this.setAccessToken(accessToken);

      fetch("https://api.spotify.com/v1/me/following?type=artist", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          const error = R.prop("error")(data);
          if (!error) {
            const items = R.path(["artists", "items"])(data);
            this.setArtists(items);
          } else {
            console.log(error);
          }
        });
    }
  },
  methods: {
    ...mapMutations(["setAccessToken", "setArtists"])
  }
};
</script>

<style scoped lang="scss">
ul {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style-type: none;
  margin-bottom: 30px;
  padding: 0;
}
</style>