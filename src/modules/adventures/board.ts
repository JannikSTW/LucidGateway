/**
 * Die Tafel von 2024, Knoten für Knoten aus dem Prototyp übernommen.
 * Erzeugt mit scripts/extract-adventures.mjs — von Hand abtippen wäre eine
 * Fehlerquelle, und die Originalnotizen sollen unverändert bleiben.
 */

export interface AdvNode {
  x: number
  y: number
  ic: string
  lb: string
  col: string
  kind: string
  tx: string
}

/** Spaltenmitten der Tafel. */
export const L = 58
export const C = 177
export const R = 296

/** Icon-Pfade der Knoten. */
export const NODE_ICONS: Record<string, string> = {
  info: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 11.5v5.5M12 7.4v.1\"/>",
  prep: "<path d=\"M4 6h9M4 12h9M4 18h6\"/><path d=\"M16 15.5l2 2 4-4.5\"/>",
  sleep: "<path d=\"M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a9 9 0 1 0 11 11Z\"/><path d=\"M3 4h4L3 8h4\"/>",
  flm: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1\"/>",
  rc: "<path d=\"M8 12.5V6.8a1.5 1.5 0 0 1 3 0v4M11 10.2a1.5 1.5 0 0 1 3 0v1.8M14 11.2a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5 5 5 0 0 1-3.9-1.9L5 15.2c-.7-.9.5-2.2 1.4-1.4Z\"/>",
  mild: "<circle cx=\"11\" cy=\"13.5\" r=\"2.6\"/><path d=\"M18.5 13.5a7.5 7.5 0 1 1-7.5-7.5\"/><path d=\"M15.5 3l3.2 2.7-3.2 2.7\"/>",
  wild: "<path d=\"M2.5 12h12\"/><path d=\"M11 8l4 4-4 4\"/><path d=\"M20 5.5a8 8 0 0 0 0 13\"/>",
  dild: "<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><path d=\"M13.4 6.6 9 13h4l-1.6 5\"/>",
  auto: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 4.2a7.8 7.8 0 1 1-7.6 9.4\"/><path d=\"M11.6 1.4 14.4 4l-2.8 2.6\"/>",
  ttb: "<path d=\"M5 4.5h10.5A2.5 2.5 0 0 1 18 7v12.5H7.5A2.5 2.5 0 0 1 5 17Z\"/><path d=\"M9 9h5M9 13h5\"/>",
  details: "<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"M15.4 15.4 21 21\"/><path d=\"M8 10.5h5\"/>",
  handlung: "<path d=\"M3.5 17c2.5-7 5 3.5 7.5-3s5 4.5 9.5-.5\"/><circle cx=\"3.5\" cy=\"17\" r=\"1.4\"/><circle cx=\"20.5\" cy=\"13.5\" r=\"1.4\"/>",
  signs: "<path d=\"M12 3.5v17M3.5 12h17M6.2 6.2l11.6 11.6M17.8 6.2 6.2 17.8\"/>",
  manip: "<path d=\"M6.5 20.5A6 6 0 0 1 16 15.8\"/><circle cx=\"16.5\" cy=\"7.5\" r=\"2.2\"/><path d=\"M16.5 2.4v2M16.5 10.6v2M11.4 7.5h2M19.6 7.5h2\"/>",
  scene: "<rect x=\"2.5\" y=\"4.5\" width=\"12\" height=\"10\" rx=\"1.6\"/><rect x=\"9.5\" y=\"9.5\" width=\"12\" height=\"10\" rx=\"1.6\"/>",
  chars: "<circle cx=\"8\" cy=\"7.5\" r=\"2.6\"/><circle cx=\"16\" cy=\"7.5\" r=\"2.6\"/><path d=\"M3.4 19c.5-3 2.3-4.6 4.6-4.6S12.1 16 12.6 19M11.4 19c.5-3 2.3-4.6 4.6-4.6S20.1 16 20.6 19\"/>",
  sensory: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M6.6 6.6a7.8 7.8 0 0 0 0 10.8M17.4 6.6a7.8 7.8 0 0 1 0 10.8\"/><path d=\"M3.2 3.2a12.5 12.5 0 0 0 0 17.6M20.8 3.2a12.5 12.5 0 0 1 0 17.6\"/>",
  story: "<rect x=\"2.5\" y=\"5\" width=\"19\" height=\"14\" rx=\"2\"/><path d=\"M7 5v14M17 5v14M2.5 12h19\"/>",
  control: "<circle cx=\"12\" cy=\"12\" r=\"6.2\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4\"/>",
  expand: "<circle cx=\"12\" cy=\"12\" r=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>",
  backdrop: "<path d=\"M3.5 4h17\"/><path d=\"M6.5 4c0 6-2 9-2.5 15M17.5 4c0 6 2 9 2.5 15M12 4v15\"/>",
  entities: "<circle cx=\"10.5\" cy=\"9\" r=\"3\"/><path d=\"M4.5 20c0-3.3 2.7-6 6-6s6 2.7 6 6\"/><path d=\"M19 3l.9 2 2 .9-2 .9L19 9l-.9-2.1-2-.9 2-.9Z\"/>",
  time: "<circle cx=\"11.5\" cy=\"12.5\" r=\"8.2\"/><path d=\"M11.5 7.5v5l3.4 2\"/><path d=\"M18 2.5 21 5l-3 2.5\"/>",
  higher: "<circle cx=\"12\" cy=\"14\" r=\"2.8\"/><path d=\"M6.5 21.5c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2\"/><ellipse cx=\"12\" cy=\"5.5\" rx=\"5\" ry=\"1.8\"/><path d=\"M12 7.5v3\"/>",
  multidim: "<circle cx=\"12\" cy=\"12\" r=\"9\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"3.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"3.6\" ry=\"9\"/>",
  meditate: "<circle cx=\"12\" cy=\"12\" r=\"5.4\"/><ellipse cx=\"12\" cy=\"12\" rx=\"10.6\" ry=\"3.4\" transform=\"rotate(-25 12 12)\"/>",
  obe: "<path d=\"M2.5 19.5h9\"/><path d=\"M4.5 19.5v-1.8c0-1 .8-1.8 1.8-1.8h3\"/><circle cx=\"4\" cy=\"14\" r=\"1.6\"/><circle cx=\"16.5\" cy=\"6.5\" r=\"2.4\"/><path d=\"M16.5 9v12M13 12.5c0-1.9 1.6-3.4 3.5-3.4s3.5 1.5 3.5 3.4\"/><path d=\"M10.5 16c1.2-1.2 2.4-1.9 3.6-2.2\" stroke-dasharray=\"1.6 2\"/>",
  matter: "<path d=\"M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4Z\"/><path d=\"M12 12 20 7.4M12 12v9.2M12 12 4 7.4\"/>",
  people: "<circle cx=\"9\" cy=\"8\" r=\"2.8\"/><path d=\"M3.5 19.5c0-3 2.5-5.4 5.5-5.4s5.5 2.4 5.5 5.4\"/><path d=\"M16.5 9.5l1.6 1.6 3.4-3.6\"/>",
  actors: "<path d=\"M2.5 5.5h8.5v6a4.2 4.2 0 0 1-8.5 0Z\"/><path d=\"M13 8h8.5v6a4.2 4.2 0 0 1-8.5 0Z\"/>",
  mobility: "<path d=\"M12 21V4.5\"/><path d=\"M5.5 11 12 4.5 18.5 11\"/><path d=\"M8 17h8\"/>",
  fly: "<path d=\"M3 15.5c5.5-1 9.5-4.2 11.5-9.5 1 6.2 3 9.2 6.5 10.5-5.5 1-9.5 2.5-12.5 5.5-1-3.2-2.5-5.2-5.5-6.5Z\"/>",
  run: "<circle cx=\"16.5\" cy=\"5.5\" r=\"2.2\"/><path d=\"M6 20.5 10 15l3.5 2 3-5.5\"/><path d=\"M2.5 8.5H8M2.5 12.5H7\"/>",
  teleport: "<circle cx=\"12\" cy=\"12\" r=\"8.2\" stroke-dasharray=\"3 3\"/><path d=\"M8.5 12h6.5M12.5 8.8 15.8 12l-3.3 3.2\"/>",
  dimjump: "<ellipse cx=\"8.5\" cy=\"12\" rx=\"4\" ry=\"8.2\"/><ellipse cx=\"15.5\" cy=\"12\" rx=\"4\" ry=\"8.2\"/>",
  bodym: "<circle cx=\"12\" cy=\"4.6\" r=\"2.4\"/><path d=\"M12 7.4v8M7.5 10.5h9M9 21l3-5 3 5\"/>",
  sensor: "<circle cx=\"9.5\" cy=\"12\" r=\"3\"/><path d=\"M15 7.5a6.5 6.5 0 0 1 0 9M18 4.6a11 11 0 0 1 0 14.8\"/>",
  breath: "<path d=\"M12 3.5v7.5\"/><path d=\"M12 11c0 4.5-1.8 7-4.4 7S3.5 15.8 3.5 13 5.6 8.6 7.8 9.8\"/><path d=\"M12 11c0 4.5 1.8 7 4.4 7s4.1-2.2 4.1-5-2.1-4.4-4.3-3.2\"/>",
  emotion: "<path d=\"M12 20.5S4.5 15.8 4.5 10.6A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6c0 5.2-7.5 9.9-7.5 9.9Z\"/>",
  taste: "<path d=\"M12 6.5c1.8-3.2 8.5-3 8.5 3.2 0 5.2-4.2 10.8-8.5 10.8S3.5 14.9 3.5 9.7c0-6.2 6.7-6.4 8.5-3.2Z\"/><path d=\"M12 6.5V3\"/>",
  water: "<path d=\"M12 2.5s6.2 6.8 6.2 10.8a6.2 6.2 0 1 1-12.4 0C5.8 9.3 12 2.5 12 2.5Z\"/><path d=\"M9 14.5c1.2 1.6 3.8 1.6 5 0\"/>",
}

