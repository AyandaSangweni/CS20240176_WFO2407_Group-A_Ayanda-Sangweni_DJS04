class BookPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.previewContainer = document.createElement('button');
        this.previewContainer.classList.add('preview');
        this.imageElement = document.createElement('img');
        this.imageElement.classList.add('preview__image');
        this.titleElement = document.createElement('h3');
        this.titleElement.classList.add('preview__title');
        this.authorElement = document.createElement('div');
        this.authorElement.classList.add('preview__author');

        this.previewContainer.appendChild(this.imageElement);
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('preview__info');
        infoContainer.appendChild(this.titleElement);
        infoContainer.appendChild(this.authorElement);
        this.previewContainer.appendChild(infoContainer);

        this.shadowRoot.appendChild(this.previewContainer);

        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
            :host {
                display: block;
                font-family: 'Roboto', sans-serif;
            }
            .preview {
                border-width: 0;
                width: 100%;
                padding: 0.5rem 1rem;
                display: flex;
                align-items: center;
                cursor: pointer;
                text-align: left;
                border-radius: 8px;
                border: 1px solid rgba(var(--color-dark), 0.15);
                background: rgba(var(--color-light), 1);
                transition: background 0.3s ease;
            }
            .preview:hover {
                background: rgba(var(--color-blue), 0.05);
            }
            .preview__image {
                width: 48px;
                height: 70px;
                object-fit: cover;
                background: grey;
                border-radius: 2px;
                box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                            0px 1px 1px 0px rgba(0, 0, 0, 0.1),
                            0px 1px 3px 0px rgba(0, 0, 0, 0.1);
            }
            .preview__info {
                padding: 1rem;
            }
            .preview__title {
                margin: 0 0 0.5rem;
                font-weight: bold;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                color: rgba(var(--color-dark), 0.8);
            }
            .preview__author {
                color: rgba(var(--color-dark), 0.4);
            }
        `;
        this.shadowRoot.appendChild(this.styleElement);
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const { title, authorName, image } = this.dataset;

        this.imageElement.src = image || '';
        this.imageElement.alt = title || 'Book cover';
        this.titleElement.textContent = title || 'Unknown Title';
        this.authorElement.textContent = authorName || 'Unknown Author';
    }
}

customElements.define('book-preview', BookPreview);