export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');

    if (!container) return;

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;

    container.appendChild(el);

    setTimeout(() => el.remove(), 3000);
}

export function confirmAction(message) {
    return window.confirm(message);
}