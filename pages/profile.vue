<template>
  <section class="container">
    <h2 class="subtitle" v-if="!sessionExpired">Pick your artists</h2>
    <transition-group name="artists-list" tag="ul" v-if="!sessionExpired">
      <Artist v-for="artist in artists" :key="artist.id" :artist="artist"></Artist>
    </transition-group>
    <Loader v-if="loading && !sessionExpired" />
    <div v-if="!sessionExpired" id="end-of-page"></div>
    <div class="playlist-wrapper">
      <small v-if="selectedArtists.length">{{ selectedArtists.length }} selected</small>
      <nuxt-link
        to="/playlist"
        class="btn-green"
        v-if="!loading && !sessionExpired"
        :event="selectedArtists.length ? 'click' : ''"
        :disabled="!selectedArtists.length"
      >Create Playlist</nuxt-link>
    </div>
    <SessionExpired v-if="sessionExpired" />
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as R from "ramda";
import Artist from "~/components/Artist";
import SessionExpired from "~/components/SessionExpired";
import Loader from "~/components/Loader";

export default {
  scrollToTop: true,
  components: {
    Artist,
    SessionExpired,
    Loader
  },
  data() {
    return {
      loading: true,
      sessionExpired: false,
      next: "",
      endOfPageObserver: null,
      hash: ""
    };
  },
  computed: mapState(["accessToken", "artists", "selectedArtists"]),
  mounted() {
    this.fetchArtists(false);
    if (process.client) {
      const endOfPageEl = document.querySelector("#end-of-page");

      this.endOfPageObserver = new window.IntersectionObserver(([entry]) => {
        entry.isIntersecting &&
          !this.sessionExpired &&
          this.next &&
          !this.loading &&
          this.fetchArtists(true);
      });

      endOfPageEl && this.endOfPageObserver.observe(endOfPageEl);
    }
  },
  beforeDestroy() {
    this.endOfPageObserver && this.endOfPageObserver.disconnect();
  },
  methods: {
    ...mapMutations(["setAccessToken", "addArtists", "cleanArtists"]),
    fetchArtists(next) {
      this.loading = true;
      const url = !next
        ? "https://api.spotify.com/v1/me/following?type=artist"
        : this.next;
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
              !this.next && this.endOfPageObserver.disconnect();
              const items = R.path(["artists", "items"])(data);
              this.artists.length && !next && this.cleanArtists();
              this.addArtists(items);
              !this.next && console.log(this.artists.length);
              this.loading = false;
            } else {
              this.loading = false;
              this.sessionExpired = true;
            }
          });
      } else {
        this.loading = false;
        this.sessionExpired = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
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
</style>