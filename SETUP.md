# Setup & Start — Lucid Gateway

Es gibt zwei Wege. **Weg A (Cloud)** braucht keinerlei lokale Installation und ist der
aktuell gewählte. **Weg B (lokal)** lohnt sich später auf dem neuen Laptop.

---

# WEG A — Entwicklung in der Cloud (Claude Code on the web)

Sessions laufen in einer isolierten, von Anthropic verwalteten VM. Voraussetzung ist
ein Pro- oder Max-Abo und ein verbundenes GitHub-Konto, damit die Sandbox das
Repository klonen kann. Cloud-Sessions teilen sich das Nutzungskontingent mit allen
anderen Claude-Code-Sessions.

## A1. GitHub vorbereiten
1. Konto auf github.com anlegen
2. Neues Repository `lucid-gateway`, Sichtbarkeit **Private**, mit README initialisieren
3. Über „Add file → Upload files" hochladen:
   - `FEATURES.md`, `KONZEPT.md`, `CLAUDE.md`, `SETUP.md`, `URSPRUNGSNOTIZEN.md`
   - Ordner `design-reference/` mit `prototype.html` (der fertige Prototyp),
     `legacy-ui.html` und den alten Prototyp-Screenshots
4. „Commit changes"

## A2. Claude Code on the web verbinden
1. `claude.com/code` öffnen, mit Anthropic-Konto anmelden
2. GitHub-Konto verbinden, Repository `lucid-gateway` auswählen
3. **Netzwerk-Konfiguration:** npm-Domains freigeben (u. a. `registry.npmjs.org`),
   sonst können keine Pakete installiert werden

## A3. Arbeitsweise
- Pro Session **eine Roadmap-Phase** (Prompts siehe unten)
- Ergebnis kommt als **Pull Request** mit Zusammenfassung
- PR-Diff lesen → mergen → nächste Phase
- Steuern ist jederzeit möglich, auch während die Session läuft

## A4. Testen auf dem Handy — GitHub Pages
In der Cloud gibt es keinen lokalen Dev-Server, den das Handy erreichen kann.
Deshalb schon in Phase 0 einrichten lassen:

> Richte zusätzlich einen GitHub-Actions-Workflow ein, der bei jedem Push auf `main`
> die PWA baut und auf GitHub Pages veröffentlicht. Achte darauf, dass die Vite-`base`
> korrekt auf den Repository-Pfad zeigt und der Service Worker darunter funktioniert.

Ergebnis: feste HTTPS-URL, auf dem Handy im Browser öffnen → „Zum Startbildschirm
hinzufügen". HTTPS ist Pflicht für PWA-Installation, Kamera-Zugriff (Tagebuch-Scans)
und Push-Benachrichtigungen (Reality Checks). Alle Daten bleiben lokal im
Browser-Speicher des Geräts — auf dem Server liegt nur der Code.

Bei privatem Repo ist GitHub Pages je nach Plan eingeschränkt. Alternativen mit
kostenlosem Tier: Netlify oder Cloudflare Pages, beide direkt an GitHub anbindbar.
Falls das hakt: Repo öffentlich machen — im Code stehen keine persönlichen Daten.

---

# WEG B — Lokale Entwicklung (später, neuer Laptop)

## B1. Entwicklungsumgebung installieren

| Was | Warum | Hinweis |
|---|---|---|
| **Node.js LTS** | Basis für Vite/React | von nodejs.org, LTS-Version |
| **Git** | Versionierung, Sicherheitsnetz | bei der Installation „Git from the command line" wählen |
| **VS Code** | Editor | |
| **Claude Code Extension** | Entwicklung | in VS Code: `Ctrl+Shift+X` → „Claude Code" → Publisher *Anthropic* → Install → mit Anthropic-Konto anmelden |

Kurz prüfen im Terminal: `node -v` und `git -v` müssen Versionen ausgeben.

Einmalig Git konfigurieren:
```bash
git config --global user.name "Jannik"
git config --global user.email "deine@mail.de"
```

---

## B2. Projektordner anlegen

