(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const work = {
    id: "G-081",
    sequence: 81,
    title: "America 1586 – Fantasiekarte der Amerikas",
    artist: "Anonym; dekorative historische Fantasiekarte",
    technique: "kolorierter Druck / Reproduktionsgrafik auf Papier",
    dating: "wohl um 1900; aufgedruckte Jahreszahl 1586 bezieht sich auf das dargestellte Kartenbild",
    dimensions: "",
    framedDimensions: "65 × 50,5 cm",
    value: "ca. 80–180 €",
    status: "katalogisiert",
    userNotes: [
      "Rahmenmaß 65 × 50,5 cm.",
      "Unten rechts bezeichnet: AMERICA 1586.",
      "Links Porträts mit den Bezeichnungen CHRISTOPHORVS COLVMBVS und REYNA YSABEL.",
      "Zusätzlich dargestellt: Segelschiff, Landungsszene sowie eine reich illustrierte Karte Nord- und Südamerikas.",
      "Die Jahreszahl 1586 ist nicht als Herstellungsdatum des vorliegenden Blatts zu verstehen.",
      "Vergleichbare Exemplare werden im Fachhandel als anonyme Fantasiekarte um 1900 beschrieben."
    ],
    catalogText: "G-081 – America 1586 – Fantasiekarte der Amerikas\n\nDekorative kolorierte Karte von Nord- und Südamerika mit Porträts von Christoph Kolumbus und Königin Isabella, Segelschiff, Landungsszene und zahlreichen historisierenden geografischen sowie zoologischen Details. Unten rechts trägt das Blatt die Bezeichnung „AMERICA 1586“. Diese Jahreszahl ist jedoch nicht als Herstellungsdatum des vorliegenden Drucks zu verstehen. Ein nahezu identisches Blatt ist im spezialisierten Kartenhandel als anonyme „America 1586 [Fantasy Map]“ dokumentiert und wird dort in die Zeit um 1900 datiert; ausdrücklich wird es als künstlerische Fantasiekarte beschrieben, deren Projektion an frühe neuzeitliche Karten erinnert. Auch ein brasilianischer Museumsbestand verzeichnet eine farbige Druckfassung „América 1586“ mit Kolumbus und Königin Isabella und weist auf eine mögliche Kopie eines Originals hin. Das vorliegende Exemplar ist daher als historisierende Reproduktions- bzw. Fantasiekarte, wahrscheinlich um 1900 oder frühes 20. Jahrhundert, einzuordnen und nicht als Originalkarte von 1586. Außenmaß mit Rahmen 65 × 50,5 cm. Nach den Fotos insgesamt dekorativ erhalten, mit altersbedingter Tönung, leichten Flecken und Gebrauchsspuren an Rahmen und Rückwand. Für ein älteres Exemplar um 1900 erscheint ein vorläufiger realistischer Privatverkaufswert von etwa 80–180 € plausibel; moderne Nachdrucke liegen deutlich niedriger. Ein höherer Wert wäre nur bei einem nachweislich frühen, seltenen Druck mit gesicherter Provenienz zu begründen.",
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
