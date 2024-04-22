import { createApp } from "vue";
import router from "./router/router";
import 'virtual:uno.css'
import "./theme/global.scss";
import "./theme/variables.scss";
import App from "./App.vue";

createApp(App).use(router).mount("#app");
