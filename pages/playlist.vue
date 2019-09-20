<template>
  <section class="container">
    <h2 class="subtitle" v-if="loading">Creating your playlist...</h2>
    <Loader v-if="loading && !sessionExpired" />
    <h2 class="subtitle" v-else-if="!sessionExpired">Your playlist has been created!</h2>
    <a
      @click="goBack"
      class="btn-green"
      v-if="!loading && !sessionExpired"
    >Want to make another one?</a>
    <SessionExpired v-if="sessionExpired" />
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as R from "ramda";
import SessionExpired from "~/components/SessionExpired";
import Loader from "~/components/Loader";

export default {
  components: {
    SessionExpired,
    Loader
  },
  data() {
    return {
      loading: true,
      sessionExpired: false,
      userID: "",
      country: "",
      tracks: [],
      playlistID: ""
    };
  },
  computed: mapState(["accessToken", "selectedArtists"]),
  mounted() {
    fetch("https://api.spotify.com/v1/me", {
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
          this.userID = R.prop("id")(data);
          this.country = R.prop("country")(data);
        } else {
          this.loading = false;
          this.sessionExpired = true;
        }
      })
      .then(() => {
        Promise.all(
          this.selectedArtists.map(id =>
            fetch(
              `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${this.country}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${this.accessToken}`
                }
              }
            )
          )
        )
          .then(res => Promise.all(res.map(r => r.json())))
          .then(data => {
            const error = R.prop("error")(data);
            if (!error) {
              this.tracks = R.compose(
                R.map(R.prop("uri")),
                R.reverse,
                R.sortBy(R.prop("popularity")),
                R.map(R.pick(["uri", "popularity"])),
                R.flatten,
                R.map(R.prop("tracks"))
              )(data);
            } else {
              this.loading = false;
              this.sessionExpired = true;
            }
          })
          .then(() => {
            fetch(`https://api.spotify.com/v1/users/${this.userID}/playlists`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${this.accessToken}`
              },
              body: JSON.stringify({
                name: "Apollify Playlist",
                public: false
              })
            })
              .then(res => res.json())
              .then(data => {
                const error = R.prop("error")(data);
                if (!error) {
                  this.playlistID = R.prop("id")(data);
                } else {
                  this.loading = false;
                  this.sessionExpired = true;
                }
              })
              .then(() => {
                Promise.all(
                  R.splitEvery(100)(this.tracks).map(
                    tracks =>
                      tracks.length &&
                      fetch(
                        `https://api.spotify.com/v1/playlists/${this.playlistID}/tracks`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${this.accessToken}`
                          },
                          body: JSON.stringify({
                            uris: tracks
                          })
                        }
                      )
                  )
                ).then(res => {
                  res.map(response => {
                    const error = R.prop("status")(response) !== 201;
                    this.loading = false;
                    error && (this.sessionExpired = true);
                  });
                });
              });
          });
      });
  },
  methods: {
    ...mapMutations(["cleanSelectedArtists"]),
    goBack() {
      this.cleanSelectedArtists();
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
}
</style>