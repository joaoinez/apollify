<template>
  <section class="container no-padding">
    <h2 class="subtitle" v-if="loading">Creating your playlist...</h2>
    <Loader v-if="loading && !sessionExpired" />
    <h2 class="subtitle" v-else-if="!sessionExpired">Here's your playlist!</h2>
    <transition name="reveal">
      <div class="link" v-if="!loading && !sessionExpired">
        <a :href="playlistURL">
          <font-awesome-icon :icon="['fas', 'play']" class="icon" />
        </a>

        <img :src="playlistImg" alt="Apollify Playlist" v-if="playlistImg" />
        <div class="missing-img" v-else></div>
      </div>
    </transition>
    <a @click="goBack" class="btn-green" v-if="!loading && !sessionExpired">Make another one</a>
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
    this.fetchData("https://api.spotify.com/v1/me").then(data => {
      this.userID = R.prop("id")(data);
      this.country = R.prop("country")(data);

      Promise.all(
        this.selectedArtists.map(id =>
          this.fetchData(
            `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${this.country}`
          )
        )
      ).then(data => {
        this.tracks = R.compose(
          R.reverse,
          R.map(R.prop("uri")),
          R.sortBy(R.prop("popularity")),
          R.flatten,
          R.map(R.prop("tracks"))
        )(data);

        this.fetchData(
          `https://api.spotify.com/v1/users/${this.userID}/playlists`,
          "POST",
          undefined,
          JSON.stringify({
            name: "Apollify Playlist",
            public: false
          })
        ).then(data => {
          this.playlistID = R.prop("id")(data);
          this.playlistURL = R.path(["external_urls", "spotify"])(data);

          Promise.all(
            R.splitEvery(100)(this.tracks).map(
              tracks =>
                tracks.length &&
                this.fetchData(
                  `https://api.spotify.com/v1/playlists/${this.playlistID}/tracks`,
                  "POST",
                  undefined,
                  JSON.stringify({
                    uris: tracks
                  }),
                  true
                )
            )
          ).then(res => {
            const error = res.find(response => {
              R.prop("status")(response) !== 201;
            });

            if (error) {
              this.sessionExpired = true;
              this.loading = false;
            } else {
              this.fetchData(
                `https://api.spotify.com/v1/playlists/${this.playlistID}/images`
              ).then(data => {
                this.playlistImg = R.compose(
                  R.prop("url"),
                  R.head
                )(data);
                this.loading = false;
              });
            }
          });
        });
      });
    });
  },
  methods: {
    ...mapMutations(["cleanArtists", "cleanSelectedArtists"]),
    goBack() {
      this.cleanArtists();
      this.cleanSelectedArtists();
      this.$router.go(-1);
    },
    fetchData(
      url,
      method = "GET",
      headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`
      },
      body = null,
      response = false
    ) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method,
          headers,
          body
        })
          .then(res => {
            response && resolve(res);
            return res.json();
          })
          .then(data => {
            const error = R.prop("error")(data);
            if (!error) {
              resolve(data);
            } else {
              this.loading = false;
              this.sessionExpired = true;
            }
          })
          .catch(error => {
            this.loading = false;
            this.sessionExpired = true;
            reject(error);
          });
      });
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
    padding: 0;

    &:hover {
      transform: scale(1.04);
      background-color: rgba(0, 0, 0, 0.8);
    }

    .icon {
      width: 35px;
      height: auto;
      padding-left: 5px;
    }
  }

  img {
    width: 320px;
    height: 320px;
    box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
  }

  .missing-img {
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