<template>
  <div class="playlist-wrapper">
    <small v-if="selectedArtists.length">{{ selectedArtists.length }} selected</small>
    <div class="playlist-btn-combo">
      <nuxt-link
        to="/playlist"
        class="btn-green create-playlist-btn"
        :event="selectedArtists.length ? 'click' : ''"
        :disabled="!selectedArtists.length"
      >Create Playlist</nuxt-link>
      <button class="btn-green expand-options-btn" @click="toggleOptions()">
        <font-awesome-icon :icon="['fas', 'chevron-up']" v-if="!open" />
        <font-awesome-icon :icon="['fas', 'chevron-down']" v-else />
      </button>
    </div>
    <div :class="{'playlist-options': true, 'open': open}">
      <div class="playlist-options-container">
        <input
          type="text"
          name="playlist-name"
          id="playlist-name"
          placeholder="Playlist Name"
          v-model="playlistName"
        />
        <p>Number of songs per artist</p>
        <div class="radio-group">
          <label for="3" :class="{'btn-green': true, 'checked': songsPerArtist === '3'}">
            3
            <input type="radio" name="song-number" value="3" id="3" v-model="songsPerArtist" />
          </label>
          <label for="5" :class="{'btn-green': true, 'checked': songsPerArtist === '5'}">
            5
            <input type="radio" name="song-number" value="5" id="5" v-model="songsPerArtist" />
          </label>
          <label for="10" :class="{'btn-green': true, 'checked': songsPerArtist === '10'}">
            10
            <input type="radio" name="song-number" value="10" id="10" v-model="songsPerArtist" />
          </label>
          <label for="all" :class="{'btn-green': true, 'checked': songsPerArtist === 'all'}">
            All
            <input type="radio" name="song-number" value="all" id="all" v-model="songsPerArtist" />
          </label>
        </div>
        <small
          :class="{'warning': true, 'visible': songsPerArtist === 'all'}"
        >Selecting many artists is not recomended!</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import * as R from "ramda";

export default {
  data() {
    return {
      open: false,
    };
  },
  computed: {
    ...mapState(["selectedArtists"]),
    playlistName: {
      get() {
        return this.$store.state.playlistName;
      },
      set(value) {
        this.$store.commit("updatePlaylistName", R.trim(value));
      },
    },
    songsPerArtist: {
      get() {
        return this.$store.state.songsPerArtist;
      },
      set(value) {
        this.$store.commit("changeSongsPerArtist", value);
      },
    },
  },
  methods: {
    toggleOptions() {
      this.open = !this.open;
    },
  },
};
</script>

<style scoped lang="scss">
.playlist-wrapper {
  position: fixed;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  a:disabled,
  a[disabled] {
    background-color: grey;
    pointer-events: none;
  }

  small {
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .playlist-btn-combo {
    display: flex;
    padding-bottom: 40px;

    .create-playlist-btn {
      border-radius: 500px 0 0 500px;
      padding-right: 18px;
    }

    .expand-options-btn {
      color: white;
      border-radius: 0 500px 500px 0;
      padding-left: 18px;
      padding-right: 24px;
      margin-left: 2px;
    }
  }

  .playlist-options {
    max-height: 0;
    width: 100%;
    overflow: auto;
    transition: all 0.2s ease-in-out;
    position: relative;
    box-shadow: 0 -1px 16px -2px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(6px);
    background-color: rgba(#000, 0.3);

    &.open {
      max-height: 35vh;
    }

    .playlist-options-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      #playlist-name {
        background-color: rgba(0, 0, 0, 0.3);
        color: white;
        border: 2px solid white;
        border-radius: 500px;
        font-weight: 700;
        font-size: 1em;
        padding: 8px 15px;
        transition-duration: 33ms;
        transition-property: background-color;
        display: inline-block;
        box-shadow: 0 1px 16px -2px rgba(0, 0, 0, 0.3);
        outline: none;
        padding: 10px 40px;
        margin-bottom: 20px;
        text-align: center;

        &:hover,
        &:focus {
          background-color: rgba(0, 0, 0, 0.6);
        }
      }

      p {
        font-weight: bold;
      }

      .radio-group {
        display: flex;
        margin: 10px 0 0;
        box-shadow: 0 1px 16px -2px rgba(0, 0, 0, 0.3);
        border-radius: 500px;

        label {
          border-radius: 0;
          padding: 10px 20px;
          box-shadow: none;
          background-color: rgba(0, 0, 0, 0.3);
          border: 2px solid white;
          border-left-width: 1px;
          border-right-width: 1px;

          &:first-child {
            border-radius: 500px 0 0 500px;
            border-left-width: 2px;
          }

          &:last-child {
            border-radius: 0 500px 500px 0;
            border-right-width: 2px;
          }

          &:hover {
            transform: scale(1);
            background-color: rgba(0, 0, 0, 0.6);
          }

          &.checked {
            background-color: #1ed760;
          }

          input {
            display: none;
          }
        }
      }

      .warning {
        opacity: 0;
        margin-top: 5px;
        margin-bottom: 0;
        text-transform: initial;
        font-weight: normal;
        color: red;

        &.visible {
          opacity: 1;
        }
      }

      .btn-green {
        color: white;
      }
    }
  }
}
</style>