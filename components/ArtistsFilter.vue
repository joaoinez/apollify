<template>
  <div :class="{'sticky': true, 'background': open}">
    <div class="filter-container">
      <label for="search" class="search-wrapper">
        <font-awesome-icon :icon="['fas', 'search']" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search artist ..."
          v-model="search"
        />
      </label>
      <button :class="{ 'btn-pill': true, 'large': true, 'active': open }" @click="toggleMenu()">
        Genres
        <font-awesome-icon :icon="['fas', 'chevron-down']" v-if="!open" />
        <font-awesome-icon :icon="['fas', 'chevron-up']" v-else />
      </button>
    </div>
    <div class="genre-scroll" v-if="selectedGenres.length">
      <button
        v-for="genre in selectedGenres"
        :key="genre"
        :class="{'btn-pill': true, 'active': selectedGenres.includes(genre)}"
        @click="toggleGenre(genre)"
      >
        {{ genre }}
        <font-awesome-icon :icon="['fas', 'times']" />
      </button>
    </div>
    <transition name="accordion">
      <div class="genre-container" v-if="open">
        <button
          v-for="genre in genres"
          :key="genre"
          :class="{'btn-pill': true, 'active': selectedGenres.includes(genre)}"
          @click="toggleGenre(genre)"
        >
          {{ genre }}
          <font-awesome-icon :icon="['fas', 'minus']" v-if="selectedGenres.includes(genre)" />
          <font-awesome-icon :icon="['fas', 'plus']" v-else />
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import * as R from "ramda";

export default {
  data() {
    return {
      open: false
    };
  },
  computed: {
    ...mapState(["artists", "selectedGenres"]),
    ...mapGetters(["genres"]),
    search: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.$store.commit("updateSearch", R.compose(R.toLower, R.trim)(value));
      }
    }
  },
  methods: {
    ...mapMutations(["addGenre", "removeGenre"]),
    toggleMenu() {
      this.open = !this.open;
    },
    toggleGenre(genre) {
      if (!this.selectedGenres.includes(genre)) {
        this.addGenre(genre);
      } else {
        this.removeGenre(genre);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.sticky {
  position: sticky;
  top: 0;
  width: 100%;
  margin-bottom: 20px;
  z-index: 2;
  height: auto;

  &.background {
    background: rgb(69, 69, 69);
    background: linear-gradient(
      180deg,
      rgba(69, 69, 69, 1) 0%,
      rgba(36, 36, 36, 1) 30%,
      rgba(0, 0, 0, 1) 100%
    );
    box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
  }
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
}

.search-wrapper {
  position: relative;
  margin: 10px 20px 10px 20px;

  svg {
    position: absolute;
    top: calc(50% - 8px);
    right: 16px;
    color: white;
  }
}

#search {
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
  box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
  outline: none;
  padding: 10px 40px;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.6);
  }
}

.btn-pill {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: 2px solid white;
  border-radius: 500px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9em;
  text-align: center;
  padding: 8px 15px;
  transition-duration: 33ms;
  transition-property: background-color, transform;
  display: inline-block;
  box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
  outline: none;

  &:hover {
    transform: scale(1.04);
    background-color: rgba(0, 0, 0, 0.6);
  }

  &.active {
    background-color: #1ed760;
  }

  &.large {
    font-size: 1em;
    padding: 10px 30px;
    margin: 10px 0;
  }

  svg {
    margin-left: 5px;
  }
}

.genre-scroll {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 5px;
  grid-template-rows: minmax(auto, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  overflow-x: scroll;
  scroll-snap-type: x proximity;
  padding: 10px 0 20px 0;
}

.genre-scroll:before,
.genre-scroll:after {
  content: "";
  width: 5px;
}

.genre-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 30vh;
  overflow-y: auto;
  width: 100%;
  padding-bottom: 20px;

  .btn-pill {
    margin: 5px;
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
}
.accordion-enter,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>