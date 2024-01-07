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

export default RecentSearched;
