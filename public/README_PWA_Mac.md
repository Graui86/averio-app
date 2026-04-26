# Averio als Mobile/PWA und Mac-App nutzen

## 1. App.tsx ersetzen
Kopiere den kompletten Inhalt von `App_full_replacement_v7_mobile_pwa.tsx` in deine `src/App.tsx`.

## 2. PWA-Dateien einfügen
Lege diese Dateien an:

- `public/manifest.webmanifest`
- `public/sw.js`
- `src/pwa-register.ts`

Kopiere den Inhalt aus den gleichnamigen Dateien in diesem Ordner.

## 3. index.html ergänzen
Füge den Inhalt aus `index_head_addition.html` in den `<head>` deiner `index.html` ein.

## 4. main.tsx ergänzen
Füge in `src/main.tsx` den Import und Aufruf aus `main_tsx_addition.txt` ein.

## 5. Testen
```bash
npm run dev
```

Für echte PWA-Installation anschließend produktiv bauen:
```bash
npm run build
npm run preview
```

## 6. Auf dem Mac wie eine App öffnen
Öffne die App in Chrome oder Edge und nutze:
- Chrome: Teilen/Installieren bzw. Icon in der Adressleiste
- Edge: Apps > Diese Website als App installieren

Danach erscheint Averio wie eine eigene App im Programme-Ordner/Launcher.

Hinweis: Für eine echte `.dmg`-Datei wäre danach Tauri oder Electron der nächste Schritt.
