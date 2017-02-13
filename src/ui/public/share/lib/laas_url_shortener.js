import chrome from 'ui/chrome';
import url from 'url';

export default function createUrlShortener(Notifier, $http, $location) {
  const notify = new Notifier({
    location: 'Url Shortener'
  });

  function shortenUrl(absoluteUrl) {
    const apiEndpoint = chrome.getInjected('laasShortenApiEndpoint');
    return $http.post(`${apiEndpoint}`, {url: absoluteUrl}).then((result) => {
      return url.format(`${result.data.url}`);
    }).catch((response) => {
      notify.error(response);
    });
  }

  return {
    shortenUrl
  };
};
