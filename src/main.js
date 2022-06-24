import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

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

createApp(App).use(router).mount("#app");
