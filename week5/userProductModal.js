// 元件模組化 匯出 產品列表 
export default {
  // app.component 內的template 填入id，html的id就會與元件進行對應
  template: '#userProductModal',
  // Props 自訂函式
    props:{
      product: {
        type: Object, //驗證型別的屬性
        default(){ //可設預設值 (為當外部沒有傳入預設值的時候，使用設定好的預設值)
          return{
          }
        }
      }
    },
    data() {
      return{
        status: {},
        // modal實體化後會產生一個變數，透過變數進行儲存 賦予讓modal實體化的結果
        modal: {}, 
        qty: 1,
      }
    },
    // 使用生命週期將modal進行「實體化」。透過ref讓外層元件可取用內層元件
    mounted(){
      this.modal = new bootstrap.Modal(this.$refs.modal,{
        keyboard: false, //取消按下 ESC 鍵時關閉互動視窗
      });
    },
    methods: {
      openModal(){
        this.modal.show();
      },
      hideModal() {
        this.modal.hide();
      },
    },
  }