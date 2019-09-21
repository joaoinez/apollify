<template>
  <div class="main">
    <div class="background"></div>
    <nuxt />
  </div>
</template>

<style lang="scss">
html {
  font-family: "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Source Sans Pro", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  text-decoration: none;
  color: white;
}

.main {
  min-height: 100vh;
  position: relative;

  .background {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background: radial-gradient(
      ellipse at center,
      #e1bee7 0%,
      #ce93d8 0%,
      #4a148c 100%
    );
    background-color: #e1bee7;
  }
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100vh;
  color: white;
  max-width: 1000px;
  margin: 0 auto;
  padding: 100px 40px;

  h2 {
    text-align: center;
  }

  &.no-padding {
    padding: 0 40px;
  }
}

.title {
  font-size: 80px;
  margin-bottom: 80px;
}

.subtitle {
  font-size: 30px;
  margin-bottom: 80px;
}

.btn-green {
  background-color: #1db954;
  border: 0;
  border-radius: 500px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  padding: 17px 48px;
  transition-duration: 33ms;
  transition-property: background-color, border-color, color, box-shadow, filter,
    transform;
  display: inline-block;
  box-shadow: 1px 1px 16px -2px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.04);
    background-color: #1ed760;
  }
}
</style>
