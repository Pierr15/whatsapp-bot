'use strict';

const { DEFAULT_STICKER_NAME, DEFAULT_STICKER_AUTHOR } = require('../config/defaults');

/**
 * Parser perintah murni (tanpa WhatsApp, tanpa I/O).
 *
 * Meniru PERSIS aturan pencocokan index.js sebelum refactor (Stage 1: tanpa
 * perubahan perilaku), termasuk keanehan yang sudah diketahui:
 *   - `.stiker...` dan `.brat...` dicocokkan dengan startsWith, sehingga
 *     `.stikerextra` dan `.bratman` tetap dianggap perintah (lihat defect D3
 *     di laporan audit Stage 0). Memperbaikinya = perubahan perilaku yang
 *     harus disetujui terpisah.
 *   - Pada `.stiker a|b|c` hanya bagian pertama dan kedua dipakai.
 *
 * @param {unknown} rawBody isi pesan (msg.body)
 * @returns {{type:'help'} | {type:'sticker', name:string, author:string}
 *          | {type:'brat', text:string} | null}
 */
function parseCommand(rawBody) {
    const body = typeof rawBody === 'string' ? rawBody.trim() : '';
    const lower = body.toLowerCase();

    if (lower === '.help' || lower === '.menu') {
        return { type: 'help' };
    }

    if (lower === '.s') {
        return { type: 'sticker', name: DEFAULT_STICKER_NAME, author: DEFAULT_STICKER_AUTHOR };
    }

    if (lower.startsWith('.stiker')) {
        const args = body.slice(7).trim();
        const parts = args.split('|');
        const name = (parts[0] ?? '').trim() || DEFAULT_STICKER_NAME;
        const author = (parts[1] ?? '').trim() || DEFAULT_STICKER_AUTHOR;
        return { type: 'sticker', name, author };
    }

    if (lower.startsWith('.brat')) {
        return { type: 'brat', text: body.slice(5).trim() };
    }

    return null;
}

module.exports = { parseCommand };
