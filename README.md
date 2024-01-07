# [프로그래머스 과제테스트 연습] 고양이 사진 검색 사이트{2020 Dev-Matching: 웹 프론트엔드 개발자(상반기)}

<ol style='border:1px solid; border-radius:10px'>
<li style='font-size:2rem'><a href='#파일구조'>파일구조</a></li>
<li style='font-size:2rem'><a href='#html-css관련'>HTML, CSS관련</a></li>
<li style='font-size:2rem'><a href='#이미지-상세-보기-모달-관련'>이미지 상세 보기 모달 관련</a></li>
<li style='font-size:2rem'><a href='#검색-페이지-관련'>검색 페이지 관련</a></li>
<li style='font-size:2rem'><a href='#스크롤-페이징-구현'>스크롤 페이징 구현</a></li>
<li style='font-size:2rem'><a href='#랜덤-고양이-배너-섹션-추가'>랜덤 고양이 배너 섹션 추가</a></li>
<li style='font-size:2rem'><a href='#코드-구조-관련'>코드 구조 관련</a></li>
</ol>

<hr/>

## 파일구조

> 아래와 같이 파일 구조를 변경하고 진행 하겠습니다.

    src
    |  |___api
    |  |    |___api.js
    |  |___components
    |  |    |___SearchResult.js
    |  |    |___SearchInput.js
    |  |    |___ImageInfo.js
    |  |___utils
    |  |___main.js
    |  |___App.js
    |  |___style.css
    |
    index.html

<hr>

## HTML, CSS관련

- HTML 코드가 전체적으로 `<div>` 로만 이루어져 있다. 시맨틱한 방법으로 변경하라.
- 유저가 사용하는 디바이스의 가로 길이에 따라 검색결과의 `row` 당 `column` 갯수를 변경
  - 992px 이하: 3개
  - 768px 이하: 2개
  - 576px 이하: 1개
- 다크 모드를 지원하도록 CSS를 수정.
  - CSS 파일 내의 다크 모드 관련 주석을 제거한 뒤 구현.
  - 모든 글자 색상은 `#FFFFFF` , 배경 색상은 `#000000` 로 한정.
  - 기본적으로 OS의 다크모드의 활성화 여부를 기반으로 동작, 유저가 테마를 토글링 할 수 있도록 좌측 상단에 토글하는 체크박스를 만든다.

> 시맨틱한 태그는 `<header> , <nav> , <main> , <article> , <section> , <aside> , <footer>` 등이 있습니다.

```js
// src > components > SearchResult.js
class SearchResult {
  ...

  constructor({ $target, initialData, onClick }) {
    this.$searchResult = document.createElement('main');
    ...
  }

  setState(nextData) {
    ...
  }

  render() {
    this.$searchResult.innerHTML = this.data
      .map(
        (cat) => `
          <figure class="item">
            <img src=${cat.url} alt=${cat.name} />
          </figure>
        `
      )
      .join('');
  }
}
```

> `SearchResult.js` 파일에서 `this.$searchResult` 를 `<main>` 으로 변경하고
> `item` 을 `<figure>` 로 변경하겠습니다.

```js
// src > components > ImageInfo.js
class ImageInfo {
  ...
  constructor({ $target, data }) {
    const $imageInfo = document.createElement('article');
    ...
  }

  setState(nextData) {
    ...
  }

  render() {
    if (this.data.visible) {
      const { name, url, temperament, origin } = this.data.image;

      this.$imageInfo.innerHTML = `
        <figure class="content-wrapper">
          <header class="title">
            <h1>${name}</h1>
            <button class="close">x</button>
          </header>
          <img src="${url}" alt="${name}"/>
          <footer class="description">
            <p>성격: ${temperament}</p>
            <p>태생: ${origin}</p>
          </footer>
        </figure>`;
      this.$imageInfo.style.display = 'block';
    } else {
      this.$imageInfo.style.display = 'none';
    }
  }
}
```

> `ImageInfo.js` 파일도 위와 같이 시맨틱 태그로 변경하겠습니다.

```css
/* src > style.css */
.SearchResult {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  grid-gap: 10px;
}
@media (max-width: 992px) {
  .SearchResult {
    grid-template-columns: repeat(3, minmax(250px, 1fr));
  }
}
@media (max-width: 768px) {
  .SearchResult {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
}
@media (max-width: 576px) {
  .SearchResult {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
}
```

> css파일에서 미디어 쿼리를 사용해 유저 화면크기에 따라 보여지는 columns 갯수를 변경합니다.

```css
/* src > style.css */
/* dark mode 처리
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
    color: white;
  }
}
*?
```

> css파일에서 위 주석부분을 css파일 맨 위로 옮긴뒤 사용합니다.

```css
/* src > style.css */
@media (prefers-color-scheme: dark) {
  body {
    --bg: #000000;
    --font: #ffffff;
  }
}

@media (prefers-color-scheme: light) {
  body {
    --bg: #ffffff;
    --font: #000000;
  }
}

body[data-theme='dark'] {
  --bg: #000000;
  --font: #ffffff;
}

body[data-theme='light'] {
  --bg: #ffffff;
  --font: #000000;
}
```

> `prefers-color-scheme` 는 사용자의 os 테마 값을 사용하는것 입니다. `data-theme` 은 `body` 에 속성값으로 유저가 테마를 토글링하게 되면 그 값에 따라 다크모드를 구현하도록 만들었습니다.

> 유저가 테마를 토글링 할 수 있도록 다크모드 컴포넌트를 생성했습니다.

```js
// src > components > Darkmode.js
class Darkmode {
  constructor({ $target }) {
    this.darkmodeBtn = document.createElement('button');
    this.darkmodeBtn.textContent = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'light'
      : 'dark';
    $target.appendChild(this.darkmodeBtn);

    this.darkmodeBtn.addEventListener('click', () => {
      let originalTheme = document.body.dataset.theme;

      if (!originalTheme) {
        originalTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
      }

      const toggleTheme = originalTheme === 'dark' ? 'light' : 'dark';

      document.body.setAttribute('data-theme', toggleTheme);

      this.render();
    });
  }

  render() {
    this.darkmodeBtn.textContent =
      this.darkmodeBtn.textContent === 'dark' ? 'light' : 'dark';
  }
}

export default Darkmode;
```

