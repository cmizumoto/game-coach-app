<template>
  <div>
    <base-modal :show="!!error" title="An error occurred!" @close="handleError">
      <p>{{ error }}</p>
    </base-modal>
    <section class="section container">
      <coach-filter-vue @change-filter="setFilters"></coach-filter-vue>

      <div class="controls mt-5">
        <button class="button mr-3 is-primary" @click="loadCoaches(true)">Refresh</button>
        <router-link class="button is-success" to="/auth" v-if="!isLoggedIn">Login</router-link>
        <router-link
          class="button is-success"
          to="/register"
          v-if="isLoggedIn && !isCoach && !isLoading"
          >Register as Coach</router-link
        >
      </div>
      <div v-if="isLoading">
        <base-spinner></base-spinner>
      </div>
      <ul v-else-if="hasCoachesComp">
        <coach-item-vue
          v-for="coach in filteredCoaches"
          :key="coach.id"
          :id="coach.id"
          :name="coach.name"
          :alias="coach.alias"
          :description="coach.description"
          :areas="coach.areas"
          :favorites="coach.favorites"
          :rate="coach.rate"
        ></coach-item-vue>
      </ul>
      <h3 v-else>No coaches found</h3>
    </section>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { ref, computed } from "vue";
import { useCoachesStore } from "@/store/coachesStore";
import { useAuthStore } from "../../store/authStore";
import CoachItemVue from "../../components/coaches/CoachItem.vue";
import CoachFilterVue from "../../components/coaches/CoachFilter.vue";

/*
  Store
*/
const coachesStore = useCoachesStore();
const authStore = useAuthStore();

/*
  Refs and Active Filters
*/
const isLoading = ref(false);
const error = ref(null);
const activeFilters = ref({
  speedrunner: true,
  tournamentP: true,
  tournamentO: true,
  loremaster: true,
});

/*
  Setting filters
*/
const setFilters = (updatedFilters) => {
  activeFilters.value = updatedFilters;
};

/*
  Filtered Coaches
*/
const filteredCoaches = computed(() => {
  const coaches = coachesStore.coachesList;
  return coaches.filter((coach) => {
    if (activeFilters.value.speedrunner && coach.areas.includes("speed runner")) {
      return true;
    }
    if (activeFilters.value.tournamentP && coach.areas.includes("tournament player")) {
      return true;
    }
    if (activeFilters.value.tournamentO && coach.areas.includes("tournament organizer")) {
      return true;
    }
    if (activeFilters.value.loremaster && coach.areas.includes("lore master")) {
      return true;
    }
    return false;
  });
});

/*
  Check if it's already a coach, also logged in
*/
const isCoach = computed(() => {
  return coachesStore.isCoach;
});

const hasCoachesComp = computed(() => {
  return coachesStore.hasCoaches && !isLoading.value;
});

const isLoggedIn = computed(() => {
  return authStore.isAuthenticated;
});

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
  isLoading.value = false;
};

/*
  Handle error
*/
const handleError = () => {
  error.value = null;
};

/*
  load coaches when the component is created
*/
loadCoaches();
</script>
