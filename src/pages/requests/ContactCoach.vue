<template>
  <div class="container">
    <form class="p-6" @submit.prevent="submitForm">
      <div class="field">
        <label for="email" class="label">Your E-mail</label>
        <input type="email" id="email" class="input" v-model.trim="contactEmail.val" />
        <p v-if="!contactEmail.isValid" class="has-text-danger">
          Please enter a valid e-mail address.
        </p>
      </div>
      <div class="field">
        <label for="message" class="label">Message</label>
        <textarea
          id="message"
          rows="10"
          class="textarea"
          v-model.trim="contactMessage.val"
        ></textarea>
        <p v-if="!contactMessage.isValid" class="has-text-danger">
          Please enter a message, try asking questions to the coach
        </p>
      </div>
      <div class="actions">
        <button class="button is-success">Send Message</button>
      </div>
    </form>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRequestsStore } from "../../store/requestsStore";

/*
  Use Store / Route
*/
const requestsStore = useRequestsStore();
const route = useRoute();
const router = useRouter();

/*
  Variables
*/
const contactEmail = ref({
  val: "",
  isValid: true,
});
const contactMessage = ref({
  val: "",
  isValid: true,
});
const formIsValid = ref(true);

/*
  Form Submit and Validation
*/
const validateForm = () => {
  formIsValid.value = true;
  contactEmail.value.isValid = true;
  contactMessage.value.isValid = true;

  if (contactEmail.value.val === "" || !contactEmail.value.val.includes("@")) {
    contactEmail.value.isValid = false;
    formIsValid.value = false;
  }

  if (contactMessage.value.val === "") {
    contactMessage.value.isValid = false;
    formIsValid.value = false;
  }
};

const submitForm = () => {
  validateForm();

  if (formIsValid.value === false) {
    return;
  }
  requestsStore.addRequest({
    coachId: route.params.id,
    userEmail: contactEmail.value.val,
    message: contactMessage.value.val,
  });

  router.replace("/coaches");
};
</script>
