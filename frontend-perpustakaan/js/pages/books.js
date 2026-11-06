
import { booksApi } from '../api.js';
import { showToast, confirmAction, escapeHtml } from '../utils.js';

export async function renderBooksPage(container) {
    container.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold">Data Buku</h2>
                <p class="text-gray-500">Kelola data buku perpustakaan</p>
            </div>
            <button id="btn-add" class="bg-blue-600 text-white px-4 py-2 rounded">
                + Tambah Buku
            </button>
        </div>

        <div class="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b bg-gray-50">
                        <th class="p-3">ID</th>
                        <th class="p-3">Judul</th>
                        <th class="p-3">Penulis</th>
                        <th class="p-3">Tahun</th>
                        <th class="p-3">Stok</th>
                        <th class="p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody id="books-table"></tbody>
            </table>
        </div>

        <div id="book-modal"
            class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 id="modal-title" class="text-xl font-bold mb-4">Tambah Buku</h3>

                <form id="book-form">
                    <input type="hidden" id="book-id">

                    <label class="block mb-1">Judul Buku</label>
                    <input id="judul" required class="w-full border rounded p-2 mb-3">

                    <label class="block mb-1">Penulis</label>
                    <input id="penulis" required class="w-full border rounded p-2 mb-3">

                    <label class="block mb-1">Tahun</label>
                    <input id="tahun" type="number" required class="w-full border rounded p-2 mb-3">

                    <label class="block mb-1">Stok</label>
                    <input id="stok" type="number" min="0" required class="w-full border rounded p-2 mb-4">

                    <div class="flex justify-end gap-2">
                        <button type="button" id="btn-cancel"
                            class="bg-gray-300 px-4 py-2 rounded">Batal</button>
                        <button type="submit"
                            class="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const modal = document.getElementById('book-modal');
    const form = document.getElementById('book-form');

    async function loadBooks() {
        try {
            const response = await booksApi.list();
            const books = response.data || [];

            document.getElementById('books-table').innerHTML = books.length
                ? books.map(book => `
                    <tr class="border-b">
                        <td class="p-3">${escapeHtml(book.id)}</td>
                        <td class="p-3">${escapeHtml(book.judul)}</td>
                        <td class="p-3">${escapeHtml(book.penulis)}</td>
                        <td class="p-3">${escapeHtml(book.tahun)}</td>
                        <td class="p-3">${escapeHtml(book.stok)}</td>
                        <td class="p-3 whitespace-nowrap">
                            <button class="btn-edit text-blue-600 mr-2"
                                data-id="${escapeHtml(book.id)}">Edit</button>
                            <button class="btn-delete text-red-600"
                                data-id="${escapeHtml(book.id)}">Hapus</button>
                        </td>
                    </tr>
                `).join('')
                : `<tr><td colspan="6" class="p-4 text-center">Belum ada buku</td></tr>`;
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    function openModal(book = null) {
        form.reset();

        document.getElementById('book-id').value = book?.id || '';
        document.getElementById('judul').value = book?.judul || '';
        document.getElementById('penulis').value = book?.penulis || '';
        document.getElementById('tahun').value = book?.tahun || '';
        document.getElementById('stok').value = book?.stok ?? '';

        document.getElementById('modal-title').textContent =
            book ? 'Edit Buku' : 'Tambah Buku';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    document.getElementById('btn-add').addEventListener('click', () => openModal());
    document.getElementById('btn-cancel').addEventListener('click', closeModal);

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const id = document.getElementById('book-id').value;

        const data = {
            judul: document.getElementById('judul').value,
            penulis: document.getElementById('penulis').value,
            tahun: Number(document.getElementById('tahun').value),
            stok: Number(document.getElementById('stok').value)
        };

        try {
            if (id) {
                await booksApi.update(id, data);
                showToast('Buku berhasil diperbarui');
            } else {
                await booksApi.create(data);
                showToast('Buku berhasil ditambahkan');
            }

            closeModal();
            await loadBooks();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    document.getElementById('books-table').addEventListener('click', async event => {
        const id = event.target.dataset.id;
        if (!id) return;

        if (event.target.classList.contains('btn-edit')) {
            try {
                const response = await booksApi.get(id);
                openModal(response.data);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }

        if (event.target.classList.contains('btn-delete')) {
            if (!confirmAction('Yakin ingin menghapus buku ini?')) return;

            try {
                await booksApi.destroy(id);
                showToast('Buku berhasil dihapus');
                await loadBooks();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });

    await loadBooks();
}