```
lucid-gateway/
├── CLAUDE.md                      ← Projektgedächtnis
├── KONZEPT.md                     ← Konzept v2.0
├── SETUP.md                       ← diese Datei
└── design-reference/
    ├── redesign.html              ← verbindlicher Referenzprototyp
    ├── legacy-ui.html             ← alte UI (historische Referenz)
    └── screenshots/               ← die 5 alten Prototyp-Screenshots
```

Ordner in VS Code öffnen (Datei → Ordner öffnen).

---

## B3. Repo klonen statt neu anlegen

Wenn du bereits über Weg A gearbeitet hast, holst du dir den Stand einfach:
```bash
git clone https://github.com/<dein-name>/lucid-gateway.git
cd lucid-gateway
npm install
npm run dev
```
Ab da ist beides parallel nutzbar: lokal am Laptop, in der Cloud vom Handy oder
unterwegs. Dasselbe Repo, derselbe Stand.

---

# PROMPTS (für beide Wege gleich)

## Session 1 — Phase 0 (Fundament)

Claude Code öffnen, **Plan-Modus** aktivieren (bei Architekturarbeit sinnvoll —
Claude beschreibt erst, was es vorhat, und wartet auf deine Freigabe).

Prompt:

> Lies CLAUDE.md und KONZEPT.md vollständig und öffne design-reference/prototype.html,
> bevor du irgendetwas baust.
>
> Setze Phase 0 der Roadmap um:
> 1. Git-Repository initialisieren, sinnvolle .gitignore
> 2. Projekt-Setup: React + Vite + TypeScript, PWA-fähig (installierbar, offlinefähig)
> 3. Theme aus dem Referenzprototyp übernehmen (Nachtblau, Violett, Feldfarben,
>    Georgia für Titel) als zentrale CSS-Variablen
> 4. App-Shell mit der 5-teiligen Bottom-Nav aus dem Prototyp
>    (Zurück · Heute · erhobener Erfassen-Button · Felder · Erkenntnisse)
> 5. Dexie-Setup mit Schema-Versionierung, sodass Module später eigene Tabellen
>    ergänzen können
> 6. Modul-Registry im Kern: Module registrieren sich mit Name, Icon, Farbe, Route
> 7. JSON-Export/Import der gesamten Datenbank inkl. Blobs
> 8. Ein Dummy-Modul als Beispiel für den Modulaufbau
>
> 9. Einen GitHub-Actions-Workflow, der bei Push auf `main` die PWA baut und auf
>    GitHub Pages veröffentlicht (Vite-`base` auf den Repo-Pfad setzen)
>
> Baue noch KEINE inhaltlichen Features (keine Sessions, kein Traumjournal).
> Erkläre mir am Ende, unter welcher URL die App erreichbar ist und wie ich sie auf
> dem Handy auf den Startbildschirm lege, und aktualisiere „Aktueller Stand" in
> CLAUDE.md.

---

## Folgesessions

Pro Session **eine Phase**. Immer mit demselben Muster starten:

> Lies CLAUDE.md und den passenden Abschnitt in FEATURES.md. Setze Phase <N> um.
> Halte dich an design-reference/prototype.html — bei Widersprüchen gilt der Prototyp. Aktualisiere am Ende den Stand
> in CLAUDE.md und mache einen Commit.

Nach Phase 3 (Papier-Scans) unbedingt auf dem Handy testen — Kamera-Zugriff und
Bildkomprimierung lassen sich am Desktop nur eingeschränkt prüfen.

## Arbeitsgewohnheiten, die sich lohnen

- **Nach jeder Phase committen.** Dann kannst du nichts kaputtmachen.
- **Diffs wirklich lesen**, bevor du sie annimmst — so lernst du den Code mit.
- **Erst testen, dann weiter.** Eine ungetestete Phase 2 macht Phase 3 zur Fehlersuche.
- **Ideen parken.** Alles, was dir zwischendurch einfällt, kommt in den
  Ideen-Parkplatz am Ende von KONZEPT.md — nicht in die laufende Phase.
- **Bei Konzeptänderungen: erst KONZEPT.md aktualisieren, dann bauen.** Das Dokument
  ist die Quelle der Wahrheit, nicht der Chatverlauf.
