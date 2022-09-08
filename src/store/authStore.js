import { defineStore } from "pinia";

let timer;

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
    };
  },
  getters: {
    userIdGetters(state) {
      return state.userId;
    },
    tokenGetter(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    getDidAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
  actions: {
    async login(payload) {
      return this.auth({
        ...payload,
        mode: "login",
      });
    },
    async signup(payload) {
      return this.auth({
        ...payload,
        mode: "signup",
      });
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");

      clearTimeout(timer);

      this.token = null;
      this.userId = null;
    },
    autoLogout() {
      this.logout();
      this.didAutoLogout = true;
    },

    async auth(payload) {
      const mode = payload.mode;
      let url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

      if (mode === "signup") {
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
      }
      const firebaseKey = import.meta.env.VITE_FIREBASE;
      const response = await fetch(url + firebaseKey, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "Failed to authenticate. Check your login data"
        );
        throw error;
      }

      // Get expiration time
      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      // Store user info in local storage
      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate);

      timer = setTimeout(() => {
        this.autoLogout();
      }, expiresIn);

      // Commit the data into the State
      this.token = responseData.idToken;
      this.userId = responseData.localId;
      this.didAutoLogout = false;
    },

    tryLogin() {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(() => {
        this.autoLogout();
      }, expiresIn);

      if (token && userId) {
        this.token = token;
        this.userId = userId;
        this.didAutoLogout = false;
      }
    },
  },
});
