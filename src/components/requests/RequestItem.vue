<template>
  <li class="card mb-5">
    <div class="card-header py-4 pl-5">
      <a :href="emailLink">{{ email }}</a>
    </div>
    <div class="card-content">
      <p>{{ message }}</p>
    </div>
  </li>
</template>

<script setup>
/*
    Imports
*/
import { computed } from "vue";

/*
    Props
*/
const props = defineProps(["email", "message"]);

/*
    Computed
*/
const emailLink = computed(() => {
  return "mailto:" + props.email;
});
</script>
