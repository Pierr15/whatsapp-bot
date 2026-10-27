'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { parseCommand } = require('../src/commands/parse');
const { DEFAULT_STICKER_NAME, DEFAULT_STICKER_AUTHOR } = require('../src/config/defaults');

const sticker = (name = DEFAULT_STICKER_NAME, author = DEFAULT_STICKER_AUTHOR) =>
    ({ type: 'sticker', name, author });

test('default stiker sesuai spesifikasi', () => {
    assert.equal(DEFAULT_STICKER_NAME, '✨ Stiker');
    assert.equal(DEFAULT_STICKER_AUTHOR, 'StikerBot');
});

test('.help dan .menu', () => {
    assert.deepEqual(parseCommand('.help'), { type: 'help' });
    assert.deepEqual(parseCommand('.menu'), { type: 'help' });
    assert.deepEqual(parseCommand('  .MENU  '), { type: 'help' });
    assert.deepEqual(parseCommand('.Help'), { type: 'help' });
});

test('.s memakai nama dan author default', () => {
    assert.deepEqual(parseCommand('.s'), sticker());
    assert.deepEqual(parseCommand('  .S  '), sticker());
});

test('.stiker: semua bentuk argumen', () => {
    assert.deepEqual(parseCommand('.stiker'), sticker());
    assert.deepEqual(parseCommand('.stiker Kucingku|BotKu'), sticker('Kucingku', 'BotKu'));
    assert.deepEqual(parseCommand('.stiker |BotKu'), sticker(undefined, 'BotKu'));
    assert.deepEqual(parseCommand('.stiker Kucingku|'), sticker('Kucingku', undefined));
    assert.deepEqual(parseCommand('.stiker |'), sticker());
});

test('.stiker: case-insensitive dan spasi dipangkas', () => {
    assert.deepEqual(parseCommand('.STIKER A|B'), sticker('A', 'B'));
    assert.deepEqual(parseCommand('  .stiker   Kucingku  |  BotKu  '), sticker('Kucingku', 'BotKu'));
});

test('.stiker: nama tanpa pipa memakai author default', () => {
    assert.deepEqual(parseCommand('.stiker Kucingku'), sticker('Kucingku'));
});

test('.stiker: unicode tidak bermasalah', () => {
    assert.deepEqual(parseCommand('.stiker 🐱 Kucing|✨ Bot'), sticker('🐱 Kucing', '✨ Bot'));
});

test('.brat: teks diambil apa adanya (huruf kecil dilakukan saat render)', () => {
    assert.deepEqual(parseCommand('.brat halo dunia'), { type: 'brat', text: 'halo dunia' });
    assert.deepEqual(parseCommand('.BRAT Halo Dunia'), { type: 'brat', text: 'Halo Dunia' });
    assert.deepEqual(parseCommand('  .brat   charli xcx  '), { type: 'brat', text: 'charli xcx' });
});

test('.brat tanpa teks menghasilkan teks kosong (handler yang membalas pesan bantuan)', () => {
    assert.deepEqual(parseCommand('.brat'), { type: 'brat', text: '' });
    assert.deepEqual(parseCommand('.brat   '), { type: 'brat', text: '' });
});

test('bukan perintah: mengembalikan null', () => {
    assert.equal(parseCommand(''), null);
    assert.equal(parseCommand('   '), null);
    assert.equal(parseCommand('halo'), null);
    assert.equal(parseCommand('s'), null);
    assert.equal(parseCommand('.st'), null);
    assert.equal(parseCommand('.sx'), null);
    assert.equal(parseCommand('.helpme'), null);
    assert.equal(parseCommand('.menu lagi'), null);
});

test('.s dan .help harus persis: argumen tambahan = bukan perintah', () => {
    assert.equal(parseCommand('.s foo'), null);
    assert.equal(parseCommand('.help foo'), null);
});

test('input non-string tidak membuat error', () => {
    assert.equal(parseCommand(undefined), null);
    assert.equal(parseCommand(null), null);
    assert.equal(parseCommand(123), null);
    assert.equal(parseCommand({}), null);
});

// ── Karakterisasi perilaku SAAT INI (bukan perilaku yang diinginkan) ──────────
// Test di bawah mengunci keanehan lama supaya perubahan apa pun di masa depan
// terlihat jelas dan harus disengaja. Lihat defect D3 di laporan audit.

test('[karakterisasi] .stikerextra masih dianggap .stiker dengan nama "extra"', () => {
    assert.deepEqual(parseCommand('.stikerextra'), sticker('extra'));
});

test('[karakterisasi] .bratman masih dianggap .brat dengan teks "man"', () => {
    assert.deepEqual(parseCommand('.bratman'), { type: 'brat', text: 'man' });
});

test('[karakterisasi] pipa ketiga dan seterusnya diabaikan diam-diam', () => {
    assert.deepEqual(parseCommand('.stiker A|B|C'), sticker('A', 'B'));
});
