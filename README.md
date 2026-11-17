# Sextant

Yerel öncelikli, çevrimdışı kişisel prompt kütüphanesi. / A local-first, offline personal prompt library.

Search it, copy it, tag it, favorite it, track how often you actually use each prompt — all without an account, a server, or a network round-trip.

**Sextant** treats prompts the way a sextant treats bearings: an instrument you keep close, calibrated by use, that works anywhere.

## Özellikler / Features

- **Anında arama** — başlık, gövde, etiket ve kategoride çok token'lı VE eşleştirme / instant multi-token AND search across title, body, tags and category
- **Koleksiyonlar** — Tümü / Favoriler / Son kullanılanlar + sayaçlı kategori çipleri / All / Favorites / Recently used + auto-derived category chips with live counts
- **Okuma paneli** — tek tıkla kopyala, favorile, düzenle, sil / reader pane with one-click copy, favorite, edit, delete
- **Kullanım takibi** — her kopya sayacı artırır, en çok kullanılanlar öne çıkar / every copy increments a counter
- **Başlangıç paketi** — 12 kanıtlanmış prompt (ilk açılışta, dilinize göre İngilizce veya Türkçe) / 12 battle-tested starter prompts seeded on first run, in your language
- **TR / EN arayüz** — kenar çubuğundan anlık dil değiştirme (varsayılan: Türkçe) / in-app language switch in the sidebar (default: Turkish)
- **JSON dışa / içe aktarma** — `sextant-backup-YYYY-MM-DD.json` ile tam yedekleme / full backup and restore
- **Klavye odaklı** — `/` arama, `N` yeni prompt, `F` favori, `C` kopyala, `Esc` kapat / keyboard-first

## Gizlilik / Privacy

Verileriniz makinede kalır. Hesap, sunucu, telemetri, analitik yok. Tarayıcıda `localStorage` altında; masaüstü uygulamada WebView'un kendi yerel deposunda. / Everything stays on your machine: no account, no server, no telemetry — stored in `localStorage` under the page origin (browser) or the WebView's local store (desktop app).

## Çalıştırma / Run it

### Masaüstü uygulaması (Tauri) / Desktop app (Tauri)

```sh
cd sextant
pnpm install
pnpm tauri build     # release binary + bundles
# veya / or: pnpm tauri dev   # geliştirici modu / dev mode
```

Hazır çıktılar / Prebuilt artifacts after `tauri build`:

- Binary: `src-tauri/target/release/sextant`
- DEB: `src-tauri/target/release/bundle/deb/Sextant_1.0.0_amd64.deb`
- RPM: `src-tauri/target/release/bundle/rpm/Sextant-1.0.0-1.x86_64.rpm`
- AppImage: `src-tauri/target/release/bundle/appimage/Sextant_1.0.0_amd64.AppImage`

Linux'ta `webkit2gtk-4.1` gereklidir. `JSON dışa aktar` Tauri komutunu kullanarak yedeği doğrudan **İndirilenler** klasörüne yazar ve yolu bildirimde gösterir; tarayıcıda çalıştırıldığında Blob indirmesine düşer. `JSON içe aktar` dosya seçici ile her iki ortamda da çalışır. / Requires `webkit2gtk-4.1` on Linux. "Export JSON" calls a Tauri command that writes the backup directly into your **Downloads** folder and reports the path in a toast; in a browser it falls back to a Blob download. "Import JSON" uses a file picker and works in both.

### Tarayıcıda / In the browser

No build step. No dependencies.

```sh
# seçenek 1 / option 1: just open the file
xdg-open sextant/src/index.html

# seçenek 2 / option 2: serve it locally (nicer for clipboard APIs)
python3 -m http.server 8765 --directory sextant
```

## Yedekleme & geri yükleme / Backup & restore

Kenar çubuğu → **JSON dışa aktar** tüm kütüphaneyi indirir. (Masaüstünde: İndirilenler klasörüne yazılır.) **JSON içe aktar** yedeği birleştirir; yinelenen kimlikler yeniden üretilir. Mevcut bir kütüphaneye karşı güvenle çalıştırılabilir. / Sidebar → **Export JSON** downloads (desktop: writes to Downloads). **Import JSON** merges a backup, regenerating IDs on collision. Safe against an existing library.

## Proje yapısı / Project layout

```
sextant/
├── src/                  # frontend (vanilla HTML/CSS/JS, sıfır bağımlılık)
│   ├── index.html        # TR varsayılan + data-i18n öznitelikleri
│   ├── styles.css
│   └── app.js            # STRINGS {en,tr}, SEED_PROMPTS {en,tr}, LANG_KEY=sextant.lang
├── src-tauri/            # Tauri v2 kabuğu / shell
│   ├── src/main.rs       # export_json komutu (İndirilenler'e yazar)
│   ├── tauri.conf.json
│   └── icons/
└── package.json          # @tauri-apps/cli
```

## Veri modeli / Data model

```jsonc
{
  "id": "uuid",
  "title": "Titiz kod incelemesi",
  "category": "Kodlama",
  "tags": ["review", "quality"],
  "body": "Sen titiz bir kıdemli mühendissin…",
  "favorite": true,
  "uses": 14,              // her kopyada artar / incremented on every copy
  "created": 1731800000000,
  "updated": 1731886400000,
  "lastUsed": 1731972800000
}
```

## Sıfırlama / Resetting

Sayfanın `localStorage`'ını temizleyin (DevTools → Application → Local Storage) ve başlangıç paketinin yeniden tohumlanması için `sextant.seeded.v1` bayrağını silin. / Wipe the page's `localStorage` and delete the `sextant.seeded.v1` flag to re-seed.

## License

MIT.
