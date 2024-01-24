let data = null;

const escapeString = (string) => {
    
    const symbols = {
        '<': '&lt',
        '>': '&gt',
        '&': '&amp'
    }

    return string.replace(/[&<>]/g, (tag) => {
        return symbols[tag] || tag;
    }) 
}

const createMainNewsItem = (item) => {
    return `
    ‹article class="main-article">
        <div class="main-article__image-container">
            <img class="article-img main-article__img" src="${encodeURI(item.image)}" alt="Фото новости"></img>
        </div>
        <div class="main-article__content">
            <span class="article-category">${escapeString(data.categories.find((categoryItem) => categoryItem.id === item.category_id))}</span>
            <h2 class="main-article__title">${escapeString(item.title)}</h2>
            ‹p class="main-article__text" ${escapeString(item.description)}</p>
            ‹span class="article-source main-article__caption">${escapeString(data.sources.find((sourceItem) => sourceItem.id === item.source_id))}</span>
        </div>
     </article>
    `
    }

const renderNews = (categoryId) => {
    fetch('http://frontend.karpovcourses.net/api/v2/ru/news/' + (categoryId ? categoryId : ''))
    .then(response => response.json())
    .then((responseData) => {
        data = responseData;
        
const mainNews = data.items.slice(0, 3);
const mainNewsContainer = document.querySelector('.articles__big-column');

mainNews.forEach((item) => {

    const template = document.createElement('template');
    const categoryData = data.categories.find((categoryItem) => categoryItem.id === item.category_id);
    const sourceData = data.sources.find((sourceItem) => sourceItem.id === item.source_id);

    template.innerHTML = `
    <article class="main-article">
        <div class="main-article__image-container">
            <img class="main-article__image" src="${encodeURI(item.image)}" alt="Фото новости">
        </div>
        <div class="main-article__content">
            <span class="article-category main-article__category">${escapeString(categoryData.name)}</span>
            <h2 class="main-article__title">${escapeString(item.title)}</h2>
            <p class="main-article__text">${escapeString(item.description)}</p>
            <span class="article-source main-article__source">${escapeString(sourceData.name)}</span>
        </div>
    </article>
    `;
 
    mainNewsContainer.appendChild(template.content);

});


const smallNews = data.items.slice(3, 12);
const smallNewsContainer = document.querySelector('.articles__small-column');

smallNews.forEach((item) => {

    const template = document.createElement('template');
    const dateData = new Date(item.date).toLocaleDateString('ru-RU', {month: 'long', day: 'numeric'});
    const sourceData = data.sources.find((sourceItem) => sourceItem.id === item.source_id);

    template.innerHTML = `
     <article class="small-article">
        <h2 class="small-article__title">${item.title}</h2>
        <p class="small-article__caption">
        <span class="article-date small-article__date">${dateData}</span>
        <span class="article-source small-article__source">${escapeString(sourceData.name)}</span>
        </p>
    </article>
    `;
 
    smallNewsContainer.appendChild(template.content);

});
    })
}