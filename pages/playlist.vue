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
    Loader,
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
      playlistImg: "",
    };
  },
  computed: mapState([
    "accessToken",
    "selectedArtists",
    "songsPerArtist",
    "playlistName",
  ]),
  mounted() {
    this.fetchData("https://api.spotify.com/v1/me")
      .then(this.getTracks)
      .then(this.createPlaylist)
      .then(this.addTracksToPlaylist)
      .then(this.checkPlaylist)
      .then(this.getPlaylistImage)
      .catch((error) => {
        this.sessionExpired = true;
        this.loading = false;
      });
  },
  methods: {
    ...mapMutations([
      "cleanArtists",
      "cleanSelectedArtists",
      "cleanSelectedGenres",
      "updateSearch",
      "changeSongsPerArtist",
      "updatePlaylistName",
    ]),
    goBack() {
      this.cleanArtists();
      this.cleanSelectedArtists();
      this.cleanSelectedGenres();
      this.updateSearch("");
      this.changeSongsPerArtist("10");
      this.updatePlaylistName("Apollify Playlist");
      this.$router.go(-1);
    },
    fetchData(
      url,
      method = "GET",
      headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
      body = null,
      response = false
    ) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method,
          headers,
          body,
        })
          .then((res) => {
            response && resolve(res);
            return res.json();
          })
          .then((data) => {
            const error = R.prop("error")(data);
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getTracks(data) {
      this.userID = R.prop("id")(data);
      this.country = R.prop("country")(data);

      if (this.songsPerArtist !== "all") {
        return Promise.all(
          this.selectedArtists.map((id) =>
            this.fetchData(
              `https://api.spotify.com/v1/artists/${id}/top-tracks?country=${this.country}`
            )
          )
        );
      } else {
        return Promise.all(
          this.selectedArtists.map((id) =>
            this.fetchAlbums(
              `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`
            )
          )
        ).then((data) => {
          const albumsIds = R.flatten(data);

          return Promise.all(
            R.splitEvery(20)(albumsIds).map((ids) => {
              return this.fetchData(
                `https://api.spotify.com/v1/albums?ids=${ids.join(",")}`
              ).then((data) => {
                const albums = R.prop("albums")(data);
                return Promise.all(
                  albums.map((album) => {
                    const tracks = R.prop("tracks")(album);
                    const items = R.prop("items")(tracks);
                    const next = R.prop("next")(tracks);

                    return next ? this.fetchTracks(next, items) : items;
                  })
                );
              });
            })
          );
        });
      }
    },
    createPlaylist(data) {
      this.tracks =
        this.songsPerArtist !== "all"
          ? R.compose(
              R.reverse,
              R.map(R.prop("uri")),
              R.sortBy(R.prop("popularity")),
              R.flatten,
              R.map(R.compose(R.take(+this.songsPerArtist), R.prop("tracks")))
            )(data)
          : R.compose(R.map(R.prop("uri")), R.flatten)(data);

      return this.fetchData(
        `https://api.spotify.com/v1/users/${this.userID}/playlists`,
        "POST",
        undefined,
        JSON.stringify({
          name: this.playlistName,
          public: false,
        })
      );
    },
    addTracksToPlaylist(data) {
      this.playlistID = R.prop("id")(data);
      this.playlistURL = R.path(["external_urls", "spotify"])(data);

      return Promise.all(
        R.splitEvery(100)(this.tracks).map(
          (tracks) =>
            tracks.length &&
            this.fetchData(
              `https://api.spotify.com/v1/playlists/${this.playlistID}/tracks`,
              "POST",
              undefined,
              JSON.stringify({
                uris: tracks,
              }),
              true
            )
        )
      );
    },
    checkPlaylist(res) {
      const error = res.find((response) => {
        R.prop("status")(response) !== 201;
      });

      if (error) {
        return new Promise((_, reject) => reject(error));
      } else {
        return this.fetchData(
          `https://api.spotify.com/v1/playlists/${this.playlistID}/images`
        );
      }
    },
    getPlaylistImage(data) {
      this.playlistImg = R.compose(R.prop("url"), R.head)(data);
      this.loading = false;
    },
    fetchAlbums(url, albums = []) {
      return this.fetchData(url).then((data) => {
        const fetchedAlbums = R.compose(
          R.map(R.prop("id")),
          R.prop("items")
        )(data);
        const next = R.prop("next")(data);

        albums.push(...fetchedAlbums);

        return next ? this.fetchAlbums(next, albums) : albums;
      });
    },
    fetchTracks(url, items) {
      return this.fetchData(url).then((data) => {
        const fetchedItems = R.prop("items")(data);
        const next = R.prop("next")(data);

        items.push(...fetchedItems);

        return next ? this.fetchTracks(next, items) : items;
      });
    },
  },
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