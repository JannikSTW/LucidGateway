# Lucid Gateway — Feature-Spezifikation

*Stand: August 2026 · Grundlage ist der Prototyp `design-reference/prototype.html` (47 Screens)*

Dieses Dokument beschreibt **was** die App kann. Vision und Haltung stehen in `KONZEPT.md`,
Arbeitsweise und Konventionen in `CLAUDE.md`, Einrichtung in `SETUP.md`.

> **Der Prototyp ist die Referenz.** Bei Widersprüchen zwischen diesem Text und dem Prototyp
> gilt der Prototyp. Er ist vollständig durchklickbar und funktionsfähig (Daten nur im Speicher).

---

## 1. Grundaufbau

### Navigation
Feste Leiste unten mit fünf Plätzen, immer sichtbar (nicht mitscrollend):

| Platz | Ziel |
|---|---|
| Haus | Dashboard |
| Archiv | alle Einträge, kategorieübergreifend |
| **Großes Plus (erhoben)** | Schnelleintrag + Kategorieauswahl |
| Raster | Kategorien |
| Regler | App-Einstellungen |

### Dashboard
- **Rollende Wochenübersicht**: sieben Tage, heute in der Mitte, drei Tage zurück und drei voraus.
  Pro Tag vier Segmente (Traum, MindSpark, Innenwelt, Projekt), gefüllt in Kategoriefarbe.
  Zukunftstage gestrichelt; geplante Termine erscheinen als Umriss statt gefüllt.
  Tippen auf einen Tag zeigt, was an dem Tag erfasst wurde.
- **Vier Kategoriekacheln** mit Eintragszahl
- **Werkzeuge**: Archiv, Reality Checks

### Vier Kategorien
| Schlüssel | Name | Farbe | Charakter |
|---|---|---|---|
| `ld` | Luzides Träumen | Violett `#8B7CF6` | Nachtwelt, Forschung |
| `ms` | MindSpark | Bernstein `#F0A75A` | Wachwelt, Alltag |
| `ai` | Innenwelt | Rosé `#E08BB8` | Innenarbeit |
| `mmm` | Mixed Martial Mindset | Rot `#E5544B` | Projekt & Klienten |

`obe` (Außerkörperliche Erfahrung) ist eine **Unterkategorie** von `ld` — eigene Farbe
Türkis `#5EC9B4`, erscheint nicht auf dem Dashboard, zählt dort auf den Traum-Slot.

Jede Kategorie hat: Statistikzeile, Kachelraster (2 Spalten), Liste der letzten Einträge.

---

## 2. Luzides Träumen (`ld`)

Kacheln: Traumjournal · Außerkörperlich · Traumwelt · Reality Checks · Dream Adventures

### 2.1 Traumjournal
Formular mit:
- **Titel**
- **Eingabekanal-Umschalter: Tippen / Tagebuch scannen.** Im Scan-Modus werden Fotos
  der handschriftlichen Seite angehängt (bis 4), plus optionale Stichworte. Der Scan
  ersetzt den Fließtext — Metadaten werden trotzdem eingetippt.
- Zwei Textblöcke (im Prototyp aus dem Legacy-Vorbild: Traumbericht / Zusatznotizen)
- **Luzidität 0–5** mit Klartext je Stufe („Nicht luzide" … „Volle Klarheit")
- **Aufklapper Orte / Gestalten / Traumzeichen** — Chips aus dem Register, „+ Neu" legt an
- **Aufklapper Zustandsprofil** — fünf Regler 0–10:
  Klarheit, Zeitwahrnehmung, Körpergefühl, Emotionale Färbung, Ich-Grenzen

Keine Marker/Tags im Traumjournal (bewusst entfernt; die Register erfüllen die Aufgabe).

### 2.2 Außerkörperliche Erfahrung (`obe`)
Eigener grüner Bereich mit Statistik (Sitzungen, gelöst, Meilensteine).

