(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const work = {
    id: "G-089",
    sequence: 89,
    title: "Regenszene mit Motorradfahrer",
    artist: "Karin Karow",
    technique: "Tusche, Pinselzeichnung und Lavierung auf Papier",
    dating: "Studienzeit an der Universität; genaue Datierung noch offen",
    dimensions: "48 × 24 cm",
    framedDimensions: "",
    value: "ca. 80–180 €",
    status: "katalogisiert",
    userNotes: [
      "Maß 48 × 24 cm; ungerahmt.",
      "Künstlerin: Karin Karow.",
      "Nach Angabe aus ihrer Studienzeit an der Universität.",
      "Schwarz-graue städtische Regenszene mit Motorrad-/Rollerfahrer und mehreren Passanten unter Regenschirmen.",
      "Ausgeführt mit schwarzer Tusche, Pinselzeichnung und grauen Lavierungen auf stärkerem Zeichen- bzw. Aquarellpapier.",
      "Rückseite mit schwachen Bleistiftspuren/Notizen; keine sicher lesbare zusätzliche Beschriftung.",
      "Papier mit altersbedingten Stockflecken und Verfärbungen, insbesondere an den Rändern und auf der Rückseite."
    ],
    catalogText: "G-089 – Regenszene mit Motorradfahrer\n\nStudienarbeit von Karin Karow aus ihrer Zeit an der Universität. Das schmale Querformat zeigt eine städtische Regenszene: Im Zentrum beugt sich eine Person über ein Motorrad bzw. einen Roller, während sich im Hintergrund und seitlich mehrere Passanten mit Regenschirmen bewegen. Die Komposition ist mit kräftiger schwarzer Tusche und Pinselzeichnung angelegt und durch graue Lavierungen räumlich verdichtet. Die reduzierte Palette und die schnelle, illustrative Linienführung sprechen für eine akademische bzw. angewandt-grafische Studienarbeit. Maß 48 × 24 cm, ungerahmt. Das Papier zeigt altersbedingte Stockflecken, Verfärbungen und Gebrauchsspuren; auf der Rückseite befinden sich nur schwache, nicht sicher lesbare Bleistiftspuren. Vorläufiger Privatverkaufswert etwa 80–180 €.",
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
