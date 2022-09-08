import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useCoachesStore = defineStore("coachesStore", {
  state: () => {
    return {
      lastFetch: null,
      coaches: [
        {
          id: "c1",
          name: "Miguel",
          alias: "xX-Miguel-Xx",
          description:
            "I'm Miguel and I like to play souls borne games, everything about them you can check with me!Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit tenetur quasi exercitationem unde necessitatibus nobis. Temporibus voluptatem hic mollitia earum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit tenetur quasi exercitationem unde necessitatibus nobis. Temporibus voluptatem hic mollitia earum.",
          favorites: [
            "Bloodborne",
            "Elden Ring",
            "Dark Souls 2",
            "Demon's Souls",
            "Nioh",
            "Mortal Shell",
          ],
          areas: ["speed runner"],
          rate: 30,
        },
        {
          id: "c2",
          name: "Claudius",
          alias: "=X=Claudius=X=",
          description:
            "Claudius can 360 no scope anytime, check my reviews and youtube channel for sick moves",
          favorites: ["COD", "Halo", "Fortnite", "Apex Legends"],
          areas: ["tournament player", "tournament organizer"],
          rate: 20,
        },
        {
          id: "c3",
          name: "Josepha",
          alias: "oO-Josepha-Oo",
          description:
            "I know tons of RPGs, feel free to hit me up with questions and I can show you the fantasy world, also send me a message first",
          favorites: [],
          areas: ["lore master"],
          rate: 25,
        },
      ],
    };
  },
  getters: {
    /* 
      Coach related getters
    */

    coachesList(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach() {
      const authStore = useAuthStore();
      const coaches = this.coachesList;
      const userId = authStore.userIdGetters;
      return coaches.some((coach) => coach.id === userId);
    },
    /* 
      Favorite games related getters
    */
    getFavoriteGames() {
      const authStore = useAuthStore();
      const coaches = this.coachesList;
      const userId = authStore.userIdGetters;
      let favGamesId = [];

      const currentUser = coaches.find((coach) => {
        return coach.id === userId;
      });

      if (currentUser === undefined || currentUser === null) {
        return favGamesId;
      }

      currentUser.favorites.forEach((fav) => {
        favGamesId.push(fav.id);
      });
      return favGamesId;
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
  actions: {
    /* 
    Coaches management
    */
    async saveCoach(coachData) {
      const authStore = useAuthStore();
      const userId = authStore.userIdGetters;
      const newCoach = {
        name: coachData.name,
        alias: coachData.alias,
        description: coachData.description,
        favorites: [],
        areas: coachData.areas,
        rate: coachData.rate,
      };
      const token = authStore.tokenGetter;

      const response = await fetch(
        `https://gamecoaches-e8335-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`,
        {
          method: "PUT",
          body: JSON.stringify(newCoach),
        }
      );

      if (!response.ok) {
        // err
      }
      this.coaches.push({
        ...newCoach,
        id: userId,
      });
    },
    async loadCoachesStore(payload) {
      // Getters shouldUpdate
      if (!payload.forceRefresh && !this.shouldUpdate) {
        return;
      }

      const response = await fetch(
        `https://gamecoaches-e8335-default-rtdb.firebaseio.com/coaches.json`,
        {
          method: "GET",
          "cache-control": "no-store",
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch");
        throw error;
      }
      const newCoaches = [];
      for (const key in responseData) {
        const coach = {
          id: key,
          name: responseData[key].name,
          alias: responseData[key].alias,
          description: responseData[key].description,
          favorites: responseData[key].favorites || [],
          areas: responseData[key].areas,
          rate: responseData[key].rate,
        };
        newCoaches.push(coach);
      }
      this.coaches = newCoaches;
      this.lastFetch = new Date().getTime();
    },

    /* 
      Favorite games management
    */
    async addGameFavorites(userId, game) {
      const newCoachesList = this.coachesList;
      const authStore = useAuthStore();
      const token = authStore.tokenGetter;
      let selectUser = newCoachesList.find((coach) => {
        return coach.id === userId;
      });

      if (selectUser.favorites === null || selectUser.favorites.length === 0) {
        selectUser.favorites = [];
      }

      selectUser.favorites.push(game);

      const responseUpdated = await fetch(
        `https://gamecoaches-e8335-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${token}`,
        {
          method: "PUT",
          body: JSON.stringify(selectUser),
        }
      );

      if (!responseUpdated.ok) {
        const error = new Error(responseUpdated.message || "Failed to fetch");
        throw error;
      }
    },
    async removeGameFavorites(userId, gameId) {
      const newCoachesList = this.coachesList;
      const authStore = useAuthStore();
      const token = authStore.tokenGetter;
      const selectedCoach = newCoachesList.find((coach) => coach.id === userId);
      const newFavorites = [...selectedCoach.favorites];
      const favoriteGameIndex = newFavorites.findIndex((game) => game.id === gameId);

      newFavorites.splice(favoriteGameIndex, 1);

      const responseUpdated = await fetch(
        `https://gamecoaches-e8335-default-rtdb.firebaseio.com/coaches/${userId}/favorites.json?auth=${token}`,
        {
          method: "PUT",
          body: JSON.stringify(newFavorites),
        }
      );

      if (!responseUpdated.ok) {
        const error = new Error(responseUpdated.message || "Failed to fetch");
        throw error;
      }
      newCoachesList.find((coach) => coach.id === userId).favorites = newFavorites;
    },
  },
});
