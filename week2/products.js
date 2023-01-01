const App = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'wendybai',
      products: [],
      tempProduct: {},
    }
  },
  // 生命週期(函式)，當元件生成時，同時執行這段函式，只會執行一次
  mounted() {
    // 取出token，只執行一次 (自定義cookie名稱)
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)wendyToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 發送axios時，預設將Authorization認證內的token，加到headers裡面
    axios.defaults.headers.common['Authorization'] = token;
    //流程上 先登入 -> 驗證登入是否成功 (驗證成功後續才能取得產品資料)
    // console.log(token);
    this.checkLogin()
  },
  // 方法(物件)
  methods: {
    // 驗證登入 (成功->取得產品資料；失敗->導至登入頁)
    checkLogin() {
      axios.post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          // console.log(res);
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    // 確認驗證登入成功，才能取得產品資料
    getData() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          // 把api取得的產品資料，傳到data資料裡的products空陣列
          this.products = res.data.products;
          // console.log(res);
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    // 查看細節btn -> 觸發openProduct函式，並將渲染的資料(product)以參數傳入
    openProduct(product) {
      // 把外部定義的products(產品資料)，以物件傳參考的形式，傳到元件data資料裡的tempProduct空物件
      this.tempProduct = product;
    }
  },
};
Vue.createApp(App).mount("#app");
  //Vue.createApp(App) -> 指定給App變數
  //.mount('#app') ->掛載到dom元素上