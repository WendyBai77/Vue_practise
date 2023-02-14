// 來自套件(載入vue-router資源)
import { createRouter, createWebHashHistory } from "vue-router";

// 路由設定
const router = createRouter({
  // 網址路徑模式：使用網址 hash 的形式
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 匯入路由表
  routes: [
    {
      path: "/", // 匯入路徑。第一層在最前面需加上斜線
      component: () => import("../views/Home.vue"), // 匯入外部元件
      // 新增子路由
      children: [
        {
          path: "", //如果沒有填入入徑，將被預設為子路由
          component: () => import("../views/Index.vue"),
        },
        {
          path: "products",
          name: "產品列表", //指定路由名稱(name屬性也可進行頁面切換)
          component: () => import("../views/Products.vue"),
        },
        {
          path: "cart",
          name: "購物車",
          component: () => import("../views/Cart.vue"),
        },
      ],
    },
    {
      path: "/login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/admin",
      component: () => import("../views/Dashboard.vue"),
      children: [
        {
          path: "products",
          component: () => import("../views/Dashboard/Products.vue"),
        },
        {
          path: "orders",
          component: () => import("../views/Dashboard/Orders.vue"),
        },
      ],
    },
  ],
});
// Vue Router的設定檔建立好之後，就可以匯出給main.js使用
export default router;
