import { createApp } from "vue";
import { createPinia } from "pinia";
// Vue loading套件 "註冊元件"
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

// Vue Axios套件(安裝後就不需要至每個元件進行匯入)
import axios from "axios";
import VueAxios from "vue-axios";
// 匯入自定義scss
import "./assets/all.scss";

// 引入 VeeValidate 元件跟功能
import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
// 引入 VeeValidate 的驗證規則
import AllRules from "@vee-validate/rules";
// 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from "@vee-validate/i18n";
// 引入 VeeValidate 的繁體中文語系檔
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

import App from "./App.vue";
import router from "./router";

// 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
// 將當前 VeeValidate 的語系設定為繁體中文
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 設定預設語系
setLocale("zh_TW");

import "./assets/main.css";

const app = createApp(App);

//使用app.use將vue與pinia進行綁定
app.use(createPinia());
//使用app.use將vue與router進行綁定
app.use(router);
// 全域註冊 loading套件
app.component("VueLoading", Loading);
//使用app.use將vue與axios進行綁定
app.use(VueAxios, axios);
// 掛載 Global 的 VeeValidate 元件
app.component("VField", Field);
app.component("VForm", Form);
app.component("ErrorMessage", ErrorMessage);

app.mount("#app");
