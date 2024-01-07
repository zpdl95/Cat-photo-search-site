class ImageInfo {
  $imageInfo = null;
  data = null;

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

  setState(nextData) {
    this.data = nextData;
    this.render();
  }

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
      const { name, url, temperament, origin, error } = this.data.image;

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
      this.fadeIn(this.$imageInfo);
    } else {
      await this.fadeOut(this.$imageInfo);
      this.$imageInfo.style.display = 'none';
    }
  }
}

export default ImageInfo;
