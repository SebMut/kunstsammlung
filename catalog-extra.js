(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const extraWorks = [
    {
      id: "G-076",
      sequence: 76,
      title: "Parkszene mit grünen Bänken",
      artist: "Michael Vondrak / Vondrák (Signaturlesung; Identität noch nicht gesichert)",
      technique: "wahrscheinlich Aquarell und Gouache auf Papier/Karton",
      dating: "1958",
      dimensions: "55 × 75 cm",
      framedDimensions: "62,5 × 83 cm",
      value: "ca. 150–280 €",
      status: "katalogisiert",
      userNotes: [
        "Bildmaß 55 × 75 cm; mit Rahmen 62,5 × 83 cm.",
        "Rechts unten signiert bzw. bezeichnet: „MICHAEL VONDRAK 1958“ (Lesung nach den vorliegenden Fotos).",
        "Rückseitiges Rahmeretikett: VILLAGE PICTURE FRAMING SHOPPE · Prints · Artists Supplies · 2537 TIMES BLVD. · (ONE BLOCK SOUTH OF RICE BOULEVARD) · Call JACK K. HARDY · JA 4-4200."
      ],
      catalogText: "G-076 – Parkszene mit grünen Bänken\n\nHelle Park- bzw. Alleeszene mit hohen Bäumen in herbstlicher Färbung, grünen Bänken sowie einer niedrigen architektonischen Einfassung bzw. Balustrade. Das Blatt ist rechts unten nach dem Fotobefund mit „MICHAEL VONDRAK 1958“ signiert bzw. bezeichnet. Die genaue Identität des Künstlers ist bislang nicht sicher belegt; die Namenslesung wird daher als vorläufig geführt. Technik nach dem fotografischen Eindruck wahrscheinlich Aquarell mit deckenden Gouache-Partien auf Papier oder Karton. Bildmaß 55 × 75 cm, Außenmaß mit Rahmen 62,5 × 83 cm. Schlichter goldfarbener Holzrahmen. Rückseitig befindet sich ein Etikett der „VILLAGE PICTURE FRAMING SHOPPE“, 2537 Times Blvd., mit dem Namen Jack K. Hardy und der Telefonnummer JA 4-4200. Nach den Fotos insgesamt ordentlich erhalten; leichte altersbedingte Verschmutzungen sowie Gebrauchsspuren an Rahmen und Rückwand. Solange die Künstleridentität nicht gesichert ist, wird das Werk als signiertes Original auf Papier aus dem Jahr 1958 eingeordnet. Vorläufiger Auktionswert ca. 80–180 €, realistischer Privatverkaufswert ca. 150–280 €, sinnvoller Angebotspreis etwa 250–320 € VB. Eine belastbare Identifizierung von Michael Vondrak / Vondrák kann eine Neubewertung erforderlich machen.",
      images: [
        { src: "assets/artworks/work-076-01.jpeg?v=2", width: 800, height: 600 },
        { src: "assets/artworks/work-076-02.jpeg?v=2", width: 800, height: 600 },
        { src: "assets/artworks/work-076-03.jpeg?v=2", width: 675, height: 900 },
        { src: "assets/artworks/work-076-04.jpeg?v=2", width: 800, height: 600 }
      ]
    }
  ];

  for (const work of extraWorks) {
    const existing = catalog.works.find((entry) => entry.sequence === work.sequence || entry.id === work.id);
    if (existing) Object.assign(existing, work);
    else catalog.works.push(work);
  }

  catalog.works.sort((a, b) => a.sequence - b.sequence);
  catalog.stats.works = catalog.works.length;
  catalog.stats.photos = catalog.works.reduce((sum, work) => sum + (work.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((work) => work.status === "katalogisiert").length;
})();