**Sitzungsformular** mit Timer (Voreinstellungen 20/30/45/60 Min):
Ausgangslage · Methode (Spontan, **Hemi-Sync / Gateway**, WILD, Rope, Phasing, Atem) ·
**Focus-Level** (10/12/15/21 mit Kurzbeschreibung) · Audio/Track · Körperhaltung · Vorlauf ·
Intention · Versuche · Übergangsphänomene (Mehrfachauswahl) · Ablösungsgrad 0–5 ·
Erlebnisbericht · Umgebung · Rückkehr · Nachwirkung · Regler Angst↔Ruhe ·
**Zustandsprofil** (dieselben fünf Dimensionen wie im Traum) ·
Freitext „Was war anders als in einem luziden Traum?"

**Bereichsauswertungen:**
- **Meilensteine** — sieben „erste Male" (Vibrationen, Schlafparalyse bewusst durchlaufen,
  teilweise gelöst, Raum verlassen, stabil bewegt, bewusst zurückgekehrt, zweimal in einer
  Nacht). Antippen setzt das Datum.
- **Methoden-Bilanz** — durchschnittlicher Ablösungsgrad je Methode, berechnet
- **Traum ↔ OBE im Vergleich** — Mittelwerte beider Zustandsprofile als überlagerte Radar-
  Formen plus Differenz je Dimension

### 2.3 Traumwelt (Register & Karte)
**Karte:** Netzwerk aus Ko-Vorkommen. Knoten = Orte, Gestalten, Traumzeichen mit eigenen
Symbolen (Bergsilhouette / Silhouette / Mondsichel). Zwei Knoten sind verbunden, wenn sie
im selben Traum vorkamen; Linie dicker bei häufigerem gemeinsamen Auftreten. Häufige
Elemente rücken nach innen.

**Stützpunkt:** Jeder Ort kann zum Stützpunkt erklärt werden (z. B. die eigene Wohnung).
Er rutscht ins Zentrum, bekommt Haus-Symbol in Terrakotta `#E8734A`, und alle anderen
Elemente ordnen sich in vier Ringen nach **Häufigkeit des gemeinsamen Auftretens mit dem
Stützpunkt** an. Es gibt maximal einen.

**Manuelle Verknüpfungen** zwischen Elementen mit fünf Arten, je eigene Farbe:
ist Teil von · führt zu · taucht auf mit · steht im Gegensatz zu · verwandelt sich in.
Auf der Karte durchgezogen (automatische Ko-Vorkommen gestrichelt).

**Drei Register** (Orte, Gestalten, Traumzeichen): Liste nach Häufigkeit, Detailseite mit
Zähler, Notizfeld und allen verknüpften Einträgen.

**Verbindungen** (eigener Bereich): frei formulierte Thesen über Zusammenhänge, mit
Bezug auf beliebige Registerelemente und Konfidenz (Vermutet / Mehrfach gesehen /
Ziemlich sicher).

### 2.4 Reality Checks
- Ein-/Ausschalter mit Statuszeile
- **Vorschau einer Push-Mitteilung** mit zufällig gewählter aktiver Frage
- **Frei verwaltbare Fragen** (anlegen, bearbeiten, pausieren, löschen). Fünf vorbelegt.
- Häufigkeit (1/2/3/5/8 pro Tag), Zeitfenster (7–23, 9–21, 12–20, nur abends)
- Auslöser: zufällig im Zeitfenster · an Traumzeichen gekoppelt (nennt das häufigste beim Namen)
- Hinweis: Push funktioniert erst nach Installation auf dem Startbildschirm

### 2.5 Dream Adventures
Hommage an den handschriftlichen Skill-Tree von 2024, **bewusst abgekapselt** mit eigener
Optik (Kreide auf Tafel, Handschrift-Font, bleibt auch im Light Mode dunkel).

- **Interaktiver Baum** der Originaltafel: 25 Knoten mit eigenen Icons, gelbe Awareness-Säule,
  grüne Traumgedächtnis-Säule, FLM als Eintrittspunkt, Verzweigungen bis „OBE → Project Gateway".
  Jeder Knoten hat eine Detailseite mit Erklärung, Herkunftsvermerk und Anschlussknoten.
- **Zweiter Baum** Dream Skills (Matter Manipulation / Mobility / Body Manipulation)
- **Challenges** zum Abhaken (der einzige Ort in der App mit Abhak-Logik)
- **Ränge** (Lucid Bird → Dream Artist → Dream Alchemist → Time Lord → Dream Architekt)
- **Real World Applications** als Textkarte
- Fußnote: „Was du hier abhakst, ist deine eigene Schatzkarte und fließt nicht in deine
  Journal-Auswertung ein."

