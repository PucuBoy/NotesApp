import Swal from 'sweetalert2';
import NotesAPI from '../scripts/api.js';
import gsap from 'gsap';

class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._notes = [];
        this._filteredNotes = [];
        this._isArchived = false;
    }

    connectedCallback() {
        this.loadNotes();
        this.setupControls();
    }

    setupControls() {
        this.shadowRoot.innerHTML = `
            <style>
                .controls {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 20px;
                    align-items: center;
                }
                .search-bar {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                .sort-select {
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .toggle-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .toggle-button:hover {
                    background: #0056b3;
                }
                .notes-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
            </style>
            <div class="controls">
                <input type="text" class="search-bar" placeholder="Cari catatan...">
                <select class="sort-select">
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="title">Judul</option>
                </select>
                <button class="toggle-button">
                    ${this._isArchived ? 'Lihat Catatan Aktif' : 'Lihat Catatan Terarsip'}
                </button>
            </div>
            <div class="notes-container"></div>
        `;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const searchBar = this.shadowRoot.querySelector('.search-bar');
        const sortSelect = this.shadowRoot.querySelector('.sort-select');
        const toggleButton = this.shadowRoot.querySelector('.toggle-button');

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this._filteredNotes = this._notes.filter(note => 
                note.title.toLowerCase().includes(searchTerm) ||
                note.body.toLowerCase().includes(searchTerm)
            );
            this.renderNotes();
        });

        sortSelect.addEventListener('change', (e) => {
            this.sortNotes(e.target.value);
            this.renderNotes();
        });

        toggleButton.addEventListener('click', () => {
            this._isArchived = !this._isArchived;
            this.loadNotes();
        });
    }

    sortNotes(sortType) {
        const notesToSort = this._filteredNotes.length > 0 ? this._filteredNotes : this._notes;
        
        switch(sortType) {
            case 'newest':
                notesToSort.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                notesToSort.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title':
                notesToSort.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
    }

    renderNotes() {
        const container = this.shadowRoot.querySelector('.notes-container');
        const notesToRender = this._filteredNotes.length > 0 ? this._filteredNotes : this._notes;

        container.innerHTML = notesToRender.length ? 
            notesToRender.map(() => `<note-item></note-item>`).join('') :
            `<p class="empty-message">Tidak ada catatan ${this._isArchived ? 'terarsip' : 'aktif'}</p>`;

        if (notesToRender.length) {
            container.querySelectorAll('note-item').forEach((item, index) => {
                item.note = notesToRender[index];
            });
        }
    }

    async loadNotes() {
        const loadingIndicator = document.querySelector('loading-indicator');
        try {
            loadingIndicator.show();
            this._notes = await (this._isArchived ? 
                NotesAPI.getArchivedNotes() : 
                NotesAPI.getAllNotes());
            this.render();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error'
            });
        } finally {
            loadingIndicator.hide();
        }
    }

    render() {
        const container = this.shadowRoot.querySelector('.notes-container');
        const toggleButton = this.shadowRoot.querySelector('.toggle-button');
        
        toggleButton.textContent = this._isArchived ? 'Lihat Catatan Aktif' : 'Lihat Catatan Terarsip';

        container.innerHTML = `
            <style>
                .notes-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .empty-message {
                    text-align: center;
                    grid-column: 1 / -1;
                    padding: 20px;
                    color: #666;
                }
            </style>
            ${this._notes.length ? 
                this._notes.map(note => `<note-item></note-item>`).join('') :
                `<p class="empty-message">Tidak ada catatan ${this._isArchived ? 'terarsip' : 'aktif'}</p>`
            }
        `;

        if (this._notes.length) {
            container.querySelectorAll('note-item').forEach((item, index) => {
                item.note = this._notes[index];
            });
        }
        
        if (this._notes && this._notes.length) {
            const noteItems = this.shadowRoot.querySelectorAll('note-item');
            gsap.from(noteItems, {
                duration: 0.5,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }

    removeNote(id) {
        const noteToRemove = this.shadowRoot.querySelector(`note-item[data-id="${id}"]`);
        
        gsap.to(noteToRemove, {
            duration: 0.3,
            scale: 0.8,
            opacity: 0,
            onComplete: () => {
                this._notes = this._notes.filter(note => note.id !== id);
                this.render();
            }
        });
    }
}

customElements.define('note-list', NoteList);
