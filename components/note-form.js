class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.addValidation();
    }

    render() {
        this.shadowRoot.innerHTML =`
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 20px;
                }
                input, textarea {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    padding: 10px;
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                button:disabled {
                    background-color: gray;
                    cursor: not-allowed;
                }
                .error {
                    color: red;
                    font-size: 0.8em;
                }
            </style>
            <form>
                <input type="text" id="title" placeholder="Judul Catatan" required />
                <span class="error" id="titleError"></span>
                <textarea id="body" rows="4" placeholder="Isi Catatan" required></textarea>
                <span class="error" id="bodyError"></span>
                <button type="submit" disabled>Tambah Catatan</button>
            </form>
        `;
    }

    addValidation() {
        const form = this.shadowRoot.querySelector("form");
        const titleInput = this.shadowRoot.querySelector("#title");
        const bodyInput = this.shadowRoot.querySelector("#body");
        const button = this.shadowRoot.querySelector("button");

        const validate = () => {
            const titleValid = titleInput.value.trim().length >= 4;
            const bodyValid = bodyInput.value.trim().length >= 10;

            this.shadowRoot.querySelector("#titleError").textContent = titleValid ? "" : "Judul minimal 4 karakter.";
            this.shadowRoot.querySelector("#bodyError").textContent = bodyValid ? "" : "Isi minimal 10 karakter.";

            button.disabled = !(titleValid && bodyValid);
        };

        titleInput.addEventListener("input", validate);
        bodyInput.addEventListener("input", validate);

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Kirim event ke App.js
            this.dispatchEvent(new CustomEvent("note-submit", {
                bubbles: true,
                composed: true,
                detail: {
                    title: titleInput.value,
                    body: bodyInput.value
                }
            }));

            form.reset();
            validate(); // ✅ Validasi ulang setelah reset
        });
    }
}

customElements.define("note-form", NoteForm);
