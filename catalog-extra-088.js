(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const work = {
    id: "G-088",
    sequence: 88,
    title: "Tänzerin und stehende Figur – Bewegungsstudie",
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
      "Figuren- und Bewegungsstudie: im Hintergrund eine weibliche Tänzerin mit seitlich ausgestrecktem Bein; im Vordergrund eine stehende, vom Rücken bzw. schräg hinten gesehene Figur.",
      "Ausgeführt mit kräftiger schwarzer Kohle bzw. Kreide in schneller, reduzierter Linienführung.",
      "Papier/Karton mit deutlichen alters- und lagerungsbedingten Randbeschädigungen, Einrissen, Knicken und kleineren Fehlstellen."
    ],
    catalogText: "G-088 – Tänzerin und stehende Figur – Bewegungsstudie\n\nStudienarbeit von Karin Karow aus ihrer Zeit an der Universität. Das Blatt verbindet zwei Figurenstudien: Im oberen Bereich ist eine weibliche Tänzerin bzw. Ballettfigur mit seitlich ausgestrecktem Bein dargestellt; davor steht eine zweite Figur in Rücken- bzw. Dreiviertelansicht. Die Zeichnung konzentriert sich auf Haltung, Bewegung und die wesentlichen Körperkonturen und ist mit kräftiger schwarzer Kohle bzw. Kreide auf Papier/Karton ausgeführt. Unten rechts befindet sich die handschriftliche Signatur „Karin Karow“. Maß 60 × 48 cm, ungerahmt. Das Papier zeigt deutliche alters- und lagerungsbedingte Randbeschädigungen, Einrisse, Knicke und kleinere Fehlstellen. Als dokumentierte studentische Studienarbeit wird ein vorläufiger Privatverkaufswert von etwa 60–140 € angesetzt.",
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
