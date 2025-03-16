import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { configure } from "vee-validate"

import App from "./App.vue";
import router from "./router";

configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: false, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: false, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
})

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount("#app");
