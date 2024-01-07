export const setSearchResult = (result) => {
  localStorage.setItem('searchResult', JSON.stringify(result));
};

export const removeSearchResult = () => {
  localStorage.removeItem('searchResult');
};

export const getSearchResult = () => {
  return JSON.parse(localStorage.getItem('searchResult'));
};
