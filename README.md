# whatsapp-bot

Rebuild bertahap dari [Pierr15/whatsapp-sticker-bot](https://github.com/Pierr15/whatsapp-sticker-bot)
(titik awal: commit `d39c204` pada `main`). Rencana dan aturan keselamatan ada di
`AGENTS.md` dan di branch `docs/ai-rebuild-blueprint` repo asal.

## Status

**Stage 1 — fondasi tes (tanpa perubahan perilaku).**
Parser perintah dipisah ke `src/commands/parse.js` dan default ke `src/config/defaults.js`.
`index.js` hanya berubah di dua tempat: import dan handler pesan.
Semua keanehan lama (mis. `.bratman` dibaca sebagai `.brat man`) sengaja dipertahankan dan
dikunci oleh tes karakterisasi. Memperbaikinya butuh persetujuan terpisah.

## Menjalankan tes

```bash
npm install     # hanya perlu untuk menjalankan bot; tes tidak butuh dependensi
npm test        # node --test, tanpa akun WhatsApp
```

## Menjalankan bot

```bash
npm start
```

Catatan: skrip `start` masih sama seperti aslinya (menjalankan `apt-get ...` dulu, khusus
Debian/Ubuntu dan butuh root). Ini defect D7 di audit dan baru diperbaiki di Stage 3.

## Data sesi

Sesi WhatsApp ada di `.wwebjs_auth/` (relatif terhadap folder tempat bot dijalankan).
Jangan hapus, pindahkan, atau commit folder ini. `data/` juga sudah di-ignore.