export const NODES: Record<string, AdvNode> = {
  prep: { x: 58, y: 6, ic: "prep", lb: "Prep", col: "", kind: "Vorbereitung", tx: "Alles, was vor dem Einschlafen passiert: Ablauf, Ruhe, Erwartung. Auf der Tafel stand das ganz oben — noch vor jeder Technik." },
  info: { x: 177, y: 6, ic: "info", lb: "INFO", col: "big", kind: "Ausgangspunkt", tx: "Der Kopf der Tafel. Wissen und Vorbereitung als Fundament, bevor irgendeine Technik greift." },
  sleep: { x: 296, y: 6, ic: "sleep", lb: "Sleep Optimization", col: "", kind: "Vorbereitung", tx: "Schlafqualität als Grundvoraussetzung. Ohne stabilen Schlaf keine REM-Dichte, ohne REM keine Träume zum Erinnern." },
  flm: { x: 177, y: 104, ic: "flm", lb: "FLM", col: "big", kind: "Eintrittspunkt", tx: "Der erste luzide Moment. Auf der Tafel der Punkt, an dem beide Säulen zusammenlaufen — Awareness von links, Traumgedächtnis von rechts. Die Doppelpfeile zeigen: Es geht in beide Richtungen." },
  rc: { x: 58, y: 200, ic: "rc", lb: "RC", col: "yel", kind: "Awareness", tx: "Reality Check. Die kritische Frage im Alltag verankern, bis sie in den Traum durchsickert. Entscheidend ist die Frage, nicht die Geste." },
  mild: { x: 58, y: 296, ic: "mild", lb: "MILD", col: "yel", kind: "Awareness", tx: "Intention beim Einschlafen setzen und die Traumszene visualisieren. Wirkt deutlich stärker in Kombination mit WBTB." },
  wild: { x: 58, y: 392, ic: "wild", lb: "WILD", col: "yel", kind: "Awareness", tx: "Bewusster Übergang vom Wachzustand direkt in den Traum. Fortgeschritten — hypnagoge Phänomene und Paralysegefühl sind harmlos, aber gut zu kennen." },
  dild: { x: 58, y: 488, ic: "dild", lb: "DILD", col: "yel", kind: "Awareness", tx: "Luzidität entsteht aus dem laufenden Traum heraus, meist ausgelöst durch ein Traumzeichen." },
  auto: { x: 58, y: 584, ic: "auto", lb: "Auto Detection", col: "yel", kind: "Awareness · Ziel", tx: "Das Erkennen geschieht von allein, ohne Technik. Der klügste Gedanke der ganzen Säule: Das Ziel ist eine Praxis, die sich selbst überflüssig macht." },
  ttb: { x: 296, y: 200, ic: "ttb", lb: "TTB", col: "grn", kind: "Traumgedächtnis", tx: "Traumtagebuch. Überhaupt erst festhalten — Fragmente zählen. Ohne Erinnerung keine Daten, ohne Daten keine Muster." },
  details: { x: 296, y: 296, ic: "details", lb: "Details", col: "grn", kind: "Traumgedächtnis", tx: "Mehr als das Gerüst erinnern: Farben, Stimmen, Gerüche, Temperatur. Erinnerungstiefe ist trainierbar." },
  strang: { x: 296, y: 392, ic: "handlung", lb: "Handlungs-stränge", col: "grn", kind: "Traumgedächtnis", tx: "Zusammenhängende Abläufe rekonstruieren statt loser Bilder. Der Traum bekommt eine Dramaturgie." },
  signs: { x: 296, y: 488, ic: "signs", lb: "Traumzeichen", col: "grn", kind: "Traumgedächtnis · Ziel", tx: "Aus der Sammlung die eigenen wiederkehrenden Muster ablesen. Auf der Tafel stehen Traumzeichen am Ende der Säule — sie sind das Ergebnis der Gedächtnisarbeit, nicht ihr Anfang." },
  manip: { x: 177, y: 200, ic: "manip", lb: "Manipulation", col: "", kind: "Traumkontrolle", tx: "Erste Einflussnahme auf Objekte. Rückblickend interessant: Es funktioniert eher über Erwartung als über Willenskraft." },
  scene: { x: 177, y: 296, ic: "scene", lb: "Szenenwechsel", col: "", kind: "Traumkontrolle", tx: "Die Umgebung als Ganzes tauschen. Kann stabilisieren — oder den Traum beenden." },
  chars: { x: 177, y: 392, ic: "chars", lb: "Dream Character Interaction", col: "", kind: "Traumkontrolle", tx: "Mit Traumfiguren in echten Austausch treten statt sie zu steuern. Von hier führt eine direkte Linie zum heutigen Dialog mit dem Unterbewusstsein." },
  sensory: { x: 177, y: 488, ic: "sensory", lb: "Full Sensory Manipulation", col: "", kind: "Traumkontrolle", tx: "Alle Sinne gestalten, nicht nur das Bild: Geräusch, Berührung, Geruch, Geschmack." },
  story: { x: 177, y: 584, ic: "story", lb: "Creating complete Stories", col: "", kind: "Traumkontrolle", tx: "Zusammenhängende Erzählungen über längere Zeit halten, ohne dass die Szene zerfällt." },
  fdc: { x: 177, y: 680, ic: "control", lb: "Full Dream Control", col: "big", kind: "Traumkontrolle", tx: "Die Spitze der mittleren Säule. Heute mit einem Augenzwinkern zu lesen: Der Traum lässt sich nicht unterwerfen — aber je besser man ihn versteht, desto mehr geht." },
  backdrop: { x: 58, y: 680, ic: "backdrop", lb: "Voluntary Backdrop", col: "", kind: "Verzweigung", tx: "Die Kulisse willentlich setzen: Wo will ich sein, wenn ich luzide werde?" },
  entities: { x: 296, y: 680, ic: "entities", lb: "Concious Entities", col: "", kind: "Verzweigung", tx: "Wesen erschaffen, die eigenständig handeln. Die Grenze zwischen Erschaffen und Begegnen wird hier unscharf." },
  meditate: { x: 58, y: 776, ic: "meditate", lb: "Deep Meditation", col: "", kind: "Vertiefung", tx: "Auf der Tafel mit einem kleinen Saturn daneben gezeichnet. Meditation im Traum als Zugang zu tieferen Zuständen." },
  expand: { x: 177, y: 776, ic: "expand", lb: "Expanding Consciousness", col: "big", kind: "Vertiefung", tx: "Der eigentliche Zielpunkt der Tafel. Nicht mehr Kontrolle, sondern Ausdehnung — der Punkt, an dem das System über das Träumen hinausweist." },
  time: { x: 296, y: 776, ic: "time", lb: "Time Manipulation", col: "", kind: "Verzweigung", tx: "Zeitwahrnehmung im Traum dehnen oder stauchen. Eine der auffälligsten Abweichungen vom Wachzustand." },
  multidim: { x: 58, y: 872, ic: "multidim", lb: "Multidim. Layers", col: "", kind: "Vertiefung", tx: "Multidimensional Layer Conciousness. Auf der Tafel mit Exploration und Trauma-Transzendenz verbunden." },
  obe: { x: 177, y: 872, ic: "obe", lb: "OBE → Project Gateway", col: "big", kind: "Vertiefung", tx: "Am Ende dieser Linie stand auf der Tafel „Project Gateway\" — hier taucht der Name des heutigen Projekts zum ersten Mal auf. Heute ist OBE eine eigene Journal-Kategorie." },
  higher: { x: 296, y: 872, ic: "higher", lb: "Higher Self meet", col: "", kind: "Vertiefung", tx: "Die Begegnung mit dem höheren Selbst. Auf der Tafel der persönlichste Knoten des ganzen Systems." },
}

