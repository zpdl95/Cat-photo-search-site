const API_ENDPOINT =
  'https://q9d70f82kd.execute-api.ap-northeast-2.amazonaws.com/dev';

const request = async (url, controller = null) => {
  try {
    const result = await fetch(url, { signal: controller?.signal });
    if (result.ok) {
      return result.json();
    } else if (399 < result.status && result.status <= 499) {
      console.warn('요청 과정 오류 발생');
      return {
        data: '요청 과정에서 문제가 발생했습니다. 다시 시도해 주십시오.',
      };
    } else if (499 < result.status && result.status <= 599) {
      console.warn('서버 내부 오류 발생');
      return {
        data: '서버 응답에 문제가 발생했습니다. 다시 시도해 주십시오.',
      };
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      console.warn('fetch 중단');
    } else {
      console.warn(e);
      return { data: '서버 요청에 문제가 발생했습니다. 다시 시도해 주십시오.' };
    }
  }
};

export const api = {
  fetchRandom50: async () => request(`${API_ENDPOINT}/api/cats/random50`),
  fetchCats: async (keyword) =>
    request(`${API_ENDPOINT}/api/cats/search?q=${keyword}`),
  fetchCat: async (id, controller) =>
    request(`${API_ENDPOINT}/api/cats/${id}`, controller),
};
