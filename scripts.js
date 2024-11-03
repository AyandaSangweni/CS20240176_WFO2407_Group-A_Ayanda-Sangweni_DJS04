import { books as booksData, authors as authorsData, genres as genresData, BOOKS_PER_PAGE } from './data.js';

// Define objects for Book, Author, and Genre
const Book = function(id, title, author, image, genres, published, description) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.image = image;
    this.genres = genres;
    this.published = published;
    this.description = description;
};

const Author = function(id, name) {
    this.id = id;
    this.name = name;
};

const Genre = function(id, name) {
    this.id = id;
    this.name = name;
};

// Initialize collections using these objects
const books = booksData.map(book => new Book(book.id, book.title, book.author, book.image, book.genres, book.published, book.description));
const authors = Object.entries(authorsData).map(([id, name]) => new Author(id, name));
const genres = Object.entries(genresData).map(([id, name]) => new Genre(id, name));

// Populate genres dropdown
const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement('option');
firstGenreElement.value = 'any';
firstGenreElement.innerText = 'All Genres';
genreHtml.appendChild(firstGenreElement);

for (const genre of genres) {
    const element = document.createElement('option');
    element.value = genre.id;
    element.innerText = genre.name;
    genreHtml.appendChild(element);
}

document.querySelector('[data-search-genres]').appendChild(genreHtml);

// Populate authors dropdown
const authorsHtml = document.createDocumentFragment();
const firstAuthorElement = document.createElement('option');
firstAuthorElement.value = 'any';
firstAuthorElement.innerText = 'All Authors';
authorsHtml.appendChild(firstAuthorElement);

for (const author of authors) {
    const element = document.createElement('option');
    element.value = author.id;
    element.innerText = author.name;
    authorsHtml.appendChild(element);
}

document.querySelector('[data-search-authors]').appendChild(authorsHtml);

// Theme settings
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night';
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day';
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

// Initialize pagination and matches
let page = 1;
let matches = books;

// Function to render book list
function renderBookList(bookList) {
    const fragment = document.createDocumentFragment();
    for (const { author, id, image, title } of bookList) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authorsData[author]}</div>
            </div>
        `;
        fragment.appendChild(element);
    }
    document.querySelector('[data-list-items]').appendChild(fragment);
}

// Initial rendering of the book list
renderBookList(matches.slice(0, BOOKS_PER_PAGE));
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;

// Function to apply filters based on search criteria
function applyFilters(filters) {
    return books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        return genreMatch && authorMatch && titleMatch;
    });
}

// Event listeners for various UI interactions
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
});

// Theme setting submission
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

    document.querySelector('[data-settings-overlay]').open = false;
});

// Event listener for search form submission with filtering
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    matches = applyFilters(filters);
    page = 1;

    document.querySelector('[data-list-items]').innerHTML = '';
    renderBookList(matches.slice(0, BOOKS_PER_PAGE));

    document.querySelector('[data-list-button]').disabled = matches.length <= BOOKS_PER_PAGE;
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', matches.length < 1);
    document.querySelector('[data-search-overlay]').open = false;
});

// Function to handle showing more books
function showMoreBooks() {
    renderBookList(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
    page += 1;
    document.querySelector('[data-list-button]').disabled = matches.length <= page * BOOKS_PER_PAGE;
}

// Event listener for "Show more" button
document.querySelector('[data-list-button]').addEventListener('click', showMoreBooks);

// Handle book preview display
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
            active = books.find(singleBook => singleBook.id === node?.dataset?.preview);
        }
    }

    if (active) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = active.image;
        document.querySelector('[data-list-image]').src = active.image;
        document.querySelector('[data-list-title]').innerText = active.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = active.description;
    }
});