// 分頁元件模組化
export default {
    // 從外部引入資料(外層->內層)。page為內層元件定義的名稱
    // 分頁 "前一頁"、"下一頁"：使用props屬性<外層傳內層>，並使用同一個函式的方式來切換頁面。
    // 分頁 "當前頁"：透過emit事件 來觸發外層事件getData。
    props: ['pages' , 'getProduct'],
    template:`<nav aria-label="Page navigation example">
    <ul class="pagination">

      <li class="page-item"
      :class = "{ 'disabled' : pages.current_page === 1 }">
        <a class="page-link" href="#" aria-label="Previous"
        @click="getProduct(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    
      <li class="page-item"
      :class = "{ 'active' : page === pages.current_page }"
      v-for ="page in pages.total_pages" :key="page + 'page'">
      <a class="page-link" href="#"
      @click.prevent="$emit('chenge-page', page)">{{ page }}</a>
      </li>

      <li class="page-item"
      :class = "{ 'disabled' : pages.current_page === pages.total_pages }">
        <a class="page-link" href="#" aria-label="Next"
        @click.prevent="getProduct(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>`,
}