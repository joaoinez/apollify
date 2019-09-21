<template>
  <li>
    <div class="img-wrapper">
      <img :src="artistImage()" :alt="artist.name" v-if="artistImage()" />
      <p v-if="!artistImage()">?</p>
      <div :class="{'dark-filter': true, 'selected': isSelected()}" @click="toggleArtist">
        <button class="round-btn" v-if="!isSelected()">+</button>
        <button class="round-btn" v-if="isSelected()">-</button>
      </div>
    </div>
    <p>{{artist.name}}</p>
  </li>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import * as R from "ramda";

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
    toggleArtist() {
      if (!this.isSelected()) {
        this.addArtist(this.artist.id);
      } else {
        this.removeArtist(this.artist.id);
      }
    },
    artistImage() {
      return R.compose(
        R.prop("url"),
        R.head,
        R.prop("images")
      )(this.artist);
    }
  }
};
</script>

<style scoped lang="scss">
li {
  text-align: center;
  margin: 20px;
  max-width: 200px;

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
  box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);

  img {
    transition-duration: 33ms;
    transition-property: opacity;
    height: 100%;
    width: 100%;
    max-width: 200px;
    max-width: 200px;
    object-fit: cover;
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
    cursor: pointer;

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
      outline: none;
    }
  }

  p {
    position: absolute;
    top: calc(50% - 60px);
    left: calc(50% - 25px);
    color: #eeeeee;
    font-size: 6em;
    width: 50px;
    height: 120px;
  }
}
</style>