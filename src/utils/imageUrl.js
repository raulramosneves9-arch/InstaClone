/**
 * Resolve a URL completa de uma imagem do backend.
 * Aceita URLs absolutas (http/https) ou caminhos relativos do storage do Laravel.
 *
 * @param {string|null} url
 * @param {boolean} forceRefresh - Se true, adiciona um timestamp para evitar cache do browser.
 * @returns {string}
 */
export function resolveImageUrl(url, forceRefresh = false) {
    if (!url) return 'https://via.placeholder.com/500x500?text=Sem+Imagem';
    
    let resolvedUrl = url;
    if (!url.startsWith('http')) {
        const cleanPath = url.replace('public/', '');
        resolvedUrl = `http://localhost:8000/storage/${cleanPath}`;
    }

    if (forceRefresh) {
        const separator = resolvedUrl.includes('?') ? '&' : '?';
        resolvedUrl += `${separator}t=${new Date().getTime()}`;
    }

    return resolvedUrl;
}
