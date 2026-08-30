(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;
  if (catalog.works.some((work) => work.sequence === 76)) return;

  catalog.works.push({
    id: "G-076",
    sequence: 76,
    title: "Parkszene mit grünen Bänken",
    artist: "wohl Michael Vondrak / Vondrák; Signatur nicht abschließend verifiziert",
    technique: "wahrscheinlich Aquarell und Gouache auf Papier/Karton",
    dating: "1958",
    dimensions: "55 × 75 cm",
    framedDimensions: "62,5 × 83 cm",
    value: "ca. 150–280 € Privatverkauf",
    userNotes: [
      "Maße ohne Rahmen: 55 × 75 cm; mit Rahmen: 62,5 × 83 cm.",
      "Rechts unten wohl signiert: „MICHAEL VONDRAK 1958“.",
      "Rückseitiges Etikett: Village Picture Framing Shoppe, 2537 Times Blvd., one block south of Rice Boulevard; Call Jack K. Hardy, JA 4-4200."
    ],
    catalogText: "G-076 – Parkszene mit grünen Bänken\n\nHelle Park- bzw. Alleeszene mit hohen Bäumen in herbstlicher Färbung, Balustraden bzw. niedrigen Einfassungen und mehreren grünen Bänken. Rechts unten befindet sich eine gut sichtbare Beschriftung, die auf den vorhandenen Fotos am ehesten als „MICHAEL VONDRAK 1958“ zu lesen ist. Die Künstleridentifikation ist damit ein belastbarer Rechercheansatz, aber noch nicht abschließend kunsthistorisch verifiziert. Technik nach Fotobefund wahrscheinlich Aquarell mit Gouache bzw. deckenden Farbpartien auf Papier oder Karton. Bildmaß 55 × 75 cm, Rahmenmaß 62,5 × 83 cm. Die rückseitige Abdeckung trägt ein Etikett des „Village Picture Framing Shoppe“, 2537 Times Blvd., mit dem Namen Jack K. Hardy und der Telefonnummer JA 4-4200. Der Rahmen und die Rückwand zeigen altersübliche Gebrauchsspuren. Für ein signiertes Original auf Papier aus den 1950er Jahren ohne gesicherte Künstlerbiografie wird der realistische Privatverkaufswert vorläufig mit etwa 150–280 € angesetzt; Auktionswert ungefähr 80–180 €. Bei bestätigter Identifizierung des Künstlers ist eine Neubewertung sinnvoll.",
    status: "katalogisiert",
    images: [
      { src: "assets/artworks/work-076-01.jpeg", width: 225, height: 300 },
      { src: "assets/artworks/work-076-02.jpeg", width: 225, height: 300 },
      { src: "assets/artworks/work-076-03.jpeg", width: 225, height: 300 },
      { src: "assets/artworks/work-076-04.jpeg", width: 135, height: 180 }
    ]
  });

  catalog.stats.works = catalog.works.length;
  catalog.stats.photos = catalog.works.reduce((sum, work) => sum + (work.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((work) => work.status === "katalogisiert").length;
})();
