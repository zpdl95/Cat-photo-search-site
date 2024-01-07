class Random50Btn {
  constructor({ $target, onClick }) {
    this.button = document.createElement('button');
    this.button.setAttribute('class', 'random50');
    this.button.textContent = 'Random 50';

    $target.appendChild(this.button);

    onClick();

    this.button.addEventListener('click', () => {
      onClick();
    });
  }
}

export default Random50Btn;
