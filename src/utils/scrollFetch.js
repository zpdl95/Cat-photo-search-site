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
