import { defineStore } from "pinia";

export const useGamesStore = defineStore("gamesStore", {
  state: () => {
    return {
      games: [],
      lastFetch: null,
      error: false,
    };
  },
  actions: {
    async getGames() {
      if (!this.shouldUpdate) {
        return;
      }
      let response;
      // Try fetching the data
      try {
        const api_url = "https://gqkuommdmfzmwkzdewma.supabase.co/rest/v1/steam?select=*";
        response = await fetch(api_url, {
          headers: {
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxa3VvbW1kbWZ6bXdremRld21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDkyNjQyNTIsImV4cCI6MTk2NDg0MDI1Mn0.iF651HDhqynAQRlG8T6wFS3ZEx4dqxHiEiguc0m7-zI",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZWNyZXQiOiI2YzE5ZDg0ZjJlMTdhMWU1MDg4ZWMyMjIiLCJpYXQiOjE2NTg1MjEyODZ9.PxlObW3Yy1cXqJysOZUace_sEE9a0U_ecfo0k410mKw",
          },
        });
        // If the server is not reached, we throw an error
        if (response.status !== 200) {
          throw true;
        }
      } catch (err) {
        // catch the error and give information and updating the error value
        console.log("Server not responding, please try again later");
        this.error = err;
      }

      // otherwise we continue putting the data into the ref dataFetched
      const responseData = await response.json();
      this.games = responseData;
      this.lastFetch = new Date().getTime();
    },
  },
  getters: {
    gamesList(state) {
      return state.games;
    },
    errorShow(state) {
      return state.error;
    },
    /* 
      Cache fetch related getters
    */
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      // it will return true of false if one minute has passed
      // the value 1000 is set because of the milliseconds received from Date().getTime();
      // is the seconds, because we are converting from milliseconds to seconds
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
  },
});
