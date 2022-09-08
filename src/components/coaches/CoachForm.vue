<template>
  <div class="container p-6">
    <form @submit.prevent="submitForm">
      <div class="field" :class="{ invalid: !userName.isValid }">
        <label class="label" for="name">Name</label>
        <input
          type="text"
          id="name"
          class="input"
          v-model.trim="userName.val"
          placeholder="Dirst name is just fine"
          @blur="resetValidity('userName')"
        />
        <p class="has-text-danger" v-if="!userName.isValid">Please fill out your name</p>
      </div>
      <div class="field" :class="{ invalid: !userAlias.isValid }">
        <label class="label" for="alias">Nickname</label>
        <input
          type="text"
          id="alias"
          class="input"
          placeholder="Put your game tag or nickname"
          v-model.trim="userAlias.val"
          @blur="resetValidity('userAlias')"
        />
        <p class="has-text-danger" v-if="!userAlias.isValid">We need your alias</p>
      </div>
      <div class="field" :class="{ invalid: !userDescription.isValid }">
        <label class="label" for="description">Description</label>
        <textarea
          type="text"
          id="description"
          class="textarea"
          rows="5"
          placeholder="Tell us about yourself"
          v-model.trim="userDescription.val"
          @blur="resetValidity('userDescription')"
        ></textarea>
        <p class="has-text-danger" v-if="!userDescription.isValid">
          Please write a description for other users
        </p>
      </div>
      <div class="field" :class="{ invalid: !userRate.isValid }">
        <label class="label" for="alias">Hourly rate</label>
        <input
          type="number"
          id="alias"
          class="input"
          v-model="userRate.val"
          @blur="resetValidity('userRate')"
        />
        <p class="has-text-danger" v-if="!userRate.isValid">Please enter your rate per hour</p>
      </div>
      <div class="field" :class="{ invalid: !checkedAreas.isValid }">
        <label class="label">Areas of Expertise</label>
        <div>
          <label class="checkbox is-block" for="speedrunner">
            <input
              type="checkbox"
              id="speedrunner"
              value="speed runner"
              v-model="checkedAreas.val"
              @blur="resetValidity('checkedAreas')"
            />
            Speed Runner
          </label>
          <label class="checkbox is-block" for="loremaster">
            <input
              type="checkbox"
              id="loremaster"
              value="lore master"
              v-model="checkedAreas.val"
              @blur="resetValidity('checkedAreas')"
            />
            Lore Master
          </label>
          <label class="checkbox is-block" for="tournamentP">
            <input
              type="checkbox"
              id="tournamentP"
              value="tournament player"
              v-model.number="checkedAreas.val"
              @blur="resetValidity('checkedAreas')"
            />
            Tournament Player
          </label>
          <label class="checkbox is-block" for="tournamentO">
            <input
              type="checkbox"
              id="tournamentO"
              value="tournament organizer"
              v-model="checkedAreas.val"
              @blur="resetValidity('checkedAreas')"
            />
            Tournament Organizer
          </label>
          <p class="has-text-danger" v-if="!checkedAreas.isValid">
            Please select at least one area of expertise
          </p>
        </div>
      </div>
      <p class="has-text-danger" v-if="!formIsValid">
        Please fix the above errors and submit again.
      </p>
      <div class="is-flex is-justify-content-end">
        <router-link class="button mt-6 mr-4 px-6" to="/coaches">Cancel</router-link>
        <button class="button mt-6 px-6 is-primary">Register</button>
      </div>
    </form>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { ref } from "vue";

/*
  Refs variables
*/
const userName = ref({
  val: "",
  isValid: true,
});
const userAlias = ref({
  val: "",
  isValid: true,
});
const userDescription = ref({
  val: "",
  isValid: true,
});
const userRate = ref({
  val: null,
  isValid: true,
});
const checkedAreas = ref({
  val: [],
  isValid: true,
});
// Variables for validations, not sure if gonna use it here
const formIsValid = ref(true);

/*
  Emits
*/
const emit = defineEmits(["save-data"]);

/*
  Form Validation
*/
const validateForm = () => {
  formIsValid.value = true;

  if (userName.value.val === "") {
    userName.value.isValid = false;
    formIsValid.value = false;
  }
  if (userAlias.value.val === "") {
    userAlias.value.isValid = false;
    formIsValid.value = false;
  }
  if (userDescription.value.val === "") {
    userDescription.value.isValid = false;
    formIsValid.value = false;
  }
  if (!userRate.value.val || userRate.value.val < 0) {
    userRate.value.isValid = false;
    formIsValid.value = false;
  }
  if (checkedAreas.value.val.length === 0) {
    checkedAreas.value.isValid = false;
    formIsValid.value = false;
  }
};

/*
  Reset validation
*/
const resetValidity = function (input) {
  this[input].isValid = true;
};

/*
  Creating new user
*/
const submitForm = () => {
  validateForm();

  if (!formIsValid.value) {
    return;
  }

  const newUser = {
    name: userName.value.val,
    alias: userAlias.value.val,
    description: userDescription.value.val,
    rate: userRate.value.val,
    areas: checkedAreas.value.val,
  };

  emit("save-data", newUser);
};
</script>

<style scoped>
.invalid input,
.invalid textarea,
.invalid label {
  border-color: red;
}
</style>
