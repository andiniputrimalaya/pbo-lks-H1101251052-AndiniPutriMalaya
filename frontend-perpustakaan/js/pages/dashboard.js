import { booksApi, categoriesApi } from '../api.js';
import { escapeHtml } from '../utils.js';

export async function renderDashboard(container) {
    const [booksResponse, categoriesResponse] = await Promise.all([
        booksApi.list(),
        categoriesApi.list()
    ]);

    const books = booksResponse.data || [];
    const categories = categoriesResponse.data || [];

    const latestBooks = [...books]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 5);

    container.innerHTML = `
        <h2 class="text-2xl font-bold mb-2">Dashboard</h2>
        <p class="text-gray-500 mb-6">Ringkasan data perpustakaan</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-blue-600 text-white rounded-lg p-6 shadow">
                <p>Total Buku</p>
                <h3 class="text-3xl font-bold">${books.length}</h3>
            </div>

            <div class="bg-orange-500 text-white rounded-lg p-6 shadow">
                <p>Total Kategori</p>
                <h3 class="text-3xl font-bold">${categories.length}</h3>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-bold mb-4">5 Buku Terbaru</h3>

            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b bg-gray-50">
                            <th class="p-3">Judul</th>
                            <th class="p-3">Penulis</th>
                            <th class="p-3">Tahun</th>
                            <th class="p-3">Stok</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            latestBooks.length
                            ? latestBooks.map(book => `
                                <tr class="border-b">
                                    <td class="p-3">${escapeHtml(book.judul)}</td>
                                    <td class="p-3">${escapeHtml(book.penulis)}</td>
                                    <td class="p-3">${escapeHtml(book.tahun)}</td>
                                    <td class="p-3">${escapeHtml(book.stok)}</td>
                                </tr>
                            `).join('')
                            : `<tr><td colspan="4" class="p-4 text-center">Belum ada buku</td></tr>`
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}