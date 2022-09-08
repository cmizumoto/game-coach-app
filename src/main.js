import { createApp, defineAsyncComponent } from "vue";
import { createPinia } from "pinia";
import router from "@/routes/index.js";
import App from "./App.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";

// import BaseModal from "./components/ui/BaseModal.vue";

const BaseModal = defineAsyncComponent(() => import("./components/ui/BaseModal.vue"));

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.component("base-spinner", BaseSpinner);
app.component("base-modal", BaseModal);

app.mount("#app");
