# CLAUDE.md — Lucid Gateway

## Projekt

Janniks persönliche PWA mit vier Bereichen: **Luzides Träumen** (inkl. OBE),
**Innenwelt** (Meditation, Aktive Imagination, IFS-Anteile), **MindSpark** (Wachwelt,
Training, Ziele) und **Mixed Martial Mindset** (Coaching-Projekt mit Klienten).

**Vor jeder Arbeit lesen:**
1. `FEATURES.md` — was die App kann (Pflichtenheft)
2. `KONZEPT.md` — Haltung und Architekturgedanke
3. `design-reference/prototype.html` — **der verbindliche Prototyp**, vollständig
   durchklickbar. Bei Widersprüchen gilt der Prototyp.

---

## Nicht verhandelbar

1. **Beobachtung statt Bewertung.** Fortschrittsanzeigen zeigen Datenlage, nicht Können.
   Keine Abhak-Logik für Fähigkeiten — einzige Ausnahme ist *Dream Adventures*, und die
   ist bewusst abgetrennt.

2. **Techniken sind Hypothesen.** Nie als Anweisung oder Wahrheit formulieren.

3. **Kein Modell aufzwingen.** Wo Kategorien angeboten werden (IFS-Rollen, Beziehungsarten),
   müssen eigene ergänzbar sein. Bei den Big Five gilt: kein Wert ist besser; die Richtung
   wird pro Person vereinbart und die Bewertung erfolgt **relativ zu dieser Richtung**.

4. **Ein Eingabeort, viele Ansichten.** Niemals zwei Wege für dieselbe Information.
   Register, Karten und Bilanzen entstehen aus vorhandenen Daten.

5. **Eine Karte, eine Frage.** Die vier Landkarten nutzen dieselben Kanäle mit
   unterschiedlicher Bedeutung. Nie eine Karte um weitere Objektarten erweitern —
   dafür eine neue bauen. Die Legende steht immer darunter.

6. **Modularität.** Jeder Bereich ist ein Modul unter `src/modules/`, das sich beim Kern
   registriert. Neue Module dürfen NIEMALS Umbauten am Kern erfordern.

7. **Local-first.** Alles liegt lokal (Dexie/IndexedDB), auch Bilder. Keine Accounts,
   keine Cloud. JSON-Export/Import mit Bildern ist Pflicht.

8. **Morgens-halb-wach-Test.** Ein Traumeintrag muss in unter 60 Sekunden mit einem
   Daumen im Bett gelingen. Nur der Inhalt ist Pflicht, alles andere einklappbar.

9. **Papier ist gleichwertig.** Der Scan-Modus ersetzt den Fließtext; Traumzeichen,
   Luzidität und Zustandsprofil werden trotzdem eingetippt. Tippen darf nie als der
   „richtige" Weg erscheinen.

10. **Schutz in der Klientenarbeit.** Kürzel statt vollem Namen, Beobachtung statt
    Deutung, Einverständnis bei Minderjährigen, Hinweis auf die Grenze zwischen Coaching
    und Therapie. Klientendaten sind strikt von den eigenen getrennt.

11. **Nicht-pharmakologisch.** Kein Substanz-Tracking, keine Dosierungen.

---

## Tech-Stack

- React + Vite + TypeScript, PWA (installierbar, offlinefähig)
- Dexie.js für IndexedDB, Bilder als komprimierte Blobs (max. Kante ~2000 px)
- Kein Backend, keine externen APIs
- Web Push für Reality Checks (nur nach Homescreen-Installation — freundlich erklären)
- Deployment: GitHub Actions → GitHub Pages

**Farben (Dark Mode):** Hintergrund `#0C1018`, Karten `#141A28`, Linien `#242D42`,
Text `#EDEEF3`, Sekundär `#8B93A7`. Kategoriefarben: Traum `#8B7CF6`, MindSpark `#F0A75A`,
Innenwelt `#E08BB8`, Projekt `#E5544B`, OBE `#5EC9B4`, Stützpunkt `#E8734A`.
Typografie: System-Sans für UI, **Georgia** für Überschriften und Zitate,
Handschrift-Font ausschließlich in Dream Adventures.

---

## Konventionen

- UI-Sprache **Deutsch**; Code, Kommentare, Commits Englisch (conventional commits)
- Modulstruktur: `src/modules/<name>/` mit `index.ts` (Registrierung), `components/`,
  `db.ts`, `types.ts`
- Wiederkehrende Bausteine als Komponenten, nicht kopieren:
  Kachelraster · Statistikzeile · Icon-Text-Pfeil-Zeile · Chips · Regler mit Wertanzeige ·
  Aufklapper · Wertebalken · Radar · Dialog · Formular-Renderer aus Schema-Objekten
- Farben und Abstände als Design-Tokens, keine Literale im Komponentencode
- Formulare aus Schema-Objekten rendern (im Prototyp bei Sitzungen und Umfeld bewährt)
- Kleine, thematische Commits; nach jeder Phase zusammenfassen und testen
- Ideen, die nicht zur aktuellen Phase gehören → Ideen-Parkplatz, nicht spontan einbauen
- Bei Konflikten zwischen Wunsch und Konzept: nachfragen statt improvisieren

---

## Aus dem Prototyp gelernt

Zwei Fehlerklassen sind dort mehrfach aufgetreten. In React sollten sie nicht mehr
vorkommen — falls doch, ist etwas grundsätzlich falsch:

1. **Bildschirme, die nach einer Änderung nicht neu aufgebaut wurden.** In React löst das
   der State; niemals manuell zwischen „anzeigen" und „neu aufbauen" unterscheiden.
2. **Doppelt vergebene Element-IDs.** Durch Komponenten-Kapselung gelöst; keine globalen
   IDs verwenden.

**Beispieldaten entfernen.** Der Prototyp enthält Demo-Einträge, einen Demo-Klienten (ES)
und ein vorbefülltes Umfeld. Die echte App startet leer — die Leerzustände sind im
Prototyp bereits formuliert und sollten übernommen werden.

---

## Aktueller Stand

- [x] Phase 0 — Fundament (Setup, Theme, Nav, Dexie, Modul-Registry, Export, Deployment) — 29.08.2026
- [x] Phase 1 — Dashboard, Kategorien, Journal, Archiv, Bearbeiten/Löschen, Dialoge — 29.08.2026
- [x] Phase 2 — Zustandsprofil, Register, Traumwelt-Karte, Stützpunkt, Verknüpfungen — 29.08.2026
- [x] Phase 3 — Papier-Modus (auf dem Handy testen) — 29.08.2026, Kamera noch nicht am Gerät geprüft
- [x] Phase 4 — OBE-Bereich — 29.08.2026
- [ ] Phase 5 — Innenwelt und IFS-Landkarte
- [ ] Phase 6 — Trainingslog
- [ ] Phase 7 — Projekt: Umfeld, Termine, Klienten
- [ ] Phase 8 — Ziele, Gedankenspeicher
- [ ] Phase 9 — Reality Checks mit Push
- [ ] Phase 10 — Dream Adventures

*(Nach jeder Phase abhaken und Datum notieren.)*