export const EDGES: [string, string, string][] = [["prep","info","y"],["sleep","info","g"],["info","flm",""],["rc","mild","y"],["mild","wild","y"],["wild","dild","y"],["dild","auto","y"],["ttb","details","g"],["details","strang","g"],["strang","signs","g"],["flm","rc","y"],["flm","ttb","g"],["flm","manip",""],["manip","scene",""],["scene","chars",""],["chars","sensory",""],["sensory","story",""],["story","fdc",""],["fdc","backdrop",""],["fdc","entities",""],["fdc","expand",""],["entities","time",""],["time","higher",""],["expand","meditate",""],["expand","obe",""],["expand","multidim",""]]

export const SKILLS: Record<string, AdvNode> = {
  matter: { x: 58, y: 6, ic: "matter", lb: "Matter Manipulation", col: "big", kind: "Ast 1", tx: "Materie formen — der Einstieg in alle Manipulationsfähigkeiten." },
  sceneM: { x: 58, y: 102, ic: "scene", lb: "Scene Manipulation", col: "", kind: "Ast 1", tx: "Nicht mehr einzelne Dinge, sondern die ganze Umgebung umbauen." },
  peopleM: { x: 58, y: 198, ic: "people", lb: "People Manipulation", col: "", kind: "Ast 1", tx: "Traumfiguren beeinflussen. Heute würdest du sie eher fragen als formen." },
  actors: { x: 58, y: 294, ic: "actors", lb: "Concious Actors", col: "", kind: "Ast 1 · Ziel", tx: "Figuren, die von selbst handeln — der Punkt, an dem der Traum wieder das Ruder übernimmt." },
  mobility: { x: 177, y: 6, ic: "mobility", lb: "Mobility", col: "big", kind: "Ast 2", tx: "Fortbewegung im Traum, von Stufe zu Stufe größer gedacht." },
  fly: { x: 177, y: 102, ic: "fly", lb: "Flying", col: "", kind: "Ast 2", tx: "Der Klassiker. Gelingt oft besser, wenn man nicht darüber nachdenkt." },
  run: { x: 177, y: 198, ic: "run", lb: "Fast Running", col: "", kind: "Ast 2", tx: "Übermenschliches Tempo — die Umgebung muss mithalten können." },
  teleport: { x: 177, y: 294, ic: "teleport", lb: "Teleportation", col: "", kind: "Ast 2", tx: "Ortswechsel ohne Weg. Verwandt mit dem Szenenwechsel, nur aus Sicht des Träumers." },
  dimjump: { x: 177, y: 390, ic: "dimjump", lb: "Dimension Jumps", col: "", kind: "Ast 2 · Ziel", tx: "Sprünge zwischen Ebenen. Auf der Tafel der Übergang von Mobilität zu Bewusstseinserweiterung." },
  bodym: { x: 296, y: 6, ic: "bodym", lb: "Body Manipulation", col: "big", kind: "Ast 3", tx: "Nicht die Welt umbauen, sondern die eigene Wahrnehmung. Rückblickend der spannendste Ast." },
  sensor: { x: 296, y: 102, ic: "sensor", lb: "Sensor Input", col: "", kind: "Ast 3", tx: "Sinneseindrücke gezielt verstärken oder dämpfen." },
  breath: { x: 296, y: 198, ic: "breath", lb: "Breath Control", col: "", kind: "Ast 3", tx: "Die Atmung im Traum steuern — eine Brücke zwischen Traumkörper und echtem Körper." },
  emotionC: { x: 296, y: 294, ic: "emotion", lb: "Emotion Control", col: "", kind: "Ast 3", tx: "Gefühlszustände lenken. Da der Traum auf Emotion reagiert, ist das eigentlich die mächtigste Fähigkeit der Tafel." },
  taste: { x: 296, y: 390, ic: "taste", lb: "Taste", col: "", kind: "Ast 3", tx: "Geschmack erzeugen — verbunden mit der Apfel-Challenge." },
  water: { x: 296, y: 486, ic: "water", lb: "Wasseratmung", col: "", kind: "Ast 3 · Ziel", tx: "Unter Wasser atmen. Der Punkt, an dem die Körperregeln endgültig verhandelbar werden." },
}

