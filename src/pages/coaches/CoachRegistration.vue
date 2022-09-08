<template>
  <section class="container">
    <div class="card mt-6">
      <h2 class="pt-6 pl-6 is-size-2">Register as a coach!</h2>
      <coach-form-vue @save-data="saveData"></coach-form-vue>
    </div>
  </section>
</template>

<script setup>
/*
  Imports
*/
import { useCoachesStore } from "../../store/coachesStore";
import { useRouter } from "vue-router";
import CoachFormVue from "../../components/coaches/CoachForm.vue";

/*
  Coach Store
*/
const coachesStore = useCoachesStore();

/*
  Use Router
*/
const router = useRouter();

/*
  Receiving the emit from coach-form
*/
const saveData = (formData) => {
  coachesStore.saveCoach(formData);
  console.log(coachesStore.coaches);
  router.replace({ path: "/coaches" });
};
</script>
