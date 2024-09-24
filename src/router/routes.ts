import { RouteRecordRaw } from "vue-router";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/Layout.vue"),
    children: [
      {
        path: "",
        component: () => import("@/pages/home/Home.vue"),
        name:'home'
      },
      // {
      //   path: "/projects",
      //   component: () => import("@/pages/projects/Projects.vue"),
      //   name:'projects'
      // },
    ],
  },
];
