// 匯入 產品Modal (顯示產品列表)
import userProductModal from "./userProductModal.js";
//  區域註冊並透過 Form, Field, ErrorMessage來取得方法
const { Form, Field, ErrorMessage } = VeeValidate;

// 定義規則 全部加入(CDN 版本)
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// 載入多國語系
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = "https://vue3-course-api.hexschool.io/";
const apiPath = "wendybai";

const app = Vue.createApp({
  data() {
    return {
      loadingStatus: {
        loadingItem: "", //存id
      },
      products: [], //產品列表
      product: {}, //單一產品
      // 驗證測試
      text: '這是一段文字',
      form:{
        user: {
          name:'',
          email:'',
          tel:'',
          address:'',
        },
        message: '',
      },
      cart: {},
    };
  },
  // 區域註冊元件-驗證
  components:{
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    // 取得產品列表
    getProducts() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/products`)
        .then((res) => {
          // console.log("取得產品列表", res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 取得單一產品
    getProduct(id) {
      // 將id指定給外層元件 (後續可判斷)
      this.loadingStatus.loadingItem = id;
      axios.get(`${apiUrl}/v2/api/${apiPath}/product/${id}`)
        .then((res) => {
          this.loadingStatus.loadingItem = ""; //需在modal關閉後，清掉id
          // console.log("單一產品product", res.data.product);
          this.product = res.data.product;
          // $refs (Modal封裝) Modal方法建立在元件內層，釋出方法讓外層使用(透過ref讓外層元件可取用內層元件)
          this.$refs.userProductModal.openModal();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      // 加入購物車$refs可抓到，<user-product-modal>內層元件內的 ref="userProductModal"
      this.$refs.userProductModal.hideModal();
      // 加入購物車 api格式，需傳入購物車資料(按照api格式 將cart放在data物件內)
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, { data: cart })
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = ""; //需在modal關閉後，清掉id
          this.getCart(); //取得購物車資料
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 取得購物車資料
    getCart() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((res) => {
          // console.log("取得購物車資料", res.data);
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 更新購物車時會傳入參數
    updateCart(data) {
      this.loadingStatus.loadingItem = data.id;
      // console.log("data", data);
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      // put api id為購物車id
      axios
        .put(`${apiUrl}/v2/api/${apiPath}/cart/${data.id}`, { data: cart })
        .then((res) => {
          // console.log("更新購物車:", res);
          alert(res.data.message);
          this.loadingStatus.loadingItem = ""; //清掉data.id(購物車id)，判斷 loading 動畫
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
          this.loadingStatus.loadingItem = "";
        });
    },
    //清空購物車
    deleteAllCarts() {
      axios
        .delete(`${apiUrl}/v2/api/${apiPath}/carts`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 刪除購物車指定商品
    removeCartItem(id) {
      this.loadingStatus.loadingItem = id;
      axios
        .delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.loadingStatus.loadingItem = ""; //清掉data.id(購物車id)，判斷 loading 動畫
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    // 結帳 送出表單
    createOrder(){
      const order = this.form;
       // 需傳入表單資料(按照api格式，將表單賦予給order)
      axios.post(`${apiUrl}/v2/api/${apiPath}/order`,{ data: order })
      .then((res)=>{
        console.log('res.data.message',res);
        alert(res.data.message);
        // $refs可抓到，內層元件內的 ref="form"。(resetFrom()為js內建方法)
        this.$refs.form.resetForm();
        this.getCart();
      }).catch((err) =>{
        alert(err.response.data.message);
      });     
    },
  },
  mounted() {
    this.getProducts();
    this.getCart(); //加入購物車一開始就須執行，所以放生命週期
  },
});
// 全域註冊 產品列表元件 (定義元件指定名稱為userProductModal)
app.component("userProductModal", userProductModal);
app.mount("#app");
