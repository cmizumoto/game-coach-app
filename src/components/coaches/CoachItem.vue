<template>
  <li class="card my-5">
    <div class="p-5">
      <div class="media-content">
        <h3 class="title">{{ alias }}</h3>
        <div class="card-flex card-space-between">
          <p class="subtitle">Name: {{ name }}</p>
          <p class="subtitle">${{ rate }}/hour</p>
        </div>
      </div>
      <div class="content">
        <p class="mb-4">
          {{ shortDescription }}
          <router-link :to="coachDetailLink" v-if="shortDescription.length > 130"
            >read more</router-link
          >
        </p>
        <h4>Areas:</h4>
        <div class="card-flex card-space-around">
          <base-badge-vue v-for="area in areas" :key="area" class="button is-rounded" :title="area">
          </base-badge-vue>
        </div>
      </div>
    </div>
    <div class="actions card-footer">
      <router-link :to="coachContactLink" class="card-footer-item">Contact</router-link>
      <router-link :to="coachDetailLink" class="card-footer-item">View Details</router-link>
    </div>
  </li>
</template>

<script setup>
/*
  Imports
*/
import { computed } from "vue";
import { useRoute } from "vue-router";
import BaseBadgeVue from "../ui/BaseBadge.vue";

/*
    Props
*/
const props = defineProps(["id", "name", "alias", "rate", "description", "favorites", "areas"]);

/*
  Route
*/
const route = useRoute();

/*
  Curator Router Link
*/
const coachContactLink = computed(() => {
  return `${route.path}/${props.id}/contact`;
});
const coachDetailLink = computed(() => {
  return `${route.path}/${props.id}`;
});

const shortDescription = computed(() => {
  let shortDesc = props.description.split(" ").splice(0, 30).join(" ");
  if (shortDesc.length > 130) {
    return shortDesc + " ...";
  }
  return shortDesc;
});
</script>

<style scoped>
.card-flex {
  display: flex;
}
.card-space-between {
  justify-content: space-between;
}
.card-space-around {
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
