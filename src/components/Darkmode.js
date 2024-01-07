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
