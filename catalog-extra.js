(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const extraWorks = [
    {
      id: "G-076", sequence: 76, title: "Parkszene mit grünen Bänken",
      artist: "Michael Vondrak / Vondrák (Signaturlesung; Identität noch nicht gesichert)",
      technique: "wahrscheinlich Aquarell und Gouache auf Papier/Karton", dating: "1958",
      dimensions: "55 × 75 cm", framedDimensions: "62,5 × 83 cm", value: "ca. 150–280 €", status: "katalogisiert",
      userNotes: ["Bildmaß 55 × 75 cm; mit Rahmen 62,5 × 83 cm.", "Rechts unten signiert bzw. bezeichnet: „MICHAEL VONDRAK 1958“ (Lesung nach den vorliegenden Fotos).", "Rückseitiges Rahmeretikett: VILLAGE PICTURE FRAMING SHOPPE · Prints · Artists Supplies · 2537 TIMES BLVD. · Call JACK K. HARDY · JA 4-4200."],
      catalogText: "G-076 – Parkszene mit grünen Bänken\n\nHelle Park- bzw. Alleeszene mit hohen Bäumen in herbstlicher Färbung, grünen Bänken sowie einer niedrigen architektonischen Einfassung bzw. Balustrade. Das Blatt ist rechts unten nach dem Fotobefund mit „MICHAEL VONDRAK 1958“ signiert bzw. bezeichnet. Die genaue Identität des Künstlers ist bislang nicht sicher belegt; die Namenslesung wird daher als vorläufig geführt. Technik nach dem fotografischen Eindruck wahrscheinlich Aquarell mit deckenden Gouache-Partien auf Papier oder Karton. Bildmaß 55 × 75 cm, Außenmaß mit Rahmen 62,5 × 83 cm. Rückseitig Etikett der Village Picture Framing Shoppe, 2537 Times Blvd. Vorläufiger Privatverkaufswert ca. 150–280 €.",
      images: [{ src: "assets/artworks/work-076-01.jpeg?v=2", width: 800, height: 600 }, { src: "assets/artworks/work-076-02.jpeg?v=2", width: 800, height: 600 }, { src: "assets/artworks/work-076-03.jpeg?v=2", width: 675, height: 900 }, { src: "assets/artworks/work-076-04.jpeg?v=2", width: 800, height: 600 }]
    },
    {
      id: "G-077", sequence: 77, title: "Winterliches Bergdorf mit Kirche",
      artist: "Nicht sicher identifiziert; handsigniert",
      technique: "farbige Druckgrafik, vermutlich Radierung/Aquatinta oder vergleichbares Tiefdruckverfahren", dating: "20. Jahrhundert",
      dimensions: "51 × 58,5 cm", framedDimensions: "54 × 61,5 cm", value: "ca. 50–120 €", status: "katalogisiert",
      userNotes: ["Bildmaß 51 × 58,5 cm; mit Rahmen 54 × 61,5 cm.", "Winterliche Ortsansicht mit Kirche und Bergkulisse.", "Unter dem Bild handsigniert; Künstlername auf den vorhandenen Fotos nicht sicher lesbar.", "Links unten nummeriert 140/250; limitierte Auflage von 250 Exemplaren.", "Deutliche altersbedingte Braun- und Stockflecken im Papier/Passepartout."],
      catalogText: "G-077 – Winterliches Bergdorf mit Kirche\n\nGerahmte farbige Druckgrafik mit winterlicher Dorfansicht, zentraler Kirche, Häusergruppe und Bergkulisse. Links unten ist das Blatt mit 140/250 nummeriert und damit als Exemplar einer limitierten Auflage von 250 ausgewiesen. Rechts unten befindet sich eine handschriftliche Signatur, deren Lesung anhand der vorhandenen Detailaufnahme nicht sicher genug für eine Künstlerzuschreibung ist. Technik vermutlich Radierung/Aquatinta oder ein verwandtes grafisches Druckverfahren. Bildmaß 51 × 58,5 cm, Rahmenmaß 54 × 61,5 cm. Papier und Randbereiche zeigen deutlich sichtbare altersbedingte Braun- bzw. Stockflecken. Vorläufiger Marktwert ohne gesicherte Künstleridentifikation ca. 50–120 €; bei erfolgreicher Identifizierung neu zu bewerten.",
      images: []
    },
    {
      id: "G-078", sequence: 78, title: "Britische Postkutsche mit Reisenden",
      artist: "Nicht identifiziert",
      technique: "kolorierte Druckgrafik, vermutlich Lithografie oder Stahl-/Kupferstich nach älterer Vorlage", dating: "wahrscheinlich 19. Jahrhundert oder spätere historische Reproduktion",
      dimensions: "", framedDimensions: "64,5 × 53 cm", value: "ca. 50–120 €", status: "katalogisiert",
      userNotes: ["Rahmenmaß 64,5 × 53 cm.", "Darstellung einer vierspännigen britischen Post-/Reisekutsche mit zahlreichen Passagieren.", "Auf dem Wagen sind die Ortsnamen EDINBURGH, GLASGOW, MANCHESTER und LONDON lesbar.", "Dunkler Holzrahmen; rückseitige ältere Papierabdeckung ohne sichtbares Etikett.", "Keine eindeutige Künstler- oder Verlegerangabe auf den vorliegenden Aufnahmen erkennbar."],
      catalogText: "G-078 – Britische Postkutsche mit Reisenden\n\nKolorierte historische Druckgrafik mit einer vierspännigen britischen Post- bzw. Reisekutsche und zahlreichen elegant gekleideten Passagieren. Auf dem Wagen sind die Städtenamen Edinburgh, Glasgow, Manchester und London zu erkennen. Die Darstellung steht motivisch in der Tradition britischer Coaching- und Mail-Coach-Drucke des 19. Jahrhunderts. Nach dem Fotobefund handelt es sich nicht um ein Gemälde, sondern um eine Druckgrafik; das genaue Verfahren ist ohne Untersuchung außerhalb des Rahmens nicht sicher feststellbar, wahrscheinlich Lithografie oder ein kolorierter Stahl-/Kupferstich beziehungsweise eine spätere Reproduktion nach einer älteren Vorlage. Eine gesicherte Künstler- oder Verlegerangabe ist auf den vorliegenden Fotos nicht erkennbar. Außenmaß des dunklen Holzrahmens 64,5 × 53 cm. Das Blatt zeigt altersbedingte Verfärbungen, Flecken und allgemeine Gebrauchsspuren; die rückseitige Papierabdeckung ist ebenfalls gealtert. Vorläufiger Marktwert ohne gesicherte Zuschreibung ca. 50–120 €; ein nachweislich früher Originalabzug des 19. Jahrhunderts könnte höher zu bewerten sein.",
      images: []
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
