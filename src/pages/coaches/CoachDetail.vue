<template>
  <div>
    <div v-if="isLoading">
      <base-spinner></base-spinner>
    </div>
    <section class="container mt-4" v-else>
      <div class="card p-3">
        <header class="card-header">
          <div class="p-3">
            <h2 class="is-size-3">{{ alias }}</h2>
            <h3>Name: {{ name }}</h3>
            <h3>Rate: ${{ rate }}/hour</h3>
          </div>
        </header>
        <div class="card-content">
          <p>{{ description }}</p>
        </div>

        <div class="card-content">
          <p class="mb-1">Coaching in:</p>
          <div>
            <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
          </div>
        </div>

        <div class="card-content">
          <p class="mb-1">Favorite games:</p>
          <div v-if="favorites.length > 0" class="media-scroller snaps-inline">
            <game-item
              v-for="favorite in favorites"
              :key="favorite.id"
              :id="favorite.id"
              :image="favorite.image"
              :title="favorite.title"
              :price="favorite.price"
              :link="favorite.link"
            ></game-item>
          </div>
          <p v-else>No favorites favorites yet, comeback later to check</p>
        </div>

        <div class="card-footer">
          <div class="card-footer-item">
            <router-link
              :to="contactLink"
              class="button is-rounded px-6 is-success"
              v-if="contactActive"
              @click="contactActive = false"
            >
              Contact me
            </router-link>
            <button class="button is-rounded px-6" v-else @click.prevent="returnContact">
              Cancel
            </button>
          </div>
        </div>

        <router-view></router-view>
      </div>
    </section>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { ref, computed, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCoachesStore } from "../../store/coachesStore";
import BaseBadge from "../../components/ui/BaseBadge.vue";
import GameItem from "../../components/games/GameItem.vue";
import BaseSpinner from "../../components/ui/BaseSpinner.vue";

/*
  useStore and useRoute
*/
const coachesStore = useCoachesStore();
const route = useRoute();
const router = useRouter();

/*
  Props
*/
const props = defineProps(["id"]);

/*
  Refs
*/
const userId = ref(props.id);
const isLoading = ref(false);
const error = ref(null);
const selectedCoach = ref(null);
/*
  Coach Computed Properties
*/
// const selectedCoach = computed(() => {
//   return coachesStore.coachesList.find((coach) => {
//     return coach.id === userId.value;
//   });
// });

const name = computed(() => selectedCoach.value.name);
const alias = computed(() => selectedCoach.value.alias);
const favorites = computed(() => selectedCoach.value.favorites);
const rate = computed(() => selectedCoach.value.rate);
const areas = computed(() => selectedCoach.value.areas);
const description = computed(() => selectedCoach.value.description);
const contactLink = computed(() => route.path + "/contact");

const contactActive = ref(true);

const returnContact = () => {
  contactActive.value = true;
  router.push({ path: "/coaches/" + userId.value });
};

/* 
  function to load the coaches
*/
const loadCoaches = async (refresh = false) => {
  isLoading.value = true;
  try {
    await coachesStore.loadCoachesStore({ forceRefresh: refresh });
  } catch (err) {
    error.value = err.message || "Something went wrong";
  }
  selectedCoach.value = coachesStore.coachesList.find((coach) => coach.id === userId.value);
  isLoading.value = false;
};

/* 
  load coaches when the component is created
*/
loadCoaches();
/*
  Check contact button
*/
onBeforeMount(() => {
  if (route.name === "contact") {
    contactActive.value = false;
  }
});
</script>

<style scoped>
.card {
  max-width: 60rem;
  margin: auto;
}

.media-scroller {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 30%;

  overflow-x: auto;
  overscroll-behavior-inline: contain;
}

.snaps-inline {
  scroll-snap-type: inline mandatory;
}

.snaps-inline > * {
  scroll-snap-align: start;
}

.card-header-title {
  text-align: left;
}
</style>
