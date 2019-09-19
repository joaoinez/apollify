<template>
  <li>
    <div class="img-wrapper">
      <img :src="artist.images[0].url" width="200" height="200" alt />
      <div :class="{'dark-filter': true, 'selected': isSelected()}">
        <button class="round-btn" v-if="!isSelected()" @click="selectArtist">+</button>
        <button class="round-btn" v-if="isSelected()" @click="removeSelectedArtist">-</button>
      </div>
    </div>
    <p>{{artist.name}}</p>
  </li>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    artist: Object
  },
  computed: mapState(["selectedArtists"]),
  methods: {
    ...mapMutations(["addArtist", "removeArtist"]),
    isSelected() {
      return this.selectedArtists.includes(this.artist.id);
    },
    selectArtist() {
      this.addArtist(this.artist.id);
    },
    removeSelectedArtist() {
      this.removeArtist(this.artist.id);
    }
  }
};
</script>

<style scoped lang="scss">
li {
  text-align: center;
  margin: 20px;

  &:hover {
    .dark-filter {
      opacity: 1;
    }
  }

  p {
    font-weight: 700;
  }
}

.img-wrapper {
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  height: 200px;
  width: 200px;
  margin-bottom: 10px;

  img {
    transition-duration: 33ms;
    transition-property: opacity;
  }

  .dark-filter {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    top: calc(50% - 100px);
    left: calc(50% - 100px);
    background-color: rgba(0, 0, 0, 0.3);
    transition-duration: 33ms;
    transition-property: opacity;
    opacity: 0;

    &.selected {
      opacity: 1;
    }
  }

  .round-btn {
    border: 2px solid white;
    border-radius: 50%;
    font-size: 2em;
    height: 50px;
    width: 50px;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0;
    padding-bottom: 6px;
    margin: 0;
    color: white;
    transition-duration: 33ms;
    transition-property: background, transform;
    cursor: pointer;

    &:hover {
      transform: scale(1.06);
      background-color: rgba(0, 0, 0, 0.8);
    }

    &:focus {
      transform: scale(0.9);
      outline: none;
    }
  }
}
</style>