---

## 3. Innenwelt (`ai`)

Kacheln: drei Praktiken + Landkarte. Statistik: Sitzungen, Minuten gesamt, Ø Dauer.

### 3.1 Drei Sitzungsformulare, je mit Timer
Timer: große Uhr, Zielvorgaben zum Antippen, Start/Pause/Weiter/Zurücksetzen, wird grün
bei Zielerreichung. Die gelaufene Zeit wandert automatisch in den Eintrag.

| Praxis | Felder |
|---|---|
| **Aktive Imagination / Visualisierung** | Modus (folgen/gestalten) · Ausgangsbild · Verlauf & Dialog · Regler *Geführt ↔ Eigendynamik* · Lebendigkeit 0–5 · Integration |
| **Breathwork** | Technik (Kohärenz, Box, 4-7-8, Wechsel, Intensiv) · Rhythmus · Runden · Zustand vorher→nachher · Körperliche Reaktionen · Notiz |
| **Freie Meditation** | Haltung · Ankerpunkt · Verlauf · Tiefe 0–5 · Störungen · Nachklang |

Alle drei haben zusätzlich **„Wer hat sich gezeigt?"** — Chips aus dem Anteils-Register.

Bei Breathwork steht ein Sicherheitshinweis für intensive Techniken (nie im Wasser, nie
im Stehen, nicht bei Herz-Kreislauf-Problemen).

### 3.2 Landkarte der Anteile (IFS)
Getrennt vom Traumregister — eigene Datenbasis.

**Aufbau:** Selbst im Zentrum, gestrichelter Ring „Alltags-Ich" bei Abstand ≤ 2.
- **Abstand zum Selbst** stufenlos 0–10 mit Klartext:
  vermischt → ansprechbar → auf Abstand → verschlossen
- **Sektor = Rolle**, dynamisch aus den tatsächlich verwendeten Rollen gebildet.
  Fünf Vorschläge (Beschützer, Feuerwehr, Verletzt/Jung, Antreiber, Wächter),
  **eigene Rollen frei anlegbar**, jede bekommt automatisch eine Farbe.
  Anteile ohne Rolle bekommen einen eigenen Sektor.
- **Größe** = wie oft aufgetaucht · **Füllung** = profiliert oder nicht

**Anteils-Profil:** Rolle · Abstand · Was tut er · Wovor schützt er (positive Absicht) ·
Auslöser · Körperempfinden · gefühltes Alter. Bei Rollen mit „verletzt/jung/exil" erscheint
automatisch der Hinweis, dass hier Coaching endet und Therapie beginnt.

**Beziehungen zwischen Anteilen** — vier Arten mit eigener Farbe:
schützt (gerichtet, Pfeil) · steht im Konflikt mit (gestrichelt) · arbeitet zusammen mit ·
löst aus (gerichtet). Auf der Karte als gebogene Linien. Bei der Gegenseite erscheint
„wird geschützt von". Unter der Karte Liste plus Hinweis „N Konflikte — meist der Grund
für innere Zerrissenheit."

---

## 4. MindSpark (`ms`) — die Wachwelt

Warme Farbwelt. Kacheln: Gedankenspeicher · Journal · Trainingslog · Ziele.

### 4.1 Gedankenspeicher
Schnelleintrag über den großen Plus-Button: **ein Textfeld, ein Tap**, kein Titel, keine
Kategorie. Gesammelte Gedanken lassen sich später per Chip zu **→ Journal** oder
**→ Projekt** befördern (wird dann zum vollwertigen Eintrag).

### 4.2 Persönliches Journal
Zwei Textblöcke: „Gedanke & Beobachtung" / „Einordnung & nächster Schritt", plus Marker.

### 4.3 Trainingslog
Eigener Bereich, **nur eigenes Training** (Coaching gehört ins Projekt).

