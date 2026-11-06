
import { categoriesApi } from '../api.js';
import { showToast, confirmAction, escapeHtml } from '../utils.js';

export async function renderCategoriesPage(container) {
    container.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-2xl font-bold">Data Kategori</h2>
                <p class="text-gray-500">Kelola kategori buku perpustakaan</p>
            </div>
            <button id="btn-add-category"
                class="bg-blue-600 text-white px-4 py-2 rounded">
                + Tambah Kategori
            </button>
        </div>

        <div class="bg-white rounded-lg shadow p-6 overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="border-b bg-gray-50">
                        <th class="p-3">ID</th>
                        <th class="p-3">Nama Kategori</th>
                        <th class="p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody id="categories-table"></tbody>
            </table>
        </div>

        <div id="category-modal"
            class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4">
            <div class="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 id="category-modal-title" class="text-xl font-bold mb-4">
                    Tambah Kategori
                </h3>

                <form id="category-form">
                    <input type="hidden" id="category-id">

                    <label class="block mb-1">Nama Kategori</label>
                    <input id="nama-kategori" required
                        class="w-full border rounded p-2 mb-4">

                    <div class="flex justify-end gap-2">
                        <button type="button" id="category-cancel"
                            class="bg-gray-300 px-4 py-2 rounded">Batal</button>
                        <button type="submit"
                            class="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    function openModal(category = null) {
        form.reset();

        document.getElementById('category-id').value = category?.id || '';
        document.getElementById('nama-kategori').value = category?.nama || '';

        document.getElementById('category-modal-title').textContent =
            category ? 'Edit Kategori' : 'Tambah Kategori';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    async function loadCategories() {
        try {
            const response = await categoriesApi.list();
            const categories = response.data || [];

            document.getElementById('categories-table').innerHTML =
                categories.length
                ? categories.map(category => `
                    <tr class="border-b">
                        <td class="p-3">${escapeHtml(category.id)}</td>
                        <td class="p-3">${escapeHtml(category.nama)}</td>
                        <td class="p-3 whitespace-nowrap">
                            <button class="category-edit text-blue-600 mr-2"
                                data-id="${escapeHtml(category.id)}">Edit</button>
                            <button class="category-delete text-red-600"
                                data-id="${escapeHtml(category.id)}">Hapus</button>
                        </td>
                    </tr>
                `).join('')
                : `<tr><td colspan="3" class="p-4 text-center">Belum ada kategori</td></tr>`;
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    document.getElementById('btn-add-category').addEventListener('click', () => {
        openModal();
    });

    document.getElementById('category-cancel').addEventListener('click', closeModal);

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const id = document.getElementById('category-id').value;
        const data = {
            nama: document.getElementById('nama-kategori').value
        };

        try {
            if (id) {
                await categoriesApi.update(id, data);
                showToast('Kategori berhasil diperbarui');
            } else {
                await categoriesApi.create(data);
                showToast('Kategori berhasil ditambahkan');
            }

            closeModal();
            await loadCategories();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    document.getElementById('categories-table').addEventListener('click', async event => {
        const id = event.target.dataset.id;
        if (!id) return;

        if (event.target.classList.contains('category-edit')) {
            try {
                const response = await categoriesApi.get(id);
                openModal(response.data);
            } catch (error) {
                showToast(error.message, 'error');
            }
        }

        if (event.target.classList.contains('category-delete')) {
            if (!confirmAction('Yakin ingin menghapus kategori ini?')) return;

            try {
                await categoriesApi.destroy(id);
                showToast('Kategori berhasil dihapus');
                await loadCategories();
            } catch (error) {
                showToast(error.message, 'error');
            }
        }
    });

    await loadCategories();
}
