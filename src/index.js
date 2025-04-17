import './styles/style.css';
import './components/loading-indicator.js';
import './components/note-form.js';
import './components/note-list.js';
import './components/note-item.js';

document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.querySelector('note-list');
    
    ['note-added', 'note-deleted', 'note-archived'].forEach(eventName => {
        document.addEventListener(eventName, () => {
            noteList.loadNotes();
        });
    });
});