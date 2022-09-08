<template>
  <div class="container" ref="scrollComponent">
    <div class="card py-3 mt-3">
      <form class="field py-3">
        <label for="search"></label>
        <input
          class="input"
          type="text"
          id="search"
          v-model="searchInput"
          placeholder="Search a game"
        />
      </form>
    </div>
    <div v-if="!catchError">
      <game-pagination-vue
        :data="searchResult"
        :total-pages="Math.ceil(searchResult.length / 12)"
        :total="searchResult.length"
        :per-page="12"
        :current-page="currentPage"
        @pageChanged="onPageChange"
      ></game-pagination-vue>
    </div>
    <p v-else>Server not responding, please try again later.</p>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { ref, onMounted, computed, watch } from "vue";
import { useGamesStore } from "../../store/gamesStore";
import GamePaginationVue from "../../components/games/GamePagination.vue";

/*
  Store
*/
const gamesStore = useGamesStore();

/*
  Variables for controling the page
*/
const catchError = ref(false);
const currentPage = ref(1);
const searchInput = ref("");

/* 
  Update the page change
*/
const onPageChange = (page) => {
  currentPage.value = page;
};

/* 
  Computed for search results
*/
const searchResult = computed(() => {
  const gamesList = gamesStore.gamesList;
  const searchResultArray = gamesList.filter((game) => {
    return game.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
  return searchResultArray;
});

/* 
  Watch to change the page value on search
*/
watch(searchInput, () => {
  if (searchInput.value.length >= 1) {
    currentPage.value = 1;
  }
});

/*
  On mounted we execute the fetch
*/
onMounted(() => {
  catchError.value = gamesStore.errorShow;
  gamesStore.getGames();
});
</script>

<style scoped>
.field {
  margin: auto;
  width: 80%;
}
</style>
