const apiKey = 'Replace with new API Key from newsAPI.org or use one shared';
const defaultSource = ''; //default setting to search for all.
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
// Handling for network online/offline scenerio
window.addEventListener('online', () => updateNews(sourceSelector.value));

//Setting default list to "gb" for UK based news as asked in problem statements.
async function updateNewsSources() {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=gb&apiKey=${apiKey}`);
    const json = await response.json();
    sourceSelector.innerHTML =
        json.sources;
}

//When search terms/keywords are changed
async function updateNews(source = defaultSource) {
    newsArticles.innerHTML = '';
    const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${source}&sortBy=top&cgit &apiKey=${apiKey}`);
    const json = await response.json();
    console.log('Articles fetched', json);
    newsArticles.innerHTML =
        json.articles.map(createArticle).join('\n');
}

//Designing the appearance of card and associate with the data being received and setting click action for complete card to open full news.
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