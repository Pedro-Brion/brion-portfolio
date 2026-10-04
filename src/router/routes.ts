import Home from "@/pages/home/Home.vue";
import Layout from "@/pages/Layout.vue";
import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "",
        component: Home,
        name:'home'
      },
      {
        path: "/projects",
        component: () => import("@/pages/projects/Projects.vue"),
        name:'projects'
      },
    ],
  },
];
