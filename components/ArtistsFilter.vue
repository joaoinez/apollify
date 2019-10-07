<template>
  <div :class="{'sticky': true, 'background': open}">
    <button :class="{ 'btn-pill': true, 'large': true, 'active': open }" @click="toggleMenu()">
      Filter
      <font-awesome-icon :icon="['fas', 'chevron-down']" v-if="!open" />
      <font-awesome-icon :icon="['fas', 'chevron-up']" v-else />
    </button>
    <div class="genre-container margin" v-if="selectedGenres.length">
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
    <div v-if="open">
      <div class="genre-container">
        <button
          v-for="genre in genres"
          :key="genre"
          :class="{'btn-pill': true, 'active': selectedGenres.includes(genre)}"
          @click="toggleGenre(genre)"
        >{{ genre }}</button>
      </div>
    </div>
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
    ...mapGetters(["genres"])
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
  margin-bottom: 40px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;

  &.background {
    background: rgb(36, 36, 36);
    background: radial-gradient(
      circle,
      rgba(36, 36, 36, 1) 0%,
      rgba(69, 69, 69, 1) 100%
    );
    box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);
  }
}

.btn-pill {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: 2px solid white;
  border-radius: 500px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1em;
  text-align: center;
  padding: 8px 15px;
  transition-duration: 33ms;
  transition-property: background-color, border-color, color, box-shadow, filter,
    transform;
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
    font-size: 1.2em;
    padding: 10px 40px;
    margin: 20px 0;
  }

  svg {
    margin-left: 5px;
  }
}

.genre-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 30vh;
  overflow-y: auto;
  width: 100%;

  &.margin {
    margin-bottom: 20px;
  }

  .btn-pill {
    margin: 3px 4px;
  }
}
</style>