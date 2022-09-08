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
        const api_key = import.meta.env.VITE_SUPADB;

        response = await fetch(
          "https://gqkuommdmfzmwkzdewma.supabase.co/rest/v1/<table>?select=*",
          {
            headers: {
              apikey: api_key,
              Authorization: "Bearer " + api_key,
            },
          }
        );
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
