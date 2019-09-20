<template>
  <div>
    <div class="round"></div>
    <div class="round delay-1"></div>
    <div class="round delay-2"></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.round {
  width: 10px;
  height: 10px;
  background-color: white;
  display: inline-block;
  border-radius: 50%;
  animation: bounce 1s ease-in-out;
  animation-iteration-count: infinite;

  &.delay-1 {
    animation-delay: 0.25s;
  }
  &.delay-2 {
    animation-delay: 0.5s;
  }
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-10px);
  }
  50%,
  100% {
    transform: translateY(0);
  }
}
</style>