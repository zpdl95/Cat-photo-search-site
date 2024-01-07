import { lazyloading } from '../utils/lazyloading';
import { scrollFetch } from '../utils/scrollFetch';

class SearchResult {
  constructor({ $target, initialData, onClick, scrollSearch }) {
    this.$searchResult = document.createElement('main');
    this.$searchResult.className = 'SearchResult';
    $target.appendChild(this.$searchResult);

    this.data = initialData;
    this.onClick = onClick;
    this.scrollSearch = scrollSearch;

    this.render();

    this.$searchResult.addEventListener('click', (e) => {
      e.stopPropagation();
      const $item = e.target.closest('.item');
      if ($item) {
        const index = Array.from(
          this.$searchResult.querySelectorAll('.item')
        ).indexOf($item);
        this.onClick(this.data.fetchCats[index]);
      }
    });
  }

  setState(nextData) {
    this.data = nextData;
    this.render();
  }

  render() {
    if (this.data.fetchCats == null) return;

    if (this.data.fetchCats.length > 0 && Array.isArray(this.data.fetchCats)) {
      //데이터 있는 배열
      this.$searchResult.innerHTML = this.data.fetchCats
        .map(
          (cat) => `
            <figure class="item">
              <img class='lazy' data-src=${cat.url} alt=${cat.name} />
              <figcaption>${cat.name}</figcaption>
            </figure>
          `
        )
        .join('');
      lazyloading();
      scrollFetch(this.scrollSearch);
    } else if (Array.isArray(this.data.fetchCats)) {
      //빈배열
      this.$searchResult.innerHTML = `
      <article class='not-result'>
        <h1>검색 결과가 없습니다.</h1>
      </article>
      `;
    } else {
      //에러 문자열
      this.$searchResult.innerHTML = `
      <article class='not-result'>
        <h1>${this.data.fetchCats}</h1>
      </article>
      `;
    }
  }
}

export default SearchResult;
