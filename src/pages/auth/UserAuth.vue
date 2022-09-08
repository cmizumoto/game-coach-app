<template>
  <div>
    <base-modal :show="!!error" title="An error occourred" @close="handleError">
      <p>{{ error }}</p>
    </base-modal>
    <base-modal :show="isLoading" fixed>
      <base-spinner></base-spinner>
    </base-modal>
    <form @submit.prevent="submitForm" class="is-flex is-justify-content-center mt-4">
      <div class="card p-6">
        <div class="field">
          <label class="label" for="email">E-mail</label>
          <div class="control">
            <input class="input" type="email" id="email" v-model.trim="email" />
          </div>
        </div>
        <div class="field">
          <label class="label" for="password">Password</label>
          <div class="control">
            <input class="input" type="password" id="password" v-model.trim="password" />
          </div>
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password(must be at least 6 characters long)
        </p>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-primary">{{ submitButtonCaption }}</button>
          </div>
          <div class="control">
            <button class="button is-success" type="button" mode="flat" @click="switchAuthMode">
              {{ switchModeButtonCaption }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
/*
    Imports
*/
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../store/authStore";

/* 
  Stores and Router
*/
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

/*
    Refs
*/
const email = ref("");
const password = ref("");
const formIsValid = ref(true);
const mode = ref("login");
const isLoading = ref(false);
const error = ref(null);

/*
    Computed to change the words on buttons and modes
*/
const submitButtonCaption = computed(() => {
  if (mode.value === "login") {
    return "Login";
  } else {
    return "Sign Up";
  }
});
const switchModeButtonCaption = computed(() => {
  if (mode.value === "login") {
    return "Become a member here";
  } else {
    return "Login";
  }
});

/*
    Methods for the buttons Login and SignUp
*/
const submitForm = async () => {
  formIsValid.value = true;
  if (email.value === "" || !email.value.includes("@") || password.value.length < 6) {
    formIsValid.value = false;
    return;
  }
  isLoading.value = true;

  const actionPayload = {
    email: email.value,
    password: password.value,
  };
  try {
    if (mode.value === "login") {
      await authStore.login(actionPayload);
    } else {
      await authStore.signup(actionPayload);
    }
    const redirectURL = "/" + (route.query.redirect || "coaches");
    router.replace("/coaches");
  } catch (err) {
    error.value = err.message || "Failed to authenticate, try again later";
  }

  isLoading.value = false;
};
const switchAuthMode = () => {
  if (mode.value === "login") {
    mode.value = "signup";
  } else {
    mode.value = "login";
  }
};

const handleError = () => {
  error.value = false;
};
</script>

<style scoped>
.card {
  min-width: 40rem;
}
</style>
