# Lucid Gateway

Janniks persönliche PWA für vier Bereiche: **Luzides Träumen** (inkl. OBE),
**Innenwelt**, **MindSpark** (Wachwelt) und **Mixed Martial Mindset** (Coaching-Projekt).

Alles liegt lokal auf dem Gerät — keine Konten, keine Cloud, keine externen APIs.
Die JSON-Sicherung ist deshalb das einzige Netz.

---

## Starten

```bash
npm install
npm run icons   # einmalig: erzeugt die PWA-Icons
npm run dev
```

| Befehl | Wofür |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktionsbau nach `dist/` |
| `npm run preview` | den Bau lokal ansehen |
| `npm run typecheck` | TypeScript prüfen |
| `npm run icons` | Icons neu erzeugen |

Auf dem Handy: die veröffentlichte Seite im Browser öffnen und
„Zum Startbildschirm hinzufügen“. Erst dann läuft die App offline im Vollbild,
und erst dann sind Erinnerungen für Reality Checks möglich.

## Veröffentlichen

Jeder Push auf `main` baut die App und stellt sie über GitHub Actions auf
GitHub Pages bereit (`.github/workflows/deploy.yml`). Die Vite-`base` setzt der
Workflow auf den Repository-Pfad, damit Service Worker und Manifest ihre Dateien
finden.

**Einmalig nötig:** Repository → *Settings* → *Pages* → als Quelle
**GitHub Actions** wählen. Der Workflow kann das nicht selbst erledigen; sein
Token darf die Seite nicht anlegen. Danach genügt ein Push.

Die Adresse lautet `https://<konto>.github.io/<repository>/`.

Die Adresse lautet danach `https://<konto>.github.io/<repository>/`.

## Aufbau

```
src/
  core/          App-Shell, Navigation, Theme, Dexie, Modul-Registry,
                 gemeinsame Bausteine, Zustandsprofil, Sitzungsgerüst
  modules/
    dream/       Traumjournal, Register, Traumwelt-Karte, Reality Checks
    obe/         Außerkörperliche Erfahrung
    inner/       drei Praktiken, Anteile, IFS-Landkarte
    mindspark/   Gedankenspeicher, Journal, Ziele
    training/    Trainingslog mit Vorlagen
    project/     Umfeld, Termine, Klienten
    adventures/  Dream Adventures (Tafel von 2024)
    _template/   Vorlage für neue Module (nicht angemeldet)
```

Ein Modul beschreibt sich vollständig selbst — Tabellen, Kategorien, Wege,
Werkzeuge — und meldet sich in `src/modules/index.ts` an. **Kein Modul erfordert
Änderungen am Kern.**

## Dokumente

| Datei | Inhalt |
|---|---|
| `FEATURES.md` | was die App kann — das Pflichtenheft |
| `KONZEPT.md` | Haltung und Architekturgedanke |
| `CLAUDE.md` | Arbeitsweise und Konventionen |
| `SETUP.md` | Einrichtung, Cloud- und lokaler Weg |
| `URSPRUNGSNOTIZEN.md` | die Handschrift-Skizze von 2024 |
| `design-reference/prototype.html` | der verbindliche Prototyp |
