class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._notes = []; 
    }

    set notes(value) {
        this._notes = value;
        this.render(); 
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .notes-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 15px;
                    padding: 20px;
                }
            </style>
            <div class="notes-container">
                ${this._notes.length > 0 
                    ? this._notes.map(note => `<note-item title="${note.title}" body="${note.body}"></note-item>`).join('')
                    : `<p>Tidak ada catatan.</p>`}
            </div>
        `;
    }
}

customElements.define("note-list", NoteList);
