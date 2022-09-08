<template>
  <div>
    <the-header></the-header>
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
/*
  Imports
*/
import TheHeader from "@/components/layout/TheHeader.vue";
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./store/authStore";

/* 
  Store and router declaration
*/
const authStore = useAuthStore();
const router = useRouter();

const didAutoLogout = computed(() => {
  return authStore.getDidAutoLogout;
});

watch(didAutoLogout, (curValue, oldValue) => {
  if (curValue && curValue !== oldValue) {
    router.replace("/coaches");
  }
});

authStore.tryLogin();
</script>

<style>
/*
  IMPORTS
*/
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;900&display=swap");

/*
  Global
*/
* {
  box-sizing: border-box;
}
html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.route-enter-active {
  transition: all 0.2s ease-out;
}
.route-leave-active {
  transition: all 0.2s ease-in;
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
