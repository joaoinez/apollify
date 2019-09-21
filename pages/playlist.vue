<template>
  <section class="container">
    <h2 class="subtitle" v-if="loading">Creating your playlist...</h2>
    <Loader v-if="loading && !sessionExpired" />
    <h2 class="subtitle" v-else-if="!sessionExpired">Here's your playlist!</h2>
    <transition name="reveal">
      <div class="link" v-if="!loading && !sessionExpired">
        <a :href="playlistURL" target="_blank" rel="noopener noreferrer nofollow">▶</a>

        <img :src="playlistImg" alt="Apollify Playlist" />
      </div>
    </transition>
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
      playlistID: "",
      playlistURL: "",
      playlistImg: ""
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
                R.reverse,
                R.map(R.prop("uri")),
                R.sortBy(R.prop("popularity")),
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
                  this.playlistURL = R.path(["external_urls", "spotify"])(data);
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
                )
                  .then(res => {
                    res.map(response => {
                      const error = R.prop("status")(response) !== 201;
                      error && (this.sessionExpired = true);
                    });
                  })
                  .then(() => {
                    fetch(
                      `https://api.spotify.com/v1/playlists/${this.playlistID}/images`,
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                          Authorization: `Bearer ${this.accessToken}`
                        }
                      }
                    )
                      .then(res => res.json())
                      .then(data => {
                        const error = R.prop("error")(data);
                        if (!error) {
                          this.loading = false;
                          this.playlistImg = R.compose(
                            R.prop("url"),
                            R.head
                          )(data);
                        } else {
                          this.loading = false;
                          this.sessionExpired = true;
                        }
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
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="scss">
.link {
  margin-bottom: 80px;
  position: relative;

  a {
    position: absolute;
    width: 100px;
    height: 100px;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
    font-size: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    border: 3px solid white;
    text-align: center;
    transition-duration: 33ms;
    transition-property: transform, background;

    &:hover {
      transform: scale(1.04);
      background-color: rgba(0, 0, 0, 0.8);
    }
  }

  img {
    width: 320px;
    height: 320px;
    box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
  }
}

.reveal-enter-active,
.reveal-leave-active {
  transition: all 0.5s;
}
.reveal-enter,
.reveal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>