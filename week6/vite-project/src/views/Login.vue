<template>
  <div class="container">
    <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
    <div class="my-5 row justify-content-center">
      <v-form
        ref="form"
        class="col-lg-10"
        v-slot="{ errors }"
        @submit="signIn()"
      >
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="user.username"
          ></v-field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">密碼</label>
          <v-field
            id="password"
            name="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors['password'] }"
            placeholder="請輸入密碼"
            rules="required"
            v-model="user.password"
          >
          </v-field>
          <error-message
            name="password"
            class="invalid-feedback"
          ></error-message>
        </div>
        <button type="submit" class="btn btn-lg btn-primary w-100 mt-3">
          登入
        </button>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      isLoading: false, //預設無讀取效果
    };
  },
  methods: {
    signIn() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);

      const api = `${import.meta.env.VITE_API}/admin/signin`;
      this.$http
        .post(api, this.user)
        .then((res) => {
          //取出登入成功後伺服器回傳的token和expired
          const { token, expired } = res.data;
          // console.log(token, expired);
          //將token和expired 存到cookie。expired原始格式是unix timestamp，需要轉型將字串轉換為日期!
          document.cookie = `wendyToken=${token}; expires=${new Date(expired)}`;
          // console.log(res);
          // 路徑導向 後台購物車列表
          this.$router.push("/admin/products");
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
};
</script>
