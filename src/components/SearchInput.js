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

export default SearchInput;
