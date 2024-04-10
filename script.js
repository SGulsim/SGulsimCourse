const categoryIds = {
    index: 0,
    fashion: 3,
    tech: 1,
    sport: 2,
    karpov: 6
}

const categoryNames = {
    index: "Главная",
    fashion: "Мода",
    tech: "Технологии",
    sport: "Спорт",
    karpov: "Karpov"
}

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
    <article className="main-article">
        <div className="main-article__image-container">
            <img className="main-article__image" src="${encodeURI(item.image)}" alt="Фото новости">
        </div>
        <div className="main-article__content">
            <span className="article-category main-article__category">${escapeString(categoryData.name)}</span>
            <h2 className="main-article__title">${escapeString(item.title)}</h2>
            <p className="main-article__text">${escapeString(item.description)}</p>
            <span className="article-source main-article__source">${escapeString(sourceData.name)}</span>
        </div>
    </article>
    `;

                mainNewsContainer.appendChild(template.content);

            });


            const smallNews = data.items.slice(3, 12);
            const smallNewsContainer = document.querySelector('.articles__small-column');

            smallNews.forEach((item) => {

                const template = document.createElement('template');
                const dateData = new Date(item.date).toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' });
                const sourceData = data.sources.find((sourceItem) => sourceItem.id === item.source_id);

                template.innerHTML = `
     <article className="small-article">
        <h2 className="small-article__title">${item.title}</h2>
        <p className="small-article__caption">
        <span className="article-date small-article__date">${dateData}</span>
        <span className="article-source small-article__source">${escapeString(sourceData.name)}</span>
        </p>
    </article>
    `;

                smallNewsContainer.appendChild(template.content);

            });
        })
}

const App = () => {
    const [category, setCategory] = React.useState('index');
    const [articles, setArticles] = React.useState({ items: [], categories: [], sources: [] });

    const onNavClick = (e) => {
        e.preventDefault();
        setCategory(e.currentTarget.dataset.href);
    }

    React.useEffect(() => {
        fetch('http://frontend.karpovcourses.net/api/v2/ru/news/' + categoryIds[category] || '')
            .then(response => response.json())
            .then(response => {
                setArticles(response);
            })
    }, [category])

    return (
        <React.Fragment>
            <header className="header">
                <div className="container">
                    <nav className="navigation grid header__navigation">
                        <a href="#" className="navigation__logo">
                            <img className="navigation__image" src="./images/logo.svg" alt="Логотип" />
                        </a>
                        <ul className="navigation__list">
                            {['index', 'fashion', 'tech', 'sport', 'karpov'].map((item) => {
                                return (
                                    <li className="navigation__item" key={item}>
                                        <a
                                            className={`navigation__link ${category === item ? 'navigation__link--active' : ''}`} onClick={onNavClick}
                                            data-href={item}
                                            href="#"
                                        >
                                            {categoryNames[item]}
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav >
                </div >
            </header >

            <main className="main"></main>
            <section className="articles"></section>
            <div className="container grid">
                <section className="articles__big-column">
                    {articles.items.slice(0, 3).map((item) => {
                        return (
                            <article className="main-article" key={item.title}>
                                <div className="main-article__image-container">
                                    <img className="article-img main-article__img" src={item.image} alt="Фото новости" />
                                </div>
                                <div className="main-article__content">
                                    <span className="article-category">
                                        {articles.categories.find(({ id }) => item.category_id === id).name}
                                    </span>
                                    <h2 className="main-article__title">{item.title}</h2>
                                    <p className="main-article__text">{item.description}</p>
                                    <span className="article-source main-article__caption">
                                        {articles.sources.find(({ id }) => item.source_id === id).name}
                                    </span>
                                </div>
                            </article>
                        )
                    })}
                </section>
            </div>

            <section className="articles__small-column"></section>


            <footer className="footer">
                <div className="container">
                    <nav className="navigation grid footer__navigation">
                        <a href="#" className="navigation__logo">
                            <img className="navigation__image" src="./images/logo.svg" alt="Логотип" />
                        </a>
                        <ul className="navigation__list">
                            {['index', 'fashion', 'tech', 'sport', 'karpov'].map((item) => {
                                return (
                                    <li className="navigation__item" key={item}>
                                        <a
                                            className={`navigation__link ${category === item ? 'navigation__link--active' : ''}`} onClick={onNavClick}
                                            data-href={item}
                                            href="#"
                                        >
                                            {categoryNames[item]}
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    <div className="footer__column">
                        <p className="footer__text">Сделано на Frontend курсе в <a href="https://karpov.courses/frontend"
                            target="_blank" className="footer__link">Karpov.Courses</a></p>
                        <p className="footer__copyright">© 2021</p>
                    </div>
                </div>
            </footer>

        </React.Fragment >
    )
}

ReactDOM.render(<App />, document.getElementById('root')); 