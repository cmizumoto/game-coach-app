<template>
  <header class="has-background-light py-3">
    <nav
      class="navbar container has-background-light menu-check"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <h1>
          <router-link class="navbar-item is-white" to="/">Game Coach</router-link>
        </h1>
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': menuActive }"
          @click.prevent="menuActive = !menuActive"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu menu-check" :class="{ 'is-active': menuActive }">
        <div class="navbar-start">
          <router-link
            to="/coaches"
            class="navbar-item is-light"
            active-class="is-active"
            @click="menuActive = false"
            >Coaches</router-link
          >

          <router-link
            to="/games"
            class="navbar-item is-light"
            active-class="is-active"
            @click="menuActive = false"
            >Games</router-link
          >

          <router-link
            v-if="isLoggedIn"
            to="/requests"
            class="navbar-item is-light"
            active-class="is-active"
            @click="menuActive = false"
            >Requests</router-link
          >
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons menu-check">
              <router-link v-if="!isLoggedIn" to="/auth?redirect=register" class="button is-primary"
                >Login to Register as a coach</router-link
              >

              <button v-if="isLoggedIn" class="button is-light is-warning" @click="logout">
                Logout
              </button>
              <router-link v-else class="button is-light" to="/auth">Login</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
/*
  Imports
*/
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/authStore";

/* 
  Store and Router
*/
const authStore = useAuthStore();
const router = useRouter();

/*
  Menu status
*/
const menuActive = ref(false);

/* 
  Computed
*/
const isLoggedIn = computed(() => {
  return authStore.isAuthenticated;
});

/*
  Close menu on click outside
*/
const closeMenu = () => {
  return (menuActive.value = false);
};

/* 
  Logout method
*/
const logout = () => {
  authStore.logout();
  router.replace("/coaches");
};

/*
  Listen to clicks outside menu
*/
const handleClickOut = (event) => {
  const eventArr = Object.values(event.target.classList);
  if (eventArr.includes("navbar-burger") && menuActive.value === true) {
    return (menuActive.value = true);
  }
  if (!eventArr.includes("menu-check")) {
    closeMenu();
  }
};
document.addEventListener("click", handleClickOut);
</script>

<style scoped>
.navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
}
</style>
