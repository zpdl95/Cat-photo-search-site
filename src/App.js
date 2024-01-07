import SearchInput from './components/SearchInput';
import SearchResult from './components/SearchResult';
import ImageInfo from './components/ImageInfo';
import Loading from './components/Loading';
import RecentSearched from './components/RecentSearched';
import { api } from './api/api';
import {
  getSearchResult,
  removeSearchResult,
  setSearchResult,
} from './utils/storage';
import Random50Btn from './components/Random50Btn';
import Darkmode from './components/Darkmode';
import RandomBanner from './components/RandomBanner';

console.log('app is running!');

class App {
  constructor($target) {
    this.$target = $target;
    this.data = getSearchResult() ?? {
      fetchCats: null,
      fetchRandom: null,
      keyword: null,
    };
    removeSearchResult();

    this.controller;

    this.darkmode = new Darkmode({ $target });

    const inputSection = document.createElement('section');
    inputSection.setAttribute('class', 'inputSection');
    this.$target.appendChild(inputSection);

    this.random50Btn = new Random50Btn({
      $target: inputSection,
      onClick: async () => {
        const { data } = await api.fetchRandom50();
        this.setState({ fetchRandom: data });
      },
    });

    this.searchInput = new SearchInput({
      $target: inputSection,
      onSearch: async (keyword) => {
        this.recentSearched.setState(keyword);
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    this.recentSearched = new RecentSearched({
      $target,
      onSearch: async (keyword) => {
        this.loading.render();

        const { data } = await api.fetchCats(keyword);
        this.setState({ fetchCats: data, keyword });
      },
    });

    this.randomBanner = new RandomBanner({
      $target,
      initialData: this.data,
    });

    this.searchResult = new SearchResult({
      $target,
      initialData: this.data,
      onClick: async (image) => {
        this.imageInfo.setState({
          visible: true,
          image,
        });
        this.controllerChange();

        const { data } = await api.fetchCat(image.id, this.controller);

        if (typeof data === 'string') {
          this.imageInfo.setState({
            visible: true,
            image: {
              ...image,
              error: data,
            },
          });
        } else {
          this.imageInfo.setState({
            visible: true,
            image: {
              ...image,
              temperament: data.temperament,
              origin: data.origin,
            },
          });
        }
      },
      scrollSearch: async () => {
        const { data } = await api.fetchCats(this.data.keyword);
        this.setState({ fetchCats: this.data.fetchCats.concat(data) });
      },
    });

    this.imageInfo = new ImageInfo({
      $target,
      data: {
        visible: false,
        image: null,
      },
      controllerAbort: this.controllerAbort,
    });

    this.loading = new Loading({ $target: this.searchResult.$searchResult });
  }

  controllerChange = () => {
    console.log('controllerChange');
    this.controller = new AbortController();
  };

  controllerAbort = () => {
    console.log('controllerAbort');
    if (this.controller) this.controller.abort();
  };

  setState(nextData) {
    console.log(this);
    this.data = { ...this.data, ...nextData };
    this.searchResult.setState({ ...this.data, ...nextData });
    this.randomBanner.setState({ ...this.data, ...nextData });
    setSearchResult({ ...this.data, ...nextData });
  }
}

export default App;
