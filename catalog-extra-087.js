(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const work = {
    id: "G-087",
    sequence: 87,
    title: "Weibliche Figurenstudie",
    artist: "Karin Karow",
    technique: "Kohle bzw. schwarze Kreide auf Papier/Karton",
    dating: "Studienzeit an der Universität; genaue Datierung noch offen",
    dimensions: "60 × 48 cm",
    framedDimensions: "",
    value: "ca. 60–140 €",
    status: "katalogisiert",
    userNotes: [
      "Maß 60 × 48 cm; ungerahmt.",
      "Künstlerin: Karin Karow.",
      "Nach Angabe aus ihrer Studienzeit an der Universität.",
      "Unten rechts handschriftlich signiert „Karin Karow“.",
      "Schwarz gezeichnete weibliche Halbfigur bzw. Figurenstudie mit gesenktem Kopf und aufgestützten Händen.",
      "Papier/Karton mit deutlichen Randbeschädigungen, Einrissen, Knicken und altersbedingten Gebrauchsspuren."
    ],
    catalogText: "G-087 – Weibliche Figurenstudie\n\nStudienarbeit von Karin Karow aus ihrer Zeit an der Universität. Das Blatt zeigt eine weibliche Figur in leicht vorgebeugter Haltung mit gesenktem Kopf und aufgestützten Händen. Die Darstellung ist mit kräftiger schwarzer Kohle bzw. Kreide in reduzierter, sicherer Linienführung angelegt; einzelne Partien bleiben bewusst skizzenhaft und konzentrieren sich auf Haltung, Kontur und Volumen. Unten rechts befindet sich die handschriftliche Signatur „Karin Karow“, die die überlieferte Künstlerzuordnung zusätzlich stützt. Maß 60 × 48 cm, ungerahmt. Das Papier bzw. der Karton zeigt deutliche alters- und lagerungsbedingte Randbeschädigungen, Einrisse, Knicke, Abrieb und kleinere Fehlstellen. Als dokumentierte studentische Studienarbeit wird ein vorläufiger Privatverkaufswert von etwa 60–140 € angesetzt.",
    images: [
      { src: "assets/g087-01.jpg", label: "Vorderseite – signierte Figurenstudie" }
    ]
  };

  const existing = catalog.works.find((entry) => entry.sequence === work.sequence || entry.id === work.id);
  if (existing) Object.assign(existing, work);
  else catalog.works.push(work);

  catalog.works.sort((a, b) => a.sequence - b.sequence);
  catalog.stats.works = catalog.works.length;
  catalog.stats.photos = catalog.works.reduce((sum, entry) => sum + (entry.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((entry) => entry.status === "katalogisiert").length;
})();
