import { notes as initialNotes } from './data/notes.js';

const STORAGE_KEY = 'notes_app';

class App {
    constructor() {
        this.notes = this.loadNotes() || initialNotes;
        this.saveNotes();
        this.initializeComponents();
    }

    loadNotes() {
        const storedNotes = localStorage.getItem(STORAGE_KEY);
        return storedNotes ? JSON.parse(storedNotes) : null;
    }

    saveNotes() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    }

    initializeComponents() {
        const noteForm = document.querySelector('note-form');
        const noteList = document.querySelector('note-list');

        if (!noteForm || !noteList) {
            console.error('Required components not found!');
            return;
        }

        noteForm.addEventListener('note-submit', (event) => {
            const newNote = {
                id: `notes-${Date.now()}`,
                title: event.detail.title,
                body: event.detail.body,
                createdAt: new Date().toISOString(),
                archived: false
            };
            this.notes.unshift(newNote);
            this.saveNotes();
            noteList.notes = this.notes;
            console.log("Catatan baru berhasil ditambahkan:", newNote);
        });

        noteList.notes = this.notes;
        noteList.render();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new App();
});