import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useRequestsStore = defineStore("requestsStore", {
  state: () => {
    return {
      requests: [],
    };
  },
  getters: {
    requestsList(state) {
      const authStore = useAuthStore();
      const coachId = authStore.userIdGetters;
      return state.requests.filter((req) => req.coachId === coachId);
    },
    hasRequests(state) {
      return state.requestsList && state.requestsList.length > 0;
    },
  },
  actions: {
    async addRequest(requestData) {
      const newRequest = {
        coachId: requestData.coachId,
        userEmail: requestData.userEmail,
        message: requestData.message,
      };

      const response = await fetch(
        `https://gamecoaches-e8335-default-rtdb.firebaseio.com/requests/${requestData.coachId}.json`,
        {
          method: "POST",
          body: JSON.stringify(newRequest),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to send request.");
        throw error;
      }
      newRequest.id = responseData.name;

      this.requests.push(newRequest);
    },
    async fetchRequests() {
      const authStore = useAuthStore();
      const coachId = authStore.userIdGetters;
      const token = authStore.tokenGetter;

      const response = await fetch(
        `https://gamecoaches-e8335-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${token}`
      );
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch request.");
        throw error;
      }

      const requests = [];
      for (const key in responseData) {
        const request = {
          id: key,
          coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message,
        };
        requests.push(request);
      }

      this.requests = requests;
    },
  },
});
