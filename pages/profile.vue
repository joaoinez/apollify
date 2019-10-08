<template>
  <section>
    <header class="sub-container top">
      <h2 class="subtitle" v-if="!sessionExpired">Pick your artists</h2>
    </header>
    <ArtistsFilter></ArtistsFilter>
    <article class="sub-container bottom">
      <transition-group name="artists-list" tag="ul" v-if="!sessionExpired">
        <Artist v-for="artist in filteredArtists" :key="artist.id" :artist="artist"></Artist>
      </transition-group>
      <p v-if="!sessionExpired && !loading && !artists.length">
        You have no artists. Go follow some on
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="link"
        >Spotify</a> and come back later.
      </p>
      <Loader v-if="!sessionExpired" :loading="loading" />
      <div v-if="!sessionExpired" id="end-of-page"></div>
      <div class="playlist-wrapper">
        <small v-if="selectedArtists.length">{{ selectedArtists.length }} selected</small>
        <nuxt-link
          to="/playlist"
          class="btn-green"
          v-if="!sessionExpired"
          :event="selectedArtists.length ? 'click' : ''"
          :disabled="!selectedArtists.length"
        >Create Playlist</nuxt-link>
      </div>
      <SessionExpired v-if="sessionExpired" />
    </article>
  </section>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import * as R from "ramda";
import Artist from "~/components/Artist";
import SessionExpired from "~/components/SessionExpired";
import Loader from "~/components/Loader";
import ArtistsFilter from "~/components/ArtistsFilter";

export default {
  scrollToTop: true,
  components: {
    Artist,
    SessionExpired,
    Loader,
    ArtistsFilter
  },
  data() {
    return {
      loading: true,
      sessionExpired: false,
      next: null,
      endOfPageObserver: null,
      hash: null,
      intersecting: false
    };
  },
  computed: {
    ...mapState([
      "accessToken",
      "artists",
      "selectedArtists",
      "selectedGenres",
      "search"
    ]),
    filteredArtists: function() {
      if (this.selectedGenres.length) {
        return this.artists.filter(
          ({ name, genres }) =>
            !!R.intersection(genres, this.selectedGenres).length &&
            R.compose(
              R.includes(this.search),
              R.toLower,
              R.trim
            )(name)
        );
      }
      return this.artists.filter(({ name }) =>
        R.compose(
          R.includes(this.search),
          R.toLower,
          R.trim
        )(name)
      );
    }
  },
  watch: {
    intersecting: function(intersecting) {
      if (intersecting && !this.sessionExpired && !this.loading) {
        this.fetchArtists();
      }
    }
  },
  mounted() {
    this.fetchArtists();
    if (process.client) {
      const endOfPageEl = document.querySelector("#end-of-page");

      this.endOfPageObserver = new window.IntersectionObserver(([entry]) => {
        this.intersecting = entry.isIntersecting;
      });

      endOfPageEl && this.endOfPageObserver.observe(endOfPageEl);
    }
  },
  beforeDestroy() {
    this.endOfPageObserver && this.endOfPageObserver.disconnect();
  },
  methods: {
    ...mapMutations(["setAccessToken", "addArtists"]),
    fetchArtists() {
      this.loading = true;
      const url =
        this.next || "https://api.spotify.com/v1/me/following?type=artist";
      const hash = this.hash || this.$route.hash.split("&");
      if (!!R.head(hash)) {
        const accessToken = R.compose(
          R.replace(/#access_token=/g, ""),
          R.head
        )(hash);
        this.setAccessToken(accessToken);

        fetch(url, {
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
              this.next = R.path(["artists", "next"])(data);
              const items = R.path(["artists", "items"])(data);

              if (!this.next) {
                this.loading = false;
                this.endOfPageObserver.disconnect();
                this.endOfPageObserver = null;
              }

              this.addArtists(items);
              this.loading = false;

              this.next &&
                this.$nextTick(() => {
                  setTimeout(() => {
                    if (
                      this.endOfPageObserver &&
                      this.intersecting &&
                      !this.loading
                    ) {
                      this.fetchArtists();
                    }
                  }, 500);
                });
            } else {
              this.sessionExpired = true;
              this.loading = false;
            }
          })
          .catch(() => {
            this.sessionExpired = true;
            this.loading = false;
          });
      } else {
        this.sessionExpired = true;
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
section {
  height: 100%;
  min-height: 100vh;
  position: relative;
}

.sub-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  margin: 0 auto;

  h2 {
    text-align: center;
  }

  &.top {
    margin-top: 100px;
  }

  &.bottom {
    max-width: 1000px;
    padding: 100px 40px;
    padding-top: 0;
  }
}

ul {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style-type: none;
  margin-bottom: 30px;
  padding: 0;
}

#end-of-page {
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
}

.playlist-wrapper {
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;

  small {
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: 700;
  }
}

a:disabled,
a[disabled] {
  background-color: grey;
  pointer-events: none;
}

.artists-list-move {
  transition: transform 0.5s;
}

.artists-list-enter-active,
.artists-list-leave-active {
  transition: all 0.5s;
}

.artists-list-enter, .artists-list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

.link {
  color: white;
  font-weight: 700;
  text-decoration-line: underline;
  transition: color 33ms ease-in-out;

  &:hover {
    color: #1ed760;
  }
}
</style>