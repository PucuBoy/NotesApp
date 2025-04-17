const BASE_URL = 'https://notes-api.dicoding.dev/v2';

class NotesAPI {
    static async getAllNotes() {
        try {
            const response = await fetch(`${BASE_URL}/notes`);
            const responseJson = await response.json();
            
            if (responseJson.status !== 'success') {
                throw new Error(responseJson.message);
            }
            return responseJson.data;
        } catch (error) {
            throw new Error('Gagal mengambil catatan. Silakan periksa koneksi internet Anda.');
        }
    }

    static async getArchivedNotes() {
        const response = await fetch(`${BASE_URL}/notes/archived`);
        const responseJson = await response.json();
        
        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }
        return responseJson.data;
    }

    static async getSingleNote(id) {
        const response = await fetch(`${BASE_URL}/notes/${id}`);
        const responseJson = await response.json();
        
        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }
        return responseJson.data;
    }

    static async addNote({ title, body }) {
        const response = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body }),
        });

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }

        return responseJson.data;
    }

    static async deleteNote(id) {
        const response = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'DELETE',
        });

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }
    }

    static async archiveNote(id) {
        const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
            method: 'POST',
        });

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }
    }

    static async unarchiveNote(id) {
        const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
            method: 'POST',
        });

        const responseJson = await response.json();

        if (responseJson.status !== 'success') {
            throw new Error(responseJson.message);
        }
    }
}

export default NotesAPI;