import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// 分頁元件 模組化 進行匯入
import pagination from './pagination.js';

// 先宣告兩個Modal (productModal 產品編輯、delProductModal 產品刪除 )
let productModal = null;
let delProductModal = null;

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'wendybai',
      products: [],
      // 商品狀態(切換使用)
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      // 產品分頁
      page: {},
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
    // 確認驗證登入成功，才能取得產品資料。並且夾帶page
    getData(page = 1) { //預設參數
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          // 使用物件解構方法 (將右邊的資料_res.data，往左邊送)
          const { products, pagination } = res.data;
          //再將api取得的產品資料，傳到data資料裡的products和page
          this.products = products;
          this.page = pagination;
          console.log(res);
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = 'login.html';
        })
    },
    // 新增/編輯/刪除 開啟Modal (依@click回傳參數:new/edit/delete來觸發openModal函式)
    // openModal函式的item參數為 (v-for渲染多筆資料，從products陣列抓取的元素，再把元素指定給item)
    openModal(isNew, item) {
      // 新增產品因資料尚未建立， this.tempProduct初始化
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        // 讓Modal透過v-if="isNew"，false->true切換來顯示新增產品文字。顯示productModal 
        this.isNew = true;
        productModal.show();
      }
      // Modal的編輯
      else if (isNew === 'edit') {
        // 使用淺拷貝 (*避免寫成this.tempProduct = product。因物件傳參考，修改會連動到)
        this.tempProduct = { ...item };
        // 讓Modal透過v-else，true->false切換來顯示新增產品文字。顯示productModal 
        this.isNew = false;
        productModal.show();
      }
      // Modal的刪除
      else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        // 商品狀態為delete，顯示delProductModal 產品刪除
        delProductModal.show();
      }
    },
  },
  // 區域註冊 分頁元件 
  components: {
    pagination
  },
});
// 全域註冊 產品新增/編輯元件 productModal
app.component('product-modal', {
  // 在props屬性(外層->內層) 新增 tempProduct、isNew(商品狀態)
  // template 填入id，html的id就會與元件進行對應
  props: ['tempProduct', 'isNew'],
  template: '#product-modal-template',
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'wendybai',
    };
  },
  mounted() {
    //建立bootstrap modal實體。並將options設定keyboard: false(取消按下 ESC 鍵時關閉互動視窗)
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });
  },
  methods: {
    // 新增/編輯產品 透過if判斷 isNew(商品狀態)來切換api呼叫方法
    updateProduct() {
      // 新增一個產品(isNew: false)，axios需夾帶data
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = 'post';
      // 修改產品 (反向為true成立)，"當不是新增產品需求" 即切換為修改產品。需夾帶data
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }
      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          // 動態視窗元件Modal 隱藏
          this.hideModal();
          // 修改產品後，再次取得產品資料(透過emit帶入方法自訂名稱，來觸發外層事件getData)
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    hideModal() {
      productModal.hide();
    },
    // 新增圖片
    createImages() {
      this.tempProduct.imagesUrl = [];
      //push從陣列尾端 新增圖片連結
      this.tempProduct.imagesUrl.push('');
    },
  },
})
// 全域註冊 產品刪除元件 delProductModal
app.component('del-product-modal', {
  // 在props屬性(外層->內層) 新增 tempProduct、isNew(商品狀態)
  props: ['tempProduct'],
  template: '#del-product-modal-template',
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'wendybai',
    };
  },
  mounted() {
    //建立bootstrap modal實體。並將options設定keyboard: false(取消按下 ESC 鍵時關閉互動視窗)
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });
  },
  methods: {
    // 產品刪除Modal (點刪除 -> 最後"確認刪除")
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      //刪除產品 
      axios.delete(url)
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          // 確認刪除後將 產品刪除Modal隱藏          
          this.hideModal();
          // 刪除產品後，再次取得產品資料
          this.$emit('update');
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    hideModal() {
      delProductModal.hide();
    },
  }
})
app.mount("#app");
