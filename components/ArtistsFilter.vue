<template>
  <div class="sticky">
    <button
      v-for="genre in genres"
      :key="genre"
      :class="{'btn-pill': true, 'active': selectedGenres.includes(genre)}"
      @click="toggleGenre(genre)"
    >{{ genre }}</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import * as R from "ramda";

export default {
  computed: {
    ...mapState(["artists", "selectedGenres"]),
    ...mapGetters(["genres"])
  },
  methods: {
    ...mapMutations(["addGenre", "removeGenre"]),
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
  top: 20px;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 40px;
  z-index: 2;
  display: grid;
  grid-gap: calc(20px);
  grid-template-columns: 10px;
  grid-template-rows: minmax(auto, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  overflow-x: scroll;
  scroll-snap-type: x proximity;
}

.sticky:before,
.sticky:after {
  content: "";
  width: 10px;
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
}
</style>