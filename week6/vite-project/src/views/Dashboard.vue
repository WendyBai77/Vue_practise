<template>
  <div>
    <h1>你現在在後台頁面</h1>
    <div id="nav">
      <router-link to="/">回到前台</router-link> |
      <router-link to="/admin/products">後台產品列表</router-link> |
      <router-link to="/admin/orders">後台訂單</router-link> |
      <a href="#" @click.prevent="signout">登出</a>
    </div>
    <!-- 驗證成功 才會呈現路由配置元件 -->
    <router-view v-if="checkSuccess"></router-view>
  </div>
</template>

<script>
// 驗證可以寫這邊
export default {
  name: "Dashboard",
  data() {
    return {
      checkSuccess: false,
    };
  },
  // 先登入 -> 驗證登入是否成功 (驗證成功後續才能取得產品資料)
  mounted() {
    this.checkLogin();
  },
  methods: {
    checkLogin() {
      // 取出token，只執行一次 (自定義cookie名稱)
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)wendyToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      // console.log(token);
      if (token) {
        // 發送axios時，預設將Authorization認證內的token，加到headers裡面
        this.$http.defaults.headers.common.Authorization = `${token}`;
        const api = `${import.meta.env.VITE_API}/api/user/check`;
        this.$http
          .post(api)
          .then(() => {
            this.checkSuccess = true;
          })
          .catch((err) => {
            alert(err.response.data.message);
            this.$router.push("/login");
          });
      } else {
        alert("您尚未登入。");
        // 路徑導向 登入頁
        this.$router.push("/login");
      }
    },
    signout() {
      document.cookie = "wendybai=;expires=;";
      alert("token 已清除");
      this.$router.push("/login");
    },
  },
};
</script>
