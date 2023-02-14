<template>
  <div class="home">
    <h1>你現在在 前台頁面</h1>
    <div id="nav">
      <!--to加入對應連結。讓使用者可點擊-->
      <router-link to="/">首頁</router-link> |
      <router-link to="/products">前台產品列表</router-link> |
      <router-link to="/cart">前台購物車</router-link> |
      <router-link to="/admin/products">後台購物車列表</router-link>
    </div>
    <!-- 呈現路由配置元件(一個網頁顯示的區域)。加上才能切換頁面 -->
    <router-view></router-view>
  </div>
</template>

<script>
// 將Home.vue預設匯出，App.vue 才能做匯入
export default {
  name: "Home", //除錯使用 對應到開發者工具的name (不加沒影響)
  data() {
    return {};
  },
};
</script>