> 그리고 `App.js` 에서 사용합니다. `SearchInput` 컴포넌트 위에서 호출하여 input 위에 버튼이 생성되게 합니다.

```js
// src > App.js

...

class App {
  constructor($target) {
    ...

    this.darkmode = new Darkmode({ $target });

    this.searchInput = new SearchInput({
      $target: inputSection,
      onSearch: async (keyword) => {
        this.recentSearched.setState(keyword);
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    ...

  }

  ...

}
```

<hr>

## 이미지 상세 보기 모달 관련

- 디바이스 가로 길이가 768px 이하인 경우, 모달의 가로 길이를 디바이스 가로 길이만큼 늘려야 한다.
- `필수` 이미지를 검색한 후 결과로 주어진 이미지를 클릭하면 모달이 뜨는데, 모달 영역 밖을 누르거나 / 키보드의 ESC키를 누르거나 / 모달 우측의 닫기(x) 버튼을 누르면 닫히도록 수정해야 한다.
- 모달에서 고양이의 성격, 태생 정보를 렌더링합니다. 해당 정보는 `/cats/:id` 를 통해 불러와야 한다.
- `추가` 모달 열고 닫기에 fade In/out을 적용해라.

> 우선 모달의 구조를 다음과 같이 변경하겠습니다.

```js
// src > components > ImageInfo.js
class ImageInfo {

  ...

  render() {
    if (this.data.visible) {
      const { name, url, temperament, origin } = this.data.image;

      this.$imageInfo.innerHTML = `
          <div class="content-wrapper">
            <header class="title">
              <h1>${name}</h1>
              <button class="close">x</button>
            </header>
            <figure>
              <img src="${url}" alt="${name}"/>
            </figure>
            <footer class="description">
            ${
              error
                ? error
                : `<p>성격: ${temperament ?? '로딩중...'}</p>
                <p>태생: ${origin ?? '로딩중...'}</p>`
            }

            </footer>
          </div>`;

      this.$imageInfo.style.display = 'block';
    } else {
      this.$imageInfo.style.display = 'none';
    }
  }
}
```

> 그리고 css를 다음과 같이 변경하겠습니다.

```css
/* src > style.css */
.ImageInfo {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.ImageInfo .title {
  display: flex;
  justify-content: space-between;
}

.ImageInfo .title,
.ImageInfo .description {
  padding: 5px;
}

.ImageInfo .content-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg);
  border: 1px solid var(--font);
  border-radius: 5px;

  height: 90%;

  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .ImageInfo .content-wrapper {
    height: 100%;
    width: 100%;
  }
}

.ImageInfo .content-wrapper figure {
  flex-grow: 1;
  height: 80%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.ImageInfo .content-wrapper img {
  object-fit: contain;
  max-height: 100%;
  max-width: 100%;
}
```

> `.ImageInfo` 요소의 width과 height를 100%로 변경한 이유는 100v값을 사용하면 스크롤바의 크기만큼 오른쪽 화면이 잘리기 때문에 %값을 사용하였습니다.

> 모달을 닫는 방법을 1. 모달 밖 클릭 / 2. 키보드 ESC키 사용 / 3. x버튼 클릭. 총 3가지로 변경해야 된다고 합니다. 클릭이벤트와 키다운이벤트를 추가하도록 합시다.

```js
// src > components > ImageInfo.js
class ImageInfo {

  ...

  constructor({ $target, data, controllerAbort }) {
    const $imageInfo = document.createElement('article');
    $imageInfo.className = 'ImageInfo';
    this.$imageInfo = $imageInfo;
    this.$imageInfo.style.display = 'none';
    $target.appendChild($imageInfo);

    this.data = data;

    this.$imageInfo.addEventListener('click', (e) => {
      if (e.target.matches('.ImageInfo') || e.target.matches('.close')) {
        this.setState({ visible: false, image: null });
        controllerAbort();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.data.visible) return;
        this.setState({ visible: false, image: null });
        controllerAbort();
      }
    });
  }

  ...

}
```

