/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  //組件命名 設定忽略規則
  rules: {
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: [
          "Home",
          "About",
          "Index",
          "Products",
          "Cart",
          "Dashboard",
          "Orders",
          "Login",
        ],
      },
    ],
  },
};
