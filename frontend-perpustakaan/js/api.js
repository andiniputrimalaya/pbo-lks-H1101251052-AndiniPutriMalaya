import { CONFIG } from './config.js';

class ApiClient {
    static async request(path, options = {}) {
        const res = await fetch(CONFIG.BASE_URL + path, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            ...options,
        });

        const json = await res.json();

        if (!res.ok || json.success === false) {
            throw new Error(json.message || 'Terjadi kesalahan');
        }

        return json;
    }

    static get(path) {
        return this.request(path);
    }

    static post(path, body) {
        return this.request(path, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    static put(path, body) {
        return this.request(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    static delete(path) {
        return this.request(path, {
            method: 'DELETE',
        });
    }
}

export const booksApi = {
    list: () => ApiClient.get('/books'),
    get: (id) => ApiClient.get(`/books/${id}`),
    create: (data) => ApiClient.post('/books', data),
    update: (id, data) => ApiClient.put(`/books/${id}`, data),
    destroy: (id) => ApiClient.delete(`/books/${id}`),
};

export const categoriesApi = {
    list: () => ApiClient.get('/categories'),
    get: (id) => ApiClient.get(`/categories/${id}`),
    create: (data) => ApiClient.post('/categories', data),
    update: (id, data) => ApiClient.put(`/categories/${id}`, data),
    destroy: (id) => ApiClient.delete(`/categories/${id}`),
};