- Statistik: Einheiten, Stunden, Ø RPE
- Rollende Wochenleiste, **ein Punkt pro Tag** in der Farbe der trainierten Disziplin
  (bei mehreren Einheiten „+1" als Vermerk)
- Vier Disziplinen mit eigenen Icons: **Kraft & Calisthenics** (Bernstein) ·
  **MMA** (Rot, unterteilt in *Jugendhaus* und *German Top Team*) ·
  **Mobility** (Grün) · **Ausdauer** (Blau)
- Jede Einheit anklickbar mit Detailansicht

**Krafttraining mit Vorlagen** (Balkon-Gym: Turm mit Klimmzugstange, Dipstangen,
Beinheber-Polster, Liegestützgriffe, Ab Wheel, Hanteln bis 16 kg, Sandbag 30 kg):
- Fünf Vorlagen: Zug & Grip · Druck & Core · Beine & Explosivität · Skills · Griffkraft
- **Vorlagen sind bearbeitbar** (Übungen, Sätze, Ziel, Typ), plus „Freies Training" ohne Vorlage
- Beim Durchführen wird die Vorlage **kopiert** — spätere Änderungen wirken nicht rückwirkend
- Eingabefelder passen sich der Übungsart an:
  Eigengewicht → Wdh + optional Zusatzgewicht · Mit Gewicht → kg + Wdh · Auf Zeit → Sekunden
- **„Zuletzt"-Anzeige** je Übung aus der letzten Einheit
- Übungen überspringbar, spontan ergänzbar

### 4.4 Ziele
Vier Zeithorizonte: **Lebensziel · Mehrjährig · Dieses Jahr · Alltag**.
Lebensziele stehen als **„Nordstern"** oben, groß und in Serifenschrift, nicht in den Listen.

Vier Status: offen · dran · erreicht · **losgelassen** (bewusst kein „verworfen").
Bei „erreicht" wird automatisch das Datum gesetzt.

Pro Ziel: Titel · Horizont · Lebensbereich · **Warum** („Der Grund trägt länger als das Ziel") ·
Nächster Schritt · Notizen. Filter: Aktiv / Alle / Erreicht / Losgelassen.

---

## 5. Mixed Martial Mindset (`mmm`) — Projekt & Klienten

Rot-weiße Farbwelt. Oben die Karte **„Als Nächstes"** mit dem nächsten Termin.
Kacheln: Umfeld · Projektnotizen · Termine · Klienten.

### 5.1 Umfeld
Alles, was das Projekt trägt — als **ein Objekttyp** mit sechs Arten in drei Gruppen:

| Gruppe | Arten |
|---|---|
| **Ressourcen** | Ort/Raum · Dokument · Material |
| **Institutionen & Personen** | Institution · Person |
| **Qualifikationen** | Qualifikation |

Jede Art hat eigene Felder (Ort: Verfügbarkeit/Kosten/Kapazität; Dokument: Art/Stand/
Ablageort; Person: Funktion/Organisation/Kontakt usw.), dazu überall **Nächster Schritt**
und Notizen.

**Karte:** M3 im Zentrum, Sektor = Gruppe, **Entfernung = Vernetzungsgrad** (stark
verknüpfte Elemente sitzen nah am Kern), roter Punkt bei offenem Schritt, Linien =
Verknüpfungen (gehört zu · arbeitet bei · braucht · Alternative zu).

**Übersicht zeigt:** Statistik der drei Gruppen · Karte · **Offene Schritte** (alle
„Nächster Schritt"-Einträge gesammelt — die eigentliche To-do-Liste) · **Termine im Umfeld**.
Die vollständige Liste liegt auf einem eigenen Screen mit Filtern.

### 5.2 Termine
Art (Einzelsession, Erstgespräch, Orga, Sonstiges) · Titel · **Bezug zu Klient oder
Umfeld-Element** · Datum · Uhrzeit · Notiz. Abhaken verschiebt in „Erledigt".
Kalenderblatt-Darstellung, „Als Nächstes"-Karte auf mehreren Screens.

### 5.3 Klienten
**Anlegen:** Kürzel oder Vorname · Altersgruppe (unter 14 / 14–17 / 18+) · bei
Minderjährigen automatisch Hinweis und Feld zum **Einverständnis der Erziehungsberechtigten** ·
Anlass · erstes Ziel · **Big-Five-Ausgangsmessung** · **Richtung je Dimension** (↓ senken,
– halten, ↑ steigern).

> Zur Big-Five-Richtung: Kein Wert ist besser als ein anderer. Sinkende Verträglichkeit kann
> genau das Ziel sein („Nein sagen können"). Deshalb wird jede Veränderung **relativ zur
> vereinbarten Richtung** bewertet — grün bei Bewegung dorthin, rot dagegen, grau bei „halten".

**Klientenseite:** Statistik · nächster Termin (oder Warnung „Kein Folgetermin geplant") ·
Anlass · **Ziele** mit Status zum Durchtippen (offen → in Arbeit → erreicht) ·
**Big-Five-Verlauf** (Radar mit Ausgangsmessung rot gestrichelt und aktuellem Stand grün,
plus Balken mit Delta) · Verlauf der Sitzungen als kompakte Zeilen mit Mini-Radar.

**Sitzungsprotokoll** — vier Abschnitte mit gedämpfter Farbcodierung:
1. **Beratung** (grün) — Dauer & Verfassung bei Ankunft · Thema · Gespräch
2. **Kampfsport** (rot) — Schwerpunkt (Fitness/Technik/Koordination) · Training & Beobachtung
3. **Big Five** — fünf Regler
4. **Abschluss** (ocker) — Übertrag & Vereinbarung · „Für mich" (eigene Reflexion)

> Der **Übertrag** ist das Kernstück: Was auf der Matte sichtbar wurde und mit dem Thema
> zusammenhängt (Aufgeben unter Druck, Ausweichen, Überkompensieren, Durchhalten).

Protokolle sind anklickbar und vollständig lesbar; leere Abschnitte werden ausgelassen.

---

## 6. Übergreifende Funktionen

### Archiv
Volltextsuche über Titel, beide Textblöcke und Tags, kombinierbar mit Kategoriefiltern.

### Bearbeiten & Löschen
Überall vorhanden: Journal-Einträge (Bearbeiten öffnet das Formular vorbefüllt),
Trainingseinheiten, Klienten und Protokolle, Termine, Gedanken, Ziele, Umfeld-Elemente,
Register-Elemente, Anteile, alle Arten von Verknüpfungen.
**Löschen räumt Abhängigkeiten auf** (Stützpunkt, Verknüpfungen, Beziehungen, Protokolle).

### Dialoge
Eigenes Dialogsystem im App-Stil für Texteingaben und Löschbestätigungen — **keine
Browser-`prompt()`/`confirm()`**.

### Einstellungen
Dark/Light Mode · Reality Checks · JSON-Export/Import (im Prototyp Platzhalter) · Über.

### Light Mode
Kräftigere, dunklere Akzentfarben als im Dark Mode, warmer Hintergrund, übersetzte
Farbwelten je Bereich. **Dream Adventures bleibt eine Kreidetafel.**

---

## 7. Datenmodell (Zielbild für die Umsetzung)

Im Prototyp liegen alle Daten in Arrays im Arbeitsspeicher. Für die echte App:
**IndexedDB via Dexie**, local-first, Bilder als komprimierte Blobs.

```
Entry            id, cat(ld|obe|ai|ms|mmm), title, date, iso, day,
                 b1, b2, scale, tags[], paper, scans[], els{ort[],person[],zeichen[]},
                 prof{kl,ze,ko,em,ic}, parts[], med{method,dur,vals{}}
RegItem          register(ort|person|zeichen), name, count, note
DreamLink        a{reg,name}, b{reg,name}, type
Anchor           genau einer, verweist auf einen Ort
Verbindung       text, refs[], konfidenz
Part             name, count, note, part{role, dist(0–10), does, protects, trigger, body, age}
PartLink         a, b, type(schuetzt|konflikt|zusammen|loest)
Thought          text, date, iso, day
Training         disc(kraft|mma|mob|aus), venue?, focus, dur, rpe, detail, feel,
                 ex[{n,s,r,t,kg,reps,done,skip}], template?, iso, date, day
Template         key, name, ex[{n,s,r,t}]
Ziel             t, hor(leben|mehr|jahr|alltag), area, why, next, note,
                 status(offen|dran|erreicht|los), done
NetzItem         kind(ort|doc|mat|person|org|qual), name, d{}, next, note
NetzLink         a, b, type
Termin           title, kind, cid?, nid?, date, time, note, done, day
Client           name, age, consent?, reason, goals[{text,status}],
                 big5base{o,c,e,a,s}, b5dir{o,c,e,a,s}, since
ClientSession    cid, dur, mood, focus, topic, talk, train, bridge, self,
                 big5{o,c,e,a,s}, iso, date
RcCheck          text, on   (+ Konfiguration: aktiv, Häufigkeit, Zeitfenster)
ObeMilestone     key → Datum
```

---

## 8. Gestaltung

**Dark Mode (Standard):** Hintergrund `#0C1018`, Karten `#141A28`, Linien `#242D42`,
Text `#EDEEF3`, Sekundärtext `#8B93A7`.

**Bausteine, die überall wiederkehren:** Kachelraster (2 Spalten, Icon + Titel + Zeile),
Statistikzeile (drei Boxen), Zeilen mit Icon/Text/Pfeil, Chips, Regler mit Wertanzeige,
Aufklapper, Wertebalken, Radar-Grafiken, gestufte Segmentleisten.

**Typografie:** System-Sans für UI, **Georgia** für Überschriften und Zitate
(Feldnotizbuch-Charakter), Handschrift-Font ausschließlich in Dream Adventures.

**Formsprache der Karten:** Alle vier Landkarten (Traumwelt, Innenwelt, Umfeld,
Zustandsprofil/Big Five) nutzen dieselben Prinzipien — Zentrum, Sektoren, Entfernung als
Bedeutung, Größe als Häufigkeit. Bedeutungen unterscheiden sich je Karte und stehen
immer als Legende darunter.

---

## 9. Umsetzungsreihenfolge

| Phase | Inhalt |
|---|---|
| **0** | Projekt-Setup (React + Vite + TS, PWA), Theme, Bottom-Nav, Dexie, Modul-Registry, JSON-Export, GitHub-Pages-Deployment |
| **1** | Dashboard, Kategoriegerüst, Journal-Formular (`ld`, `ms`, `mmm`), Archiv mit Suche, Bearbeiten/Löschen, Dialogsystem |
| **2** | Zustandsprofil, Register (Orte/Gestalten/Zeichen), Traumwelt-Karte, Stützpunkt, Verknüpfungen |
| **3** | Papier-Modus (Kamera, Komprimierung, Thumbnails) — **auf dem Handy testen** |
| **4** | OBE-Bereich mit Timer, Meilensteinen, Methoden-Bilanz, Vergleich |
| **5** | Innenwelt: drei Sitzungsformulare mit Timer, Anteile, IFS-Landkarte, Beziehungen |
| **6** | Trainingslog mit Vorlagen und Zuletzt-Werten |
| **7** | Projekt: Umfeld, Termine, Klienten mit Protokoll und Big Five |
| **8** | Ziele, Gedankenspeicher |
| **9** | Reality Checks mit echten Push-Benachrichtigungen |
| **10** | Dream Adventures |

Dream Adventures bewusst zuletzt: schön, aber nicht nötig für den täglichen Gebrauch.

---

## 10. Was beim Übertragen wichtig ist

**Der Prototyp ist eine einzige HTML-Datei mit globalen Funktionen.** Das ist für einen
Prototyp richtig und für die App falsch. Beim Übertragen:

- Wiederkehrende Bausteine als Komponenten extrahieren, nicht kopieren
- Farben und Abstände als zentrale Design-Tokens, nicht als Literale
- Jede Kategorie und jeder Unterbereich als eigenes Modul unter `src/modules/`
- Formulare aus Schema-Objekten rendern (wie im Prototyp bei Sitzungen und Umfeld) —
  das hat sich bewährt und macht neue Felder billig

**Beispieldaten entfernen.** Der Prototyp enthält Demo-Einträge, einen Demo-Klienten (ES)
und ein vorbefülltes Umfeld. In der echten App startet alles leer — die Leerzustände sind
im Prototyp bereits formuliert und sollten übernommen werden.

**Zwei Fehlerklassen, die im Prototyp mehrfach aufgetreten sind** und in React nicht
mehr vorkommen sollten:
1. Bildschirme, die nach einer Änderung nicht neu aufgebaut wurden (in React löst der
   State das)
2. Doppelt vergebene Element-IDs (in React durch Komponenten-Kapselung gelöst)
