require("dotenv").config();
import * as R from "ramda";

export const state = () => ({
  clientID: process.env.clientID,
  redirectURI: process.env.redirectURI,
  scope: "user-read-private playlist-modify-private user-follow-read",
  accessToken: "",
  artists: [],
  selectedArtists: [],
  selectedGenres: [],
  search: ""
});

export const mutations = {
  setAccessToken(state, token) {
    state.accessToken = token;
  },
  addArtists(state, artists) {
    state.artists = R.uniq([...state.artists, ...artists]);
  },
  cleanArtists(state) {
    state.artists = [];
  },
  addArtist(state, artist) {
    state.selectedArtists = [...state.selectedArtists, artist];
  },
  removeArtist(state, artist) {
    state.selectedArtists = state.selectedArtists.filter(
      _artist => _artist !== artist
    );
  },
  cleanSelectedArtists(state) {
    state.selectedArtists = [];
  },
  addGenre(state, genre) {
    state.selectedGenres = R.uniq([...state.selectedGenres, genre]);
  },
  removeGenre(state, genre) {
    state.selectedGenres = state.selectedGenres.filter(
      _genre => _genre !== genre
    );
  },
  cleanSelectedGenres(state) {
    state.selectedGenres = [];
  },
  updateSearch(state, value) {
    state.search = value;
  }
};

export const getters = {
  genres: state =>
    R.compose(
      R.sort(R.comparator(R.lt)),
      R.uniq,
      R.flatten,
      R.map(R.prop("genres"))
    )(state.artists)
};
