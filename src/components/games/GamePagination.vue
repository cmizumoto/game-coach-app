<template>
  <base-modal :show="!!error" title="An error occurred!" @close="handleError">
    <p>{{ error }}</p>
  </base-modal>
  <div v-if="isLoading">
    <base-spinner></base-spinner>
  </div>
  <div v-else class="is-flex is-flex-wrap-wrap is-justify-content-center">
    <game-item-vue
      v-for="game in paginateData"
      :key="game.id"
      :id="game.id"
      :image="game.image"
      :title="game.title"
      :price="game.price"
      :link="game.link"
    ></game-item-vue>
  </div>
  <div class="is-flex is-justify-content-center py-6">
    <ul class="pagination" v-if="data.length > 9 || currentPage > 1">
      <li class="pagination-item mx-1">
        <button class="button" type="button" @click="onClickFirstPage" :disabled="isInFirstPage">
          &#60; &#60;
        </button>
      </li>

      <li class="pagination-item mx-1">
        <button class="button" type="button" @click="onCLickPreviousPage" :disabled="isInFirstPage">
          &#60;
        </button>
      </li>

      <li class="pagination-item mx-1" v-for="(page, index) in pages" :key="index">
        <button
          type="button"
          class="button"
          @click="onClickPage(page.number)"
          :disabled="page.isDisabled"
          :class="{ active: isPageActive(page.number) }"
        >
          {{ page.number }}
        </button>
      </li>

      <li class="pagination-item mx-1">
        <button class="button" type="button" @click="onClickNextPage" :disabled="isInLastPage">
          &#62;
        </button>
      </li>

      <li class="pagination-item mx-1">
        <button class="button" type="button" @click="onClickLastPage" :disabled="isInLastPage">
          &#62; &#62;
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { computed, ref } from "vue";
import { useGamesStore } from "../../store/gamesStore";
import { useCoachesStore } from "../../store/coachesStore";
import GameItemVue from "../../components/games/GameItem.vue";

/*
  Store
*/
const gamesStore = useGamesStore();
const coachesStore = useCoachesStore();

/* 
  Refs
*/
const isLoading = ref(false);
const error = ref(null);

/* 
    Props
*/
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  maxVisibleButtons: {
    type: Number,
    default: 3,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  perPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

/* 
  Emits
*/
const emit = defineEmits(["pageChanged"]);

/*
  Computed
*/
// In this function we will split the data received into small pieces to not overload the screen
const paginateData = computed(() => {
  let start = (props.currentPage - 1) * props.perPage;
  let end = start + props.perPage;
  return props.data.slice(start, end);
});

// Show the first page in the props
const startPage = computed(() => {
  if (props.currentPage === 1) return 1;
  if (props.currentPage === props.totalPages) {
    return props.totalPages - props.maxVisibleButtons + (props.maxVisibleButtons - 1);
  }
  return props.currentPage - 1;
});

// Show the last page in the props
const endPage = computed(() => {
  return Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages);
});

// Store all the pages in the data received
const pages = computed(() => {
  let range = [];
  for (let i = startPage.value; i <= endPage.value; i++) {
    range.push({
      number: i,
      isDisabled: i === props.currentPage,
    });
  }
  return range;
});

const isInFirstPage = computed(() => {
  return props.currentPage === 1;
});
const isInLastPage = computed(() => {
  return props.currentPage === props.totalPages;
});

/*
  Methods for the props control
*/
const onClickFirstPage = () => emit("pageChanged", 1);
const onCLickPreviousPage = () => emit("pageChanged", props.currentPage - 1);
const onClickPage = (page) => emit("pageChanged", page);
const onClickNextPage = () => emit("pageChanged", props.currentPage + 1);
const onClickLastPage = () => emit("pageChanged", props.totalPages);
const isPageActive = (page) => props.currentPage === page;

const onPageChange = (page) => {
  return (props.currentPage = page);
};

const loadGames = async () => {
  isLoading.value = true;
  try {
    await gamesStore.getGames();
  } catch (err) {
    error.value = err.message || "Something went wrong";
  }
  isLoading.value = false;
};

const loadCoaches = async (refresh = false) => {
  isLoading.value = true;
  try {
    await coachesStore.loadCoachesStore({ forceRefresh: refresh });
  } catch (err) {
    error.value = err.message || "Something went wrong";
  }
};

/* 
  Handle error
*/
const handleError = () => {
  error.value = null;
};

/*
  On mounted we execute the fetch
*/
loadCoaches();
loadGames();
</script>
