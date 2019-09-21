import * as R from "ramda";

export const state = () => ({
  clientID: "1a3b2753431c403dbb7474b0fd801759",
  redirectURI:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/profile"
      : "https://apollify.herokuapp.com/profile",
  scope: "user-read-private playlist-modify-private user-follow-read",
  accessToken: "",
  artists: [],
  selectedArtists: []
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
  }
};
