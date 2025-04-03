class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["title", "body"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background: #fff;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s;
                }
                .note:hover {
                    transform: scale(1.05);
                }
                h3 {
                    margin: 0;
                    color: #007BFF;
                }
                p {
                    color: #555;
                }
            </style>
            <div class="note">
                <h3>${this.getAttribute("title") || "Tanpa Judul"}</h3>
                <p>${this.getAttribute("body") || "Tidak ada isi catatan."}</p>
            </div>
        `;
    }
}

customElements.define("note-item", NoteItem);
