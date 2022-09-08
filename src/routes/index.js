import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/authStore";
import CoachDetail from "@/pages/coaches/CoachDetail.vue";
import CoachRegistration from "@/pages/coaches/CoachRegistration.vue";
import ContactCoach from "@/pages/requests/ContactCoach.vue";
import RequestsReceived from "@/pages/requests/RequestsReceived.vue";
import UserAuth from "@/pages/auth/UserAuth.vue";
import CoachesList from "@/pages/coaches/CoachesList.vue";
import GamesList from "@/pages/games/GamesList.vue";
import NotFound from "@/pages/NotFound.vue";

const routes = [
  {
    path: "/",
    component: null,
    redirect: "/coaches",
  },
  {
    path: "/coaches",
    name: "coaches",
    component: CoachesList,
  },
  {
    path: "/register",
    name: "register",
    component: CoachRegistration,
    meta: { requiresAuth: true },
  },
  {
    path: "/coaches/:id",
    component: CoachDetail,
    name: "detail",
    props: true,
    children: [
      {
        path: "contact",
        name: "contact",
        component: ContactCoach,
      },
    ],
  },
  {
    path: "/requests",
    component: RequestsReceived,
    meta: { requiresAuth: true },
  },
  {
    path: "/games",
    component: GamesList,
  },
  {
    path: "/auth",
    component: UserAuth,
    meta: { requiresUnauth: true },
  },
  {
    path: "/:notFound(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  // Remeber to put store in beforeEach to work
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/auth");
  } else if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    next("/coaches");
  } else {
    next();
  }
});

export default router;
