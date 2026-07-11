import { createApp } from "vue";
import router from "./router/router";
import 'virtual:uno.css'
import "./theme/global.css";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
