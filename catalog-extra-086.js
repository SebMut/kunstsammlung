(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const work = {
    id: "G-086",
    sequence: 86,
    title: "Vati frißt es ja so gerne – Plakatstudie",
    artist: "Karin Karow",
    technique: "Gouache/Deckfarbe und Zeichnung auf Papier/Karton; Plakat- bzw. Werbestudie",
    dating: "Studienzeit an der Universität; genaue Datierung noch offen",
    dimensions: "60 × 48 cm",
    framedDimensions: "",
    value: "ca. 80–180 €",
    status: "katalogisiert",
    userNotes: [
      "Maß 60 × 48 cm; ungerahmt.",
      "Künstlerin: Karin Karow.",
      "Nach Angabe aus ihrer Studienzeit an der Universität.",
      "Farbig ausgeführte Plakat-/Werbestudie mit humoristisch überzeichneter männlicher Figur am Esstisch.",
      "Text im unteren Bildteil: „Vati frißt es ja so gerne“ sowie „Das weltbekannte preiswerte argentinische Mastochsen-Fleisch“.",
      "Das Blatt zeigt sichtbare alters- und lagerungsbedingte Randbeschädigungen, kleine Fehlstellen, Knicke und Gebrauchsspuren."
    ],
    catalogText: "G-086 – Vati frißt es ja so gerne – Plakatstudie\n\nStudienarbeit von Karin Karow aus ihrer Universitätszeit. Das Blatt ist als farbig ausgeführte Werbe- bzw. Plakatstudie angelegt und zeigt eine humoristisch-karikierende männliche Figur am Esstisch. Die Darstellung kombiniert kräftige Gouache- bzw. Deckfarbenmalerei mit zeichnerischen Details und typografischer Gestaltung. Im unteren Bereich stehen die Texte „Vati frißt es ja so gerne“ und „Das weltbekannte preiswerte argentinische Mastochsen-Fleisch“. Die Arbeit ist als studentische Gestaltungs- und Illustrationsübung zu verstehen und wird ausdrücklich nicht als kommerziell veröffentlichtes Werbeplakat katalogisiert. Maß 60 × 48 cm, ungerahmt. Der Papier-/Kartonträger zeigt alters- und lagerungsbedingte Randbeschädigungen, kleinere Fehlstellen, Knicke und Gebrauchsspuren. Vorläufiger Privatverkaufswert etwa 80–180 €, wobei die dokumentierte Provenienz als Studienarbeit von Karin Karow für die Einordnung wichtiger ist als ein rein dekorativer Marktvergleich.",
    images: []
  };

  const existing = catalog.works.find((entry) => entry.sequence === work.sequence || entry.id === work.id);
  if (existing) Object.assign(existing, work);
  else catalog.works.push(work);

  catalog.works.sort((a, b) => a.sequence - b.sequence);
  catalog.stats.works = catalog.works.length;
  catalog.stats.photos = catalog.works.reduce((sum, entry) => sum + (entry.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((entry) => entry.status === "katalogisiert").length;
})();
