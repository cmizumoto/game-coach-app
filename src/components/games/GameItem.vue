<template>
  <div>
    <base-modal :show="!!error" title="An error occurred!" @close="handleError">
      <p>{{ error }}</p>
    </base-modal>
    <li class="m-3" @mouseover="isActive = true" @mouseleave="isActive = false">
      <article class="card">
        <div class="card-image">
          <a :href="link" target="_blank">
            <figure class="image is-256x256">
              <img :src="image" :alt="title" />
            </figure>
          </a>
          <div v-if="isLoggedIn">
            <button
              v-if="!gameStatus"
              @click="addGameFavorites"
              class="add-btn button is-info is-small is-rounded has-text-centered"
              :class="isActive ? 'hover-active' : 'hover-deactive'"
            >
              <span>+</span>
            </button>
            <button
              v-else
              @click="removeGameFavorites"
              class="add-btn button is-info is-small is-rounded has-text-centered"
              :class="isActive ? 'hover-active' : 'hover-deactive'"
            >
              <span>-</span>
            </button>
          </div>
        </div>
        <a :href="link" target="_blank">
          <div class="card-content">
            <div class="content">
              <p>{{ title }}</p>
              <p v-if="price > 0">${{ price }}</p>
              <p v-else>Free to play</p>
            </div>
          </div>
        </a>
      </article>
    </li>
  </div>
</template>

<script setup>
/*
    Imports
*/
import { ref, computed } from "vue";
import { useCoachesStore } from "../../store/coachesStore";
import { useAuthStore } from "../../store/authStore";

/*
  Store
*/
const coachesStore = useCoachesStore();
const authStore = useAuthStore();

/*
  Variables
*/
const isActive = ref(false);
const gameStatus = ref(false);
const isLoading = ref(false);
const error = ref(null);

/*
    Props
*/
const props = defineProps(["image", "title", "price", "link", "id"]);

/* 
  Computed
*/
const isLoggedIn = computed(() => {
  return authStore.isAuthenticated;
});

/*
  Check if game is already added to the user favorites
  and change the button/icon based on that
*/
const gameChecker = () => {
  gameStatus.value = false;
  const userFavGamesIds = coachesStore.getFavoriteGames;
  const checker = userFavGamesIds.some((game) => game === props.id);
  if (checker) {
    gameStatus.value = true;
  }
};

/*
  Add games
*/
const addGameFavorites = async () => {
  const userId = authStore.userIdGetters;
  const game = {
    id: props.id,
    title: props.title,
    price: props.price,
    link: props.link,
    image: props.image,
  };
  isLoading.value = true;
  try {
    await coachesStore.addGameFavorites(userId, game);
  } catch (err) {
    error.value = err.message || "Something went wrong";
  }
  isLoading.value = false;
  gameChecker();
};

/*
  Remove Games
*/
const removeGameFavorites = async () => {
  const userId = authStore.userIdGetters;
  const gameId = props.id;

  try {
    await coachesStore.removeGameFavorites(userId, gameId);
  } catch (err) {
    error.value = err.message || "Something went wrong";
  }

  gameChecker();
};

/* 
  Handle error
*/
const handleError = () => {
  error.value = null;
};

/*
  Call game checker when the page is setup
*/
gameChecker();
</script>

<style scoped>
li {
  list-style: none;
}
.card {
  max-height: 250px;
  width: 270px;
}

.card-image {
  position: relative;
}

.add-btn {
  opacity: 0;
  font-size: 2rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  margin: 0;
  width: 1.7rem;
  height: 1rem;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.hover-active {
  animation-name: pillappear;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
.hover-deactive {
  animation-name: pilldisappear;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.add-btn span {
  transform: translateY(-4px);
}

.image {
  margin: auto;
  justify-content: center;
}

.card-content {
  margin-top: 0;
  margin-bottom: 0;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 0;
  padding-bottom: 0;
}
.content p {
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@keyframes pillappear {
  from {
    opacity: 0;
    height: 1rem;
  }
  to {
    opacity: 1;
    height: 2.5rem;
  }
}

@keyframes pilldisappear {
  from {
    opacity: 1;
    height: 2.5rem;
  }
  to {
    opacity: 0;
    height: 1rem;
  }
}
</style>
