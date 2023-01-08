const App = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'wendybai',
      user: {
        username: '',
        password: '',
      },
    };
  },
  // 方法(物件)
  methods: {
    login() {
      axios.post(`${this.apiUrl}/admin/signin`, this.user)
        .then((res) => {
          // console.log(res);
          //取出登入成功後伺服器回傳的token和expired
          const { token, expired } = res.data;
          //將token和expired 存到cookie。expired原始格式是unix timestamp，需要轉型將字串轉換為日期!
          document.cookie = `wendyToken=${token}; expires=${new Date(expired)}`;
          // 登入 -> 導產品頁 
          window.location = `products.html`;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
};
Vue.createApp(App).mount("#app");
//Vue.createApp(App) -> 指定給App變數
//.mount('#app') ->掛載到dom元素上