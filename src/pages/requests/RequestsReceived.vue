<template>
  <div>
    <base-modal :show="!!error" title="An error occurred!" @close="handleError">
      <p>{{ error }}</p>
    </base-modal>
    <section class="container mt-4">
      <div class="card p-3">
        <header class="card-header">
          <h2 class="is-size-3 p-3">Requests Received</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul class="card-content" v-else-if="hasRequests && !isLoading">
          <request-item-vue
            v-for="request in receivedRequests"
            key="request.id"
            :email="request.userEmail"
            :message="request.message"
          ></request-item-vue>
        </ul>
        <h3 v-else>You haven't received any requests yet!</h3>
      </div>
    </section>
  </div>
</template>

<script setup>
/*
  Imports
*/
import { ref, computed } from "vue";
import { useRequestsStore } from "../../store/requestsStore";
import RequestItemVue from "../../components/requests/RequestItem.vue";
import BaseModal from "../../components/ui/BaseModal.vue";

/*
  Store
*/
const requestsStore = useRequestsStore();

/* 
  Variables
*/
const isLoading = ref(false);
const error = ref(null);

/*
  Computed
*/
const receivedRequests = computed(() => {
  return requestsStore.requestsList;
});

const hasRequests = computed(() => {
  return requestsStore.hasRequests;
});

/* 
  Methods
*/
const loadRequests = async () => {
  isLoading.value = true;
  try {
    await requestsStore.fetchRequests();
  } catch (err) {
    error.value = err.message || "Failed to load coach requests";
  }
  isLoading.value = false;
};

/* 
  To close the modal
*/
const handleError = () => {
  error.value = null;
};

/* 
  Load the requests as the page is created
*/
loadRequests();
</script>
