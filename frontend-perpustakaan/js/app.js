import { renderDashboard } from './pages/dashboard.js';
import { renderBooksPage } from './pages/books.js';
import { renderCategoriesPage } from './pages/categories.js';

const routes = {
    dashboard: renderDashboard,
    books: renderBooksPage,
    categories: renderCategoriesPage
};

async function router() {
    const hash = (window.location.hash.slice(1) || 'dashboard').split('?')[0];

    const renderFn = routes[hash] || renderDashboard;

    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHash = link.getAttribute('href').slice(1);

        link.classList.toggle('bg-blue-700', linkHash === hash);
    });

    const container = document.getElementById('app');

    container.innerHTML = `
        <div class="text-center py-16 text-gray-400">
            Memuat...
        </div>
    `;

    try {
        await renderFn(container);
    } catch (error) {
        console.error(error);

        container.innerHTML = `
            <div class="text-center py-16">
                <p class="text-red-600 font-bold">Terjadi Kesalahan</p>
                <p class="text-gray-500 mt-2">${error.message}</p>
            </div>
        `;
    }
}

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('hashchange', router);