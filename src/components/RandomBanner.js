class RandomBanner {
  constructor({ $target, initialData }) {
    this.$target = $target;
    this.data = initialData;
    this.runAnimate = false;
    this.$randomBannder = document.createElement('section');
    this.$randomBannder.setAttribute('class', 'randomBanner');

    this.$target.appendChild(this.$randomBannder);

    this.autoPlayClick = autoPlay(this.onHandleClick, 2500);

    this.$randomBannder.addEventListener('click', (e) => {
      let $handle;
      if (e.target.matches('.handle')) $handle = e.target;
      else $handle = e.target.closest('.handle');

      if ($handle !== null) this.onHandleClick($handle);
    });

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

    window.addEventListener(
      'resize',
      throttle(() => {
        this.calculateProgressBar();

        this.createSliderCloneItem();
      }, 250)
    );

    this.render();
  }

  calculateProgressBar = () => {
    const progressBar = this.$randomBannder.querySelector('.progress-bar');
    if (!progressBar) return;
    progressBar.innerHTML = '';
    const slider = progressBar
      .closest('.randomBanner')
      .querySelector('.slider');
    let sliderIndex = parseInt(
      getComputedStyle(slider).getPropertyValue('--slider-index')
    );
    const itemCount = slider.children.length - 2;
    const itemsPerScreen = parseInt(
      getComputedStyle(slider).getPropertyValue('--items-per-screen')
    );

    const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen);

    if (sliderIndex > progressBarItemCount) {
      slider.style.setProperty('--slider-index', progressBarItemCount);
    }

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

    if ($handle.classList.contains('left-handle')) {
      slider.style.setProperty('--slider-index', sliderIndex - 1);

      if (sliderIndex === 1) {
        progressBar.children[sliderIndex - 1]?.classList.remove('active');
        progressBar.children[progressBar.children.length - 1]?.classList.add(
          'active'
        );
      }

      progressBar.children[sliderIndex - 1]?.classList.remove('active');
      progressBar.children[sliderIndex - 2]?.classList.add('active');
    }
    if ($handle.classList.contains('right-handle')) {
      slider.style.setProperty('--slider-index', sliderIndex + 1);

      if (sliderIndex === progressBar.children.length) {
        progressBar.children[sliderIndex - 1]?.classList.remove('active');
        progressBar.children[0].classList.add('active');
      }

      progressBar.children[sliderIndex - 1]?.classList.remove('active');
      progressBar.children[sliderIndex]?.classList.add('active');
    }
  };

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

function flipSliderToIndex(index, slider) {
  slider.style.setProperty('transition', 'none');
  slider.style.setProperty('--slider-index', index);
}

function autoPlay(cb, delay = 1000) {
  let intervalId;

  return (...arg) => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      cb(...arg);
    }, delay);
  };
}
