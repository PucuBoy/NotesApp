import Swal from 'sweetalert2';
import NotesAPI from '../scripts/api.js';
import gsap from 'gsap';

class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set note(note) {
        this._note = note;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note-item {
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .note-item:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                .note-header {
                    margin-bottom: 12px;
                }
                .note-title {
                    margin: 0;
                    color: #333;
                }
                .note-date {
                    font-size: 0.8em;
                    color: #666;
                }
                .note-body {
                    color: #555;
                    margin-bottom: 16px;
                }
                .note-actions {
                    display: flex;
                    gap: 8px;
                }
                button {
                    padding: 8px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: opacity 0.2s;
                }
                button:hover {
                    opacity: 0.8;
                }
                .delete-btn {
                    background: #dc3545;
                    color: white;
                }
                .archive-btn {
                    background: #ffc107;
                    color: black;
                }
            </style>
            <div class="note-item">
                <div class="note-header">
                    <h3 class="note-title">${this._note.title}</h3>
                    <div class="note-date">${new Date(this._note.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="note-body">${this._note.body}</div>
                <div class="note-actions">
                    <button class="delete-btn">Hapus</button>
                    <button class="archive-btn">
                        ${this._note.archived ? 'Batal Arsip' : 'Arsip'}
                    </button>
                </div>
            </div>
        `;

        this.initializeButtons();
    }

    initializeButtons() {
        const deleteBtn = this.shadowRoot.querySelector('.delete-btn');
        const archiveBtn = this.shadowRoot.querySelector('.archive-btn');
        const loadingIndicator = document.querySelector('loading-indicator');

        archiveBtn.addEventListener('click', async () => {
            try {
                loadingIndicator.show();
                if (this._note.archived) {
                    await NotesAPI.unarchiveNote(this._note.id);
                } else {
                    await NotesAPI.archiveNote(this._note.id);
                }
 
                this._note.archived = !this._note.archived;

                const noteList = document.querySelector('note-list');
                noteList.removeNote(this._note.id);
                
                Swal.fire({
                    title: 'Berhasil!',
                    text: `Catatan berhasil ${this._note.archived ? 'diarsipkan' : 'batal diarsipkan'}`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                Swal.fire('Error!', error.message, 'error');
            } finally {
                loadingIndicator.hide();
            }
        });

        deleteBtn.addEventListener('click', async () => {
            try {
                const result = await Swal.fire({
                    title: 'Apakah Anda yakin?',
                    text: "Catatan yang dihapus tidak dapat dikembalikan!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc3545',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Ya, hapus!',
                    cancelButtonText: 'Batal'
                });

                if (result.isConfirmed) {
                    loadingIndicator.show();
                    await NotesAPI.deleteNote(this._note.id);
                    
                    const noteList = document.querySelector('note-list');
                    noteList.removeNote(this._note.id);
                    
                    Swal.fire('Terhapus!', 'Catatan berhasil dihapus.', 'success');
                }
            } catch (error) {
                Swal.fire('Error!', error.message, 'error');
            } finally {
                loadingIndicator.hide();
            }
        });
    }

    async toggleArchive() {
        const noteItem = this.shadowRoot.querySelector('.note-item');
        
        await gsap.to(noteItem, {
            duration: 0.3,
            rotateY: 90,
            ease: "power1.in"
        });

        this._note.archived = !this._note.archived;
        this.render();

        gsap.from(noteItem, {
            duration: 0.3,
            rotateY: -90,
            ease: "power1.out"
        });
    }
}

customElements.define('note-item', NoteItem);
