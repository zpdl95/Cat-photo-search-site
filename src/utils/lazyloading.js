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
