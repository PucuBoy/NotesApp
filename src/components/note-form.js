import Swal from 'sweetalert2';
import NotesAPI from '../scripts/api.js';

class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initializeForm();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note-form {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 20px;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input, textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                button:hover {
                    background: #0056b3;
                }
            </style>
            <form class="note-form">
                <div class="form-group">
                    <label for="title">Judul</label>
                    <input type="text" id="title" required minlength="3">
                </div>
                <div class="form-group">
                    <label for="body">Isi Catatan</label>
                    <textarea id="body" required></textarea>
                </div>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;
    }

    initializeForm() {
        const form = this.shadowRoot.querySelector('form');
        const loadingIndicator = document.querySelector('loading-indicator');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = this.shadowRoot.querySelector('#title').value;
            const body = this.shadowRoot.querySelector('#body').value;

            try {
                loadingIndicator.show();
                await NotesAPI.addNote({ title, body });
                
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Catatan berhasil ditambahkan',
                    icon: 'success'
                });

                form.reset();
                this.dispatchEvent(new CustomEvent('note-added', { bubbles: true }));
            } catch (error) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message,
                    icon: 'error'
                });
            } finally {
                loadingIndicator.hide();
            }
        });
    }
}

customElements.define('note-form', NoteForm);
