<template>
  <div class="button is-rounded my-1" :class="type">
    <a v-if="link" :href="link" target="_blank"> {{ title }} </a>
    <div v-else>
      {{ title }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["title", "type", "link"]);
</script>

<style scoped>
.runner {
  background-color: hsl(48, 100%, 96%);
}
.player {
  background-color: hsl(219, 70%, 96%);
}
.organizer {
  background-color: hsl(206, 70%, 96%);
}
.master {
  background-color: hsl(142, 52%, 96%);
}
</style>