> 이제 특정 고양이에 대한 정보를 가져와 봅시다. `api.js`로 이동합니다. `api.js` 파일에 관한 자세한 내용은 [코드 구조 관련](#코드-구조-관련) 에 있습니다.

```js
// src > api > api.js
const API_ENDPOINT = ...;

const request = async (url, controller = null) => {...};

export const api = {
  fetchCats: async (keyword) =>
    request(`${API_ENDPOINT}/api/cats/search?q=${keyword}`),
  fetchCat: async (id, controller) =>
    request(`${API_ENDPOINT}/api/cats/${id}`, controller),
};
```

> fetchCat 함수를 추가해 특정 고양이의 데이터를 가져옵니다. 그리고 `controller` 를 사용해 사용자가 특정 고양이의 정보를 요청중에 모달창을 닫을시 그 요청을 취소하는 기능을 추가하였습니다. 다음 `App.js` 파일로 이동합니다.

```js
// src > App.js

...

class App {
  constructor($target) {

    ...

    this.controller;

    ...

    this.searchResult = new SearchResult({
      $target,
      initialData: this.data,
      onClick: async (image) => {
        this.imageInfo.setState({
          visible: true,
          image,
        });
        this.controllerChange();

        const { data } = await api.fetchCat(image.id, this.controller);

        if (typeof data === 'string') { // fetch에러가 발생했을때 data에 에러 메시지가 들어있다
          this.imageInfo.setState({
            visible: true,
            image: {
              ...image,
              error: data,
            },
          });
        } else {
          this.imageInfo.setState({
            visible: true,
            image: {
              ...image,
              temperament: data.temperament,
              origin: data.origin,
            },
          });
        }
      },
    });

    this.imageInfo = new ImageInfo({
      $target,
      data: {
        visible: false,
        image: null,
      },
      controllerAbort: this.controllerAbort,
    });
  }

  controllerChange = () => {
    console.log('controllerChange');
    this.controller = new AbortController();
  };

  controllerAbort = () => {
    console.log('controllerAbort');
    if (this.controller) this.controller.abort();
  };

  ...

}
```

> `SearchResult` 컴포넌트의 `onClick` 함수를 수정하겠습니다. 먼저 컨트롤러를 새로 생성하는 `controllerChange` 함수를 실행 해줍니다. 그런다음 `api.fetchCat` 함수에 특정 고양이의 id와 요청취소를 위한 컨트롤러를 인자값으로 주겠습니다. 요청이 정상적으로 오면 `imageInfo` 컴포넌트에 temperament, origin 값만 추가해서 넘겨주겠습니다.
>
> 그리고 컨트롤러 부분, `this.controller` 를 선언해 컨트롤러 인스턴스를 저장하겠습니다. 매 요청시 컨트롤러는 1회성으로 동작합니다. 때문에 각각의 새 요청을 보낼때 마다 새로운 컨트롤러가 필요합니다. 컨트롤러를 변경시켜줄 `controllerChange` 함수를 생성합니다. 다음 모달창이 닫히는 순간 요청을 취소하는 `controllerAbort` 함수를 생성합니다. `ImageInfo` 컴포넌트에 `controllerAbort` 함수를 넘겨서 필요한 순간 요청을 취소하도록 하겠습니다.

> 모달을 열고 닫을때 애니메이션을 추가 해보도록 하겠습니다. `style.css` 로 이동합니다.

```css
/* src > style.css */
.fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeOut {
  animation: fadeOut 0.5s ease-in-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

> fadeIn, fadeOut 클래스와 애니메이션을 작성합니다. 그리고 `ImageInfo.js` 로 이동합니다.

```js
// src > components > ImageInfo.js
class ImageInfo {

  ...

  fadeIn($target) {
    $target.classList.remove('fadeOut');
    $target.classList.add('fadeIn');
  }

  async fadeOut($target) {
    $target.classList.remove('fadeIn');
    $target.classList.add('fadeOut');
    await new Promise((resolve) =>
      setTimeout(() => {
        $target.classList.remove('fadeOut');
        resolve();
      }, 500)
    );
  }

  async render() {
    if (this.data.visible) {

      ...

      this.$imageInfo.innerHTML = `...`;

      this.$imageInfo.style.display = 'block';
      this.fadeIn(this.$imageInfo);
    } else {
      await this.fadeOut(this.$imageInfo);
      this.$imageInfo.style.display = 'none';
    }
  }
}
```

> fadeIn 클래스를 추가하고 fadeOut 클래스를 제거하는 `fadeIn` 함수를 작성하고 display가 block이 된 후 실행해줍니다.
>
> fadeOut 함수는 fadeIn함수와 반대로 작동합니다. 애니메이션은 500ms동안 동작하기 때문에 display가 none이 되기전 500ms를 기다려 줘야 합니다. promise를 만들어 500ms를 기다려 주도록 합시다.

<hr>

## 검색 페이지 관련

- 페이지 진입 시 포커스가 `input` 에 가도록 처리, 키워드가 입력된 상태에서 `input` 을 클릭할 시 기존 입력값을 삭제.
- `필수` 데이터를 불러오는 중일 때, Loading을 UI로 표기해야함.
- `필수` 검색 결과가 없는 경우, 유저가 불편함을 느끼지 않도록 UI 표기.
- 최근 검색 키워드를 `SearchInput` 아래에 표시되도록 만들고, 해당 키워드를 클릭하면 검색이 일어나게 만들어야함. 최근 검색 키워드는 5개만 노출.
- 페이지를 새로고침해도 마지막 검색 결과 화면이 유지되도록 처리.
- `필수` SearchInput 옆에 버튼을 하나 배치하고, 이 버튼을 클릭할 시 `/api/cats/random50` 을 호출하여 화면에 뿌리는 기능을 추가.
- lazy load 개념을 이용하여, 이미지가 화면에 보여야 할 시점에 load 되도록 처리.
- `추가` 검색 결과 각 아이템에 마우스 호버시 고양이 이름을 노출.

> input 에 포커스를 하는 방법은 focus() 매서드를 사용하면 되겠습니다. 그리고 클릭 이벤트를 추가해 입력값이 있을 시 input 의 value 를 '' 빈문자열로 바꿔주면 됩니다.

```js
// src > components > SearchInput.js
const TEMPLATE = '<input type="text">';

class SearchInput {
  constructor({ $target, onSearch }) {
    this.$searchInput = document.createElement('input');
    this.$searchInput.placeholder = '고양이를 검색해보세요.|';

    this.$searchInput.className = 'SearchInput';
    $target.appendChild(this.$searchInput);
    this.$searchInput.focus();

    this.$searchInput.addEventListener('keyup', (e) => {
      if (e.keyCode === 13 && e.target.value.trim().length > 0) {
        onSearch(e.target.value);
      }
    });
    this.$searchInput.addEventListener('click', (e) => {
      if (e.target.value.length > 0) this.$searchInput.value = '';
    });

    console.log('SearchInput created.', this);
  }
  render() {}
}
```

> Loading 표기를 위한 Loading.js 컴포넌트를 생성 하겠습니다.

```js
// src > components > Loading.js
class Loading {
  constructor({ $target }) {
    this.$target = $target;
  }

  render() {
    this.$target.innerHTML = `
    <article class='loading'>
        <h1>로딩중<span>.</span><span>.</span><span>.</span></h1>
    </article>
    `;
  }
}
```

> 그리고 키워드 검색 시 Loading 컴포넌트를 render 하겠습니다.

```js
// src > App.js
...

class App {
  constructor($target) {

    ...

    this.searchInput = new SearchInput({
      $target: inputSection,
      onSearch: async (keyword) => {
        this.recentSearched.setState(keyword);
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    this.searchResult = new SearchResult({
      ...
    });

    ...

    this.loading = new Loading({ $target: this.searchResult.$searchResult });

    ...

  }

  ...

}
```

> 만약 검색 결과가 없는 경우, 받아오는 데이터는 [] 빈 배열로 받아오게 됩니다. 받아오는 데이터가 빈배열일 경우를 처리하겠습니다. 또 데이터를 받아오다가 오류가 발생했을때 `data.fetchCats` 에는 에러 문자열이 들어오게 됩니다. 이것도 처리해 주겠습니다.

```js
// src > components > SearchResult.js
class SearchResult {

  ...

  render() {
    if (this.data.fetchCats == null) return;

    if (this.data.fetchCats.length > 0 && Array.isArray(this.data.fetchCats)) {
      //데이터 있는 배열
      this.$searchResult.innerHTML = this.data.fetchCats
        .map(
          (cat) => `
            <figure class="item">
              <img class='lazy' data-src=${cat.url} alt=${cat.name} />
            </figure>
          `
        )
        .join('');
      this.lazyloading();
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
```

> 최근 검색 키워드를 표기하기위해 `RecentSearched.js` 컴포넌트를 만들겠습니다.

```js
// src > components > RecentSearched.js
const MAX_DISPLAY_COUNT = 5;

class RecentSearched {
  constructor({ $target, onSearch }) {
    this.$target = $target;
    this.onSearch = onSearch;
    this.state = [];
    this.$ul = document.createElement('ul');
    this.$ul.setAttribute('class', 'recentSearched');
    this.$target.appendChild(this.$ul);

    this.$ul.addEventListener('click', (e) => {
      if (e.target.matches('button')) {
        onSearch(e.target.textContent);
      }
    });

    this.render();
  }

  setState = (keyword) => {
    // 이미 존재하는 검색 기록을 맨뒤로 이동시키기 위함
    const nextRecentSearched = [...this.state];
    const index = nextRecentSearched.findIndex(
      (recentSearched) => recentSearched === keyword
    );

    if (index > -1) {
      nextRecentSearched.splice(index, 1);
    }
    nextRecentSearched.push(keyword);

    this.state = nextRecentSearched;

    if (this.state.length > MAX_DISPLAY_COUNT) {
      const startPosition = this.state.length - MAX_DISPLAY_COUNT;
      this.state = this.state.slice(startPosition);
    }
    this.render();
  };

  render() {
    this.$ul.innerHTML = this.state
      .map(
        (item) => `
    <li><button>${item}</button></li>
    `
      )
      .join('');
  }
}
```

> 이걸 App.js 컴포넌트에서 사용하도록 하겠습니다. input박스 아래에 생성해야 함으로 `SearchInput` 컴포넌트 아래에서 실행하도록 하겠습니다.

```js
// src > App.js

...

class App {
  constructor($target) {

    ...

    this.searchInput = new SearchInput({
      $target: inputSection,
      onSearch: async (keyword) => {
        this.recentSearched.setState(keyword);
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    this.recentSearched = new RecentSearched({
      $target,
      onSearch: async (keyword) => {
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    ...

  }

  ...

}
```

> 페이지를 새로고침해도 마지막 검색 결과가 유지될려면 검색 결과를 저장하고 있어야 합니다. 로컬 스토리지에 저장해 봅시다. 저장을 위한 `storage.js` 파일을 생성하겠습니다.

```js
// src > utils > storage.js
export const setSearchResult = (result) => {
  localStorage.setItem('searchResult', JSON.stringify(result));
};

export const removeSearchResult = () => {
  localStorage.removeItem('searchResult');
};

export const getSearchResult = () => {
  return JSON.parse(localStorage.getItem('searchResult'));
};
```

> 이제 `App.js` 에서 저 함수들을 사용해봅시다.

```js
// src > App.js

...

import {
  getSearchResult,
  removeSearchResult,
  setSearchResult,
} from './utils/storage';

class App {
  constructor($target) {
    this.$target = $target;
    this.data = getSearchResult() ?? {
      fetchCats: null,
      fetchRandom: null,
      keyword: null,
    };
    removeSearchResult();

    ...

  }

  ...

  setState(nextData) {
    console.log(this);
    this.data = { ...this.data, ...nextData };
    this.searchResult.setState({ ...this.data, ...nextData });
    this.randomBanner.setState({ ...this.data, ...nextData });
    setSearchResult({ ...this.data, ...nextData });
  }
}
```

> 앱 시작시 로컬스토리지에 데이터가 있으면 그걸 사용합니다. 전 로컬스토리지 데이터를 1회성으로 사용하겠습니다. 데이터를 가져온 뒤 로컬스토리지에서 데이터를 삭제하겠습니다. 데이터가 변경될 때마다 저장될 수 있도록 `setState` 함수 안에서 사용하겠습니다.

> `SearchInput` 옆에 버튼을 생성하고 랜덤한50개의 데이터를 가져와야합니다. 버튼을 만들어 봅시다.

```js
// src > components > Random50Btn.js
class Random50Btn {
  constructor({ $target, onClick }) {
    this.button = document.createElement('button');
    this.button.setAttribute('class', 'random50');
    this.button.textContent = 'Random 50';

    $target.appendChild(this.button);

    this.button.addEventListener('click', () => {
      onClick();
    });
  }
}
```

> `App.js` 에서 사용하겠습니다.

```js
// src > App.js

...

class App {
  constructor($target) {

    ...

    const inputSection = document.createElement('section');
    inputSection.setAttribute('class', 'inputSection');
    this.$target.appendChild(inputSection);

    this.random50Btn = new Random50Btn({
      $target: inputSection,
      onClick: async () => {
        const { data } = await api.fetchRandom50();
        this.setState({ fetchRandom: data });
      },
    });

    this.searchInput = new SearchInput({
      $target: inputSection,
      onSearch: async (keyword) => {
        this.recentSearched.setState(keyword);
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    ...

  }

  ...

}
```

> 랜덤 버튼과 input 박스는 같은 줄에 존재해야 합니다. 랜덤버튼과 input박스를 감싸줄 `inputSection` 을 만들어 줍니다. `inputSection` 안에 랜덤버튼과 input을 넣어줍니다. 랜덤버튼의 `onClick` 함수에는 랜덤한 50개의 데이터를 가져오는 fetch함수를 사용해줍니다.

```js
// src > api > api.js

...

const request = async (url, controller = null) => {
  ...
};

export const api = {
  fetchRandom50: async () => request(`${API_ENDPOINT}/api/cats/random50`),
  fetchCats: async (keyword) =>
    request(`${API_ENDPOINT}/api/cats/search?q=${keyword}`),
  fetchCat: async (id, controller) =>
    request(`${API_ENDPOINT}/api/cats/${id}`, controller),
};
```

> `api.js` 에 랜덤한 50개의 데이터를 가져오는 요청을 추가합니다. request 함수에 대한 내용은 [코드 구조 관련](#코드-구조-관련) 에 있습니다.

> lazy loading을 구현하는데는 다양한 방법이 있습니다. 전 Intersection Observer API 를 사용해 구현해보도록 하겠습니다. utils 에 `lazyloading.js` 파일을 추가하겠습니다.

```js
// src > utils > lazylosding.js
export const lazyloading = () => {
  const lazyloadImages = document.querySelectorAll('.lazy');

  const imageObserver = new IntersectionObserver(
    (entries, observe) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove('lazy');
          observe.unobserve(image);
        }
      });
    },
    { rootMargin: '500px 0px 500px 0px', threshold: 0 }
  );

  lazyloadImages.forEach((image) => imageObserver.observe(image));
};
```

> lazy 클래스를 가지고 있는 모든 요소를 가져와서 해당 요소가 사용자 뷰포트에 들어오면 data-src 에 있던 src 값을 src 에 할당하고 lazy 클래스를 제거 합니다. 그리고 관찰도 제거합니다.

> 다음 `SearchResult.js` 파일에서 사용하겠습니다.

```js
// src > components > SearchResult.js
import { lazyloading } from '../utils/lazyloading';

...

class SearchResult {

  ...

  render() {
    if (this.data.fetchCats == null) return;

    if (this.data.fetchCats.length > 0 && Array.isArray(this.data.fetchCats)) {
      //데이터 있는 배열
      this.$searchResult.innerHTML = this.data.fetchCats
        .map(
          (cat) => `
            <figure class="item">
              <img class='lazy' data-src=${cat.url} alt=${cat.name} />
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
```

> img 태크에 lazy 클래스를 추가하고 src 값을 삭제한 다음 data-src 에 src 값을 넣어 줍니다. html 렌더링이 끝나면 lazyloading 함수를 실행시켜 요소들을 관찰 하도록 합니다. 개발자 탭에서 네트워크로 들어가면 lazyloading을 확인할 수 있습니다.

> 추가 사항으로 이미지에 마우스를 올리면 고양이 이름이 나오도록 하는 것이 있습니다.

```js
// src > components > SearchResult.js

...

class SearchResult {
  constructor({ $target, initialData, onClick, scrollSearch }) {

    ...

  }

  ...

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
    } ...
  }
}
```

> 간단하게 figcaption 태그를 추가하고 고양이 이름을 넣겠습니다.

```css
/* src > style.css */
.SearchResult .item {
  position: relative;
  background-color: #808080;
  margin: 0 0 1em;
  height: 100%;
  width: 100%;

  aspect-ratio: 1/1.1;
}

.SearchResult figcaption {
  position: absolute;
  bottom: 0;
  width: 100%;

  background-color: var(--bg);

  font-size: 1.5rem;

  visibility: hidden;
}

.SearchResult .item:hover figcaption {
  visibility: visible;
}
```

> css는 다음과 같이 작성하면 마우스를 올릴때 이름이 나타나게 됩니다.

<hr>

## 스크롤 페이징 구현

- 검색 결과 화면에서 유저가 브라우저 스크롤 바를 끝까지 이동시켰을 경우, 그 다음 페이지를 로딩하도록 만들어야 한다.

> `App.js` 에서 스크롤에 대한 요청을 `SearchResult.js` 컴포넌트에 넘겨줍니다. `scrollSearch` 이름으로 넘겨주었습니다. 기존 데이터에 추가하는 방식으로 만들었습니다.

```js
// src > App.js

...

class App {
  constructor($target) {

    ...

    this.searchResult = new SearchResult({
      $target,
      initialData: this.data,
      onClick: async (image) => {
        this.imageInfo.setState({
          visible: true,
          image,
        });
        this.controllerChange();

        const { data } = await api.fetchCat(image.id, this.controller);

        if (typeof data === 'string') {
          this.imageInfo.setState({
            visible: true,
            image: {
              ...image,
              error: data,
            },
          });
        } else {
          this.imageInfo.setState({
            visible: true,
            image: {
              ...image,
              temperament: data.temperament,
              origin: data.origin,
            },
          });
        }
      },
      scrollSearch: async () => {
        const { data } = await api.fetchCats(this.data.keyword);
        this.setState({ fetchCats: this.data.fetchCats.concat(data) });
      },
    });

    ...

  }

 ...

}
```

> 그리고 `SearchResult.js` 에서 사용하겠습니다.

```js
// src > components > SearchResult.js

...

class SearchResult {
  constructor({ $target, initialData, onClick, scrollSearch }) {

    ...

    this.scrollSearch = scrollSearch;

    ...

  }

  ...

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
    } ...
  }
}
```

> 마지막 고양이 사진이 뷰포트로 들어오면 `scrollSearch` 함수가 실행되게 하였습니다. `scrollFetch` 함수는 다음과 같습니다.

```js
// src > utils > scrollFetch.js
export const scrollFetch = (scrollSearch) => {
  const lastChild = document.querySelector('.SearchResult').lastElementChild;

  if (lastChild.matches('.item')) {
    const lastChildObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            console.log('fetch scroll');
            scrollSearch();
          }
        });
      },
      { rootMargin: '0px 0px 1200px 0px', threshold: 0 }
    );

    lastChildObserver.observe(lastChild);
  }
};
```

> 함수가 실행될때마다 마지막 고양이 사진을 찾고 그 고양이 사진을 관찰하면서 뷰포트로 들어오면 `scrollSearch` 함수를 실행시킵니다. fetch의 딜레이가 좀 있기때문에 rootMargin값을 주어서 뷰포트에서 1200px떨어진 상태에서 미리 요청을 하도록 만들었습니다.

<hr>

## 랜덤 고양이 배너 섹션 추가

- 현재 검색 결과 목록 위에 배너 형태의 랜덤 고양이 섹션을 추가.
- 앱이 구동될 때 '/api/cats/random50' api를 요청하여 받는 결과를 별도의 섹션에 노출.
- 검색 결과가 많더라도 화면에 5개만 노출하여 각 이미지는 좌, 우 슬라이드 이동 버튼을 갖는다.
- 좌, 우 버튼을 클릭하면, 현재 노출된 이미지는 사라지고 이전 또는 다음 이미지를 보여준다.(트렌지션은 선택)

> 배너 형태로 랜덤 고양이 섹션을 추가해보도록 하겠습니다. 위치는 검색 결과 위에 표기해야함으로 SearchResult 컴포넌트 위에서 호출하도록 하겠습니다.

```js
// src > App.js

...

class App {
  constructor($target) {

    ...

    this.recentSearched = new RecentSearched({
      ...
    });

    this.randomBanner = new RandomBanner({
      $target,
      initialData: this.data,
    });

    this.searchResult = new SearchResult({
      ...
    });

    ...

  }

  ...
}
```

> 남은 3가지 구현사항을 코드를 보면서 설명하겠습니다.

```js
// src > components > RandomBanner.js

class RandomBanner {
  constructor({ $target, initialData }) {
    this.$target = $target;
    this.data = initialData;
    this.runAnimate = false;
    this.$randomBannder = document.createElement('section');
    this.$randomBannder.setAttribute('class', 'randomBanner');

    this.$target.appendChild(this.$randomBannder);

    this.autoPlayClick = autoPlay(this.onHandleClick, 2500);

    // 핸들을 위한 이벤트
    this.$randomBannder.addEventListener('click', (e) => {
      let $handle;
      if (e.target.matches('.handle')) $handle = e.target;
      else $handle = e.target.closest('.handle');

      if ($handle !== null) this.onHandleClick($handle);
    });

    // 클론이미지를 본래이미지로 페이지 변경할때 애니메이션이 끝나고 실행하기 위함
    this.$randomBannder.addEventListener('transitionend', (e) => {
      if (e.target.matches('.slider')) {
        const progressBar = e.target
          .closest('.randomBanner')
          .querySelector('.progress-bar');
        const slider = e.target;
        const sliderIndex = parseInt(
          getComputedStyle(slider).getPropertyValue('--slider-index')
        );
        if (sliderIndex === 0) {
          flipSliderToIndex(progressBar.children.length, slider);
        } else if (sliderIndex === progressBar.children.length + 1) {
          flipSliderToIndex(1, slider);
        }
        this.runAnimate = false;
      }
    });

    // 화면 사이즈 변화에 따라 진행바의 개수와 클론이미지의 개수를 생성함
    window.addEventListener(
      'resize',
      throttle(() => {
        this.calculateProgressBar();

        this.createSliderCloneItem();
      }, 250)
    );

    this.render();
  }

  // 진행바 생성 함수
  calculateProgressBar = () => {
    const progressBar = this.$randomBannder.querySelector('.progress-bar');
    if (!progressBar) return;
    progressBar.innerHTML = '';
    const slider = progressBar
      .closest('.randomBanner')
      .querySelector('.slider');
    // slider 엘리먼트가 가지고 있는 css 의 '--slider-index' value 값을 가져온다.
    let sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue('--slider-index')
    );

    // 클론이 앞뒤로 있기 때문에 -2를 한다.
    const itemCount = slider.children.length - 2;
    // slider 엘리먼트가 가지고 있는 css 의 '--items-per-screen' value 값을 가져온다.
    const itemsPerScreen = parseInt(
      getComputedStyle(slider).getPropertyValue('--items-per-screen')
    );

    const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen);
    // 화면사이즈가 변할 때 진행바 개수도 바뀌기 때문에 페이지 번호가 진행바 개수를 초과하면 마지막 페이지 번호로 변환
    if (sliderIndex > progressBarItemCount) {
      slider.style.setProperty('--slider-index', progressBarItemCount);
    }
    // 페이지 번호인 sliderIndex 가 1부터 시작함으로 시작 index를 1로 한다.
    for (let index = 1; index <= progressBarItemCount; index++) {
      const barItem = document.createElement('div');
      barItem.setAttribute('class', 'progress-item');
      if (index === sliderIndex) barItem.classList.add('active');
      progressBar.appendChild(barItem);
    }
  };

  onHandleClick = ($handle) => {
    if (this.runAnimate) return;
    this.runAnimate = true;

    const progressBar = $handle
      .closest('.randomBanner')
      .querySelector('.progress-bar');
    const slider = $handle.closest('.randomContainer').querySelector('.slider');
    slider.style.setProperty('transition', 'transform 250ms ease-in-out');
    const sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue('--slider-index')
    );
    // 왼쪽 핸들 클릭
    if ($handle.classList.contains('left-handle')) {
      slider.style.setProperty('--slider-index', sliderIndex - 1);
      // 1페이지일 경우 맨 마지막 페이지로
      if (sliderIndex === 1) {
        progressBar.children[sliderIndex - 1]?.classList.remove('active');
        progressBar.children[progressBar.children.length - 1]?.classList.add(
          'active'
        );
      }

      progressBar.children[sliderIndex - 1]?.classList.remove('active');
      progressBar.children[sliderIndex - 2]?.classList.add('active');
    }
    // 오른쪽 핸들 클릭
    if ($handle.classList.contains('right-handle')) {
      slider.style.setProperty('--slider-index', sliderIndex + 1);
      // 맨 마지막 페이지일 경우 1페이지로
      if (sliderIndex === progressBar.children.length) {
        progressBar.children[sliderIndex - 1]?.classList.remove('active');
        progressBar.children[0].classList.add('active');
      }

      progressBar.children[sliderIndex - 1]?.classList.remove('active');
      progressBar.children[sliderIndex]?.classList.add('active');
    }
  };

  // 고양이 이미지의 처음과 마지막에 들어갈 클론아이템 생성 함수
  createSliderCloneItem = () => {
    const slider = this.$randomBannder.querySelector('.slider');
    if (!slider) return;
    const firstClone = slider.querySelector('.first-clone');
    const lastClone = slider.querySelector('.last-clone');
    const itemPerScreen = parseInt(
      getComputedStyle(slider).getPropertyValue('--items-per-screen')
    );

    firstClone.innerHTML = '';
    lastClone.innerHTML = '';
    // 현재 보여지는 이미지 개수만큼 클론 생성
    for (let index = 0; index < itemPerScreen; index++) {
      // first clone 생성
      const firstImg = document.createElement('img');
      firstImg.src = this.data.fetchRandom.at(-itemPerScreen + index).url;
      firstImg.index = -itemPerScreen + index;
      firstClone.append(firstImg);
      // last clone 생성
      const lastImg = document.createElement('img');
      lastImg.src = this.data.fetchRandom.at(index).url;
      lastImg.index = index;
      lastClone.append(lastImg);
    }
  };

  setState(nextState) {
    this.data = nextState;
    this.render();
  }

  render() {
    if (!this.data.fetchRandom) return;
    this.$randomBannder.innerHTML = `
      <div class='progress-bar'>
      </div>

      <article class='randomContainer' >
        <button class='handle left-handle'><span class='text'>&#10094;</span></button>

        <div class='slider'>
          <div class='clone first-clone'>
          </div>
            ${this.data.fetchRandom
              .map(
                (image, index) => `
            <img src=${image.url} index='${index}' />
            `
              )
              .join('')}
          <div class='clone last-clone'>
          </div>
        </div>

        <button class='handle right-handle'><span class='text'>&#10095;</span></button>
      </article>
      `;
    this.calculateProgressBar();
    this.createSliderCloneItem();
    // this.autoPlayClick(document.querySelector('.right-handle'));
  }
}

export default RandomBanner;

// resize 이벤트 함수실행에 최적화를 위한 스로틀 함수
function throttle(cb, delay = 1000) {
  let shouldWait = false;
  let waitingArgs;
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delay);
    }
  };

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    cb(...args);
    shouldWait = true;
    setTimeout(timeoutFunc, delay);
  };
}
// 클론 이미지에서 실제 이미지로 이동하는 함수
function flipSliderToIndex(index, slider) {
  slider.style.setProperty('transition', 'none');
  slider.style.setProperty('--slider-index', index);
}

// delay시간만큼 핸들클릭함수를 실행해 자동이동을 실행할 수 있는 함수
function autoPlay(cb, delay = 1000) {
  let intervalId;

  return (...arg) => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      cb(...arg);
    }, delay);
  };
}
```

> 배너컴포넌트에는
>
> 1. 랜덤 고양이 보여주는 기능
> 2. 좌우 슬라이드 이동 버튼
> 3. 현재 슬라이드 페이지를 보여주는 진행바
>
> 크게 3가지 기능이 있습니다.
>
> 부가적으로는
>
> 1. 페이지의 처음과 마지막을 클론한 클론 페이지가 있어 사용자가 연속적인 트렌지션을 볼 수 있는것
> 2. 화면 사이즈가 바뀔때 마다 보여지는 고양이 이미지 수와 페이지 진행바의 수 달라지는것
>
> 2가지 정도가 있습니다.

> 랜덤 배너에 관한 css style은 다음과 같습니다.

```css
/* src > style.css */
.randomBanner {
  --handle-size: 3rem;
  --img-gap: 0.25rem;

  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.progress-bar {
  display: flex;
  gap: 0.2rem;

  background-color: transparent;
  height: 0.25rem;

  margin-left: calc(var(--img-gap) * 2 + var(--handle-size));
  margin-right: calc(var(--img-gap) * 2 + var(--handle-size));
}

.progress-bar .progress-item {
  flex: 0 1 3rem;
  background-color: gray;
}

.progress-bar .progress-item.active {
  background-color: var(--active);
  width: 100%;
}

.randomContainer {
  display: flex;
  justify-content: center;

  overflow: hidden;
}

.randomContainer .slider {
  --slider-index: 1;
  --items-per-screen: 5;

  flex-grow: 1;
  display: flex;
  width: calc(100% - 2 * var(--handle-size));
  margin: 0 var(--img-gap);
  transform: translateX(calc(-100% * var(--slider-index)));
  transition: transform 250ms ease-in-out;

  @media (max-width: 992px) {
    --items-per-screen: 4;
  }
  @media (max-width: 768px) {
    --items-per-screen: 3;
  }
  @media (max-width: 576px) {
    --items-per-screen: 2;
  }
}

.slider .clone {
  flex: 0 0 100%;
  max-width: 100%;

  display: flex;
}

.randomContainer .slider img {
  flex: 0 0;
  max-width: calc(100% / var(--items-per-screen));
  aspect-ratio: 16/9;
  padding: var(--img-gap);
  border-radius: 1rem;
}

.randomContainer .handle {
  outline: none;
  border: none;
  border-radius: 1rem;
  flex: 0 0;
  min-width: var(--handle-size);
  background-color: rgba(var(--handle), 0.25);

  z-index: 10;
  margin: var(--img-gap) 0;

  cursor: pointer;

  transition: background-color 150ms ease-in-out;

  display: flex;
  justify-content: center;
  align-items: center;
}

.handle.left-handle {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.handle.right-handle {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.handle .text {
  visibility: hidden;

  color: #ffffff;
  font-size: var(--handle-size);

  transition: transform 150ms ease-in-out;
}

.randomContainer .handle:hover,
.randomContainer .handle:focus {
  background-color: rgba(var(--handle), 0.5);
}

.randomContainer:hover .text {
  visibility: visible;
}

.handle:hover .text,
.handle:focus .text {
  transform: scale(1.2);
}
```

<hr>

## 코드 구조 관련

- ES6 module 형태로 코드를 변경.
  - `webpack` , `parcel` 과 같은 번들러를 사용하지 마라.
  - 해당 코드 실행을 위해서는 `http-sever` 모듈을 통해 `index.html` 을 띄워야 한다.
- API fetch 코드를 `async` , `await` 문을 이용하여 수정하고, 해당 코드들은 에러가 났을 경우 처리.
- `필수` API 의 status code 에 따라 메시지를 분리.
- SearchResult 에 각 아이템을 클릭하는 이벤트를 Event Delegation 기법으로 수정.
- 컴포넌트 내부의 함수들이나 Util 함수들을 작게 나눠라.

> ES6 module 형태로 바꾸라는 말은 `export/import` 방식을 사용하라는 뜻으로 보입니다.  
> `index.html` 파일을 보면

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="src/style.css" />
    <title>Cat Search</title>
  </head>
  <body>
    <div id="App"></div>
    <script src="src/utils/validator.js"></script>
    <script src="src/api.js"></script>
    <script src="src/ImageInfo.js"></script>
    <script src="src/SearchInput.js"></script>
    <script src="src/SearchResult.js"></script>
    <script src="src/App.js"></script>
    <script src="src/main.js"></script>
  </body>
</html>
```

> 이런식으로 script가 모두 불러와져 있는데 `main.js` 를 진입점으로 남기고 다 삭제하겠습니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link rel="stylesheet" href="src/style.css" />
    <title>Cat Search</title>
  </head>
  <body>
    <div id="App"></div>
    <script src="src/main.js" type="module"></script>
  </body>
</html>
```

> `main.js` 파일로 이동하면

```js
// src > main.js
new App(document.querySelector('#App'));
```

> 위를 아래처럼 변경합니다.

```js
// src > main.js
import App from './App.js';
new App(document.querySelector('#App'));
```

> 다음 `App.js` 로 이동해서 `export default App` 부분을 추가합니다.

```js
// src > App.js
console.log('app is running!');

class App {
  ...
}
// 아래 코드 추가
export default App;
```

> 다른 파일들도 위와 같이 변경해 줍니다.

> `api.js` 파일의 내용을 `async` , `await` 문을 사용하여 수정하고 예시코드를 사용해 코드 분리를 합니다. 그리고 `status code` 에 따라 에러 메시지를 분리 작성합니다.

```js
// src > api > api.js;
const API_ENDPOINT =
  'https://q9d70f82kd.execute-api.ap-northeast-2.amazonaws.com/dev';

const request = async (url, controller = null) => {
  try {
    const result = await fetch(url, { signal: controller?.signal });
    if (result.ok) {
      return result.json();
    } else if (399 < result.status && result.status <= 499) {
      console.warn('요청 과정 오류 발생');
      return {
        data: '요청 과정에서 문제가 발생했습니다. 다시 시도해 주십시오.',
      };
    } else if (499 < result.status && result.status <= 599) {
      console.warn('서버 내부 오류 발생');
      return {
        data: '서버 응답에 문제가 발생했습니다. 다시 시도해 주십시오.',
      };
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn('fetch 중단');
    } else {
      console.warn(e);
      return { data: '서버 요청에 문제가 발생했습니다. 다시 시도해 주십시오.' };
    }
  }
};

const api = {
  fetchCats: (keyword) => {
    return request(`${API_ENDPOINT}/api/cats/search?q=${keyword}`);
  },
};
```

> SearchResult 에 있는 이벤트 등록을 이벤트 위임을 사용하여 처리합니다.

```js
// src > components > SearchResult.js
class SearchResult {
  ...
  render() {
    this.$searchResult.innerHTML = this.data
      .map(
        (cat) => `
          <div class="item">
            <img src=${cat.url} alt=${cat.name} />
          </div>
        `
      )
      .join('');

    this.$searchResult.querySelectorAll('.item').forEach(($item, index) => {
      $item.addEventListener('click', () => {
        this.onClick(this.data[index]);
      });
    });
  }
}
```

> 위를 아래와 같이 변경합니다.

```js
// src > components > SearchResult.js
class SearchResult {
  $searchResult = null;
  data = null;
  onClick = null;

  constructor({ $target, initialData, onClick }) {
    this.$searchResult = document.createElement('div');
    this.$searchResult.className = 'SearchResult';
    $target.appendChild(this.$searchResult);

    this.data = initialData;
    this.onClick = onClick;

    this.$searchResult.addEventListener('click', (e) => {
      e.stopPropagation();
      const $item = e.target.closest('.item');
      if ($item) {
        const index = Array.from(
          this.$searchResult.querySelectorAll('.item')
        ).indexOf($item);
        this.onClick(this.data[index]);
      }
    });

    this.render();
  }

  setState(nextData) {
    ...
  }

  render() {
    ...
  }
}
```
