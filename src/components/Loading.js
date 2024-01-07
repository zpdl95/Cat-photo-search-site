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

export default Loading;
