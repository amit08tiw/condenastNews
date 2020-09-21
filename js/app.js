const apiKey = 'Request new API Key from newsAPI.org'; 
const defaultSource = ''; // default source of news gb is UK
const sourceSelector = document.querySelector('#news-keyword');
const newsArticles = document.querySelector('#news-list');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('./serviceWorker.js')
    .then(registration => console.log('Service Worker registered'))
    .catch(err => 'Service worker registration failed'));
}

window.addEventListener('load', e => {
  sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
  updateNewsSources().then(() => {
    sourceSelector.value = defaultSource;
    updateNews();
  });
});

window.addEventListener('online', () => updateNews(sourceSelector.value));

async function updateNewsSources() {
  const response = await fetch(`https://newsapi.org/v2/top-headlines?country=gb&apiKey=${apiKey}`);
  const json = await response.json();
  sourceSelector.innerHTML =
    json.sources;
}

async function updateNews(source = defaultSource) {
  newsArticles.innerHTML = '';
  const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${source}&sortBy=top&cgit &apiKey=${apiKey}`);
  const json = await response.json();
  console.log('Articles fetched', json);
  newsArticles.innerHTML =
    json.articles.map(createArticle).join('\n');
}

function createArticle(article) {
  return `
      <a class="story" href="${article.url}">
        <img class="story-image" src="${article.urlToImage}" alt="${article.title}">
        <p class="headline">${article.title}</p>
        <p class="author">${article.author ? article.author : ''}</p>
        <p class="description">${article.description}</p>
      </a>
  `;
}
