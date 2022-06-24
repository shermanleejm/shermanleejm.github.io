import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Tooltip from "primevue/tooltip";

import Home from "./components/Home";
import ScreenA from "./components/ScreenA";
import ScreenB from "./components/ScreenB";

const router = new createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/A",
      component: ScreenA,
    },
    {
      path: "/B",
      component: ScreenB,
    },
  ],
});

createApp(App)
  .use(router)
  .use(PrimeVue)
  .directive("tooltip", Tooltip)
  .mount("#app");
