/**
 * Formata números grandes para um padrão legível (ex: 1200 -> 1,2k)
 * @param {number} n - O número a ser formatado
 * @returns {string|number} - O número formatado
 */
export function formatCount(n) {
    if (!n) return 0;

    if (n < 1000) {
        return n;
    }

    if (n < 1000000) {
        // Retorna algo como 1.2k
        return +(n / 1000).toFixed(1) + "k";
    }

    // Para milhões (ex: 1.5M)
    return +(n / 1000000).toFixed(1) + "M";
}