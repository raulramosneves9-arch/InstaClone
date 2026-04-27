/**
 * Resolve a URL completa de uma imagem do backend.
 * Aceita URLs absolutas (http/https) ou caminhos relativos do storage do Laravel.
 *
 * @param {string|null} url
 * @returns {string}
 */
export function resolveImageUrl(url) {
    if (!url) return 'https://via.placeholder.com/500x500?text=Sem+Imagem';
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace('public/', '');
    return `http://localhost:8000/storage/${cleanPath}`;
}