export const SKILL_EDGES: [string, string][] = [["matter","sceneM"],["sceneM","peopleM"],["peopleM","actors"],["mobility","fly"],["fly","run"],["run","teleport"],["teleport","dimjump"],["bodym","sensor"],["sensor","breath"],["breath","emotionC"],["emotionC","taste"],["taste","water"]]

export const ALL_NODES: Record<string, AdvNode> = { ...NODES, ...SKILLS }

export interface Challenge {
  key: string
  t: string
  s: string
}

/** Der einzige Ort der App mit Abhak-Logik — bewusst abgetrennt. */
export const CHALLENGES: Challenge[] = [
  { key: "ch1", t: "Create a Control Station", s: "Ein Rückzugsort im Traum, zu dem du zurückkehren kannst." },
  { key: "ch2", t: "Meditate around Saturn", s: "Meditation im Weltraum." },
  { key: "ch3", t: "Create the Dream Gate", s: "Ein Tor erschaffen — führt es zur OBE? Offene Frage von damals." },
  { key: "ch4", t: "Create an Apple and take a bite", s: "Manifestation mit Geschmack." },
  { key: "ch5", t: "Go into your favorite movie", s: "In einen bekannten Film eintauchen." },
  { key: "ch6", t: "Face Your Fears", s: "Aus den Real World Applications: der Angst im Traum begegnen." },
]

export const RANKS: string[] = ["Lucid Bird","Dream Artist","Dream Alchemist","Time Lord","Dream Architekt"]

export const REAL_WORLD = [
  'Skill Learning',
  'Face Your Fears',
  'Tough Situations',
  'Problem Solving',
  'Public Speaking',
  'Leadership',
  'Dream Art',
  'Therapeutic Methods',
  'Dream Healing',
  'Conversing with your Dream Self',
  'Body/Mind Connection',
  'Physical Healing',
]
