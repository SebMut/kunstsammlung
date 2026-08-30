(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const works = [
    {
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
      catalogText: "G-081 – America 1586 – Fantasiekarte der Amerikas\n\nDekorative kolorierte Karte von Nord- und Südamerika mit Porträts von Christoph Kolumbus und Königin Isabella, Segelschiff, Landungsszene und zahlreichen historisierenden geografischen sowie zoologischen Details. Unten rechts trägt das Blatt die Bezeichnung „AMERICA 1586“. Diese Jahreszahl ist jedoch nicht als Herstellungsdatum des vorliegenden Drucks zu verstehen. Ein nahezu identisches Blatt ist im spezialisierten Kartenhandel als anonyme „America 1586 [Fantasy Map]“ dokumentiert und wird dort in die Zeit um 1900 datiert; ausdrücklich wird es als künstlerische Fantasiekarte beschrieben, deren Projektion an frühe neuzeitliche Karten erinnert. Das vorliegende Exemplar ist daher als historisierende Reproduktions- bzw. Fantasiekarte, wahrscheinlich um 1900 oder frühes 20. Jahrhundert, einzuordnen und nicht als Originalkarte von 1586. Außenmaß mit Rahmen 65 × 50,5 cm. Nach den Fotos insgesamt dekorativ erhalten, mit altersbedingter Tönung, leichten Flecken und Gebrauchsspuren an Rahmen und Rückwand. Für ein älteres Exemplar um 1900 erscheint ein vorläufiger realistischer Privatverkaufswert von etwa 80–180 € plausibel; moderne Nachdrucke liegen deutlich niedriger. Ein höherer Wert wäre nur bei einem nachweislich frühen, seltenen Druck mit gesicherter Provenienz zu begründen.",
      images: []
    },
    {
      id: "G-082",
      sequence: 82,
      title: "A New Map of ye Isthmus of Darien in America",
      artist: "nach Robert Morden / Herman Moll; historische Kartenvorlage",
      technique: "kolorierte kartografische Druckgrafik / spätere Reproduktion nach einer Karte des späten 17. Jahrhunderts",
      dating: "Vorlage 1690er Jahre; vorliegendes Blatt wahrscheinlich spätere Reproduktion, 20. Jahrhundert",
      dimensions: "",
      framedDimensions: "31,5 × 50 cm",
      value: "ca. 40–100 €",
      status: "katalogisiert",
      userNotes: [
        "Rahmenmaß 31,5 × 50 cm.",
        "Kartentitel: „a New Map of ye ISTHMUS of DARIEN in AMERICA. The Bay of PANAMA. The Gulph of VALLONA or St MICHAEL, with its ISLANDS & COUNTRIES Adjacent.“",
        "Darstellung des Isthmus von Darién/Panama mit Teilen von Costa Rica und dem heutigen Kolumbien, Windrose, Schiffen und dekorativer Grenzkolorierung.",
        "Historische Vorlage wurde 1690 von Robert Morden und William Hacke herausgegeben und von Herman Moll gestochen; spätere Ausgaben erschienen um 1699/1721.",
        "Die moderne Rahmung, gleichmäßige Papierwirkung und dekorative Kolorierung sprechen beim vorliegenden Exemplar eher für eine spätere Reproduktion als für einen Originalabzug des 17./18. Jahrhunderts."
      ],
      catalogText: "G-082 – A New Map of ye Isthmus of Darien in America\n\nGerahmte historische Kartendarstellung des Isthmus von Darién bzw. Panama mit Teilen von Costa Rica und dem heutigen Kolumbien. Der vollständige Kartentitel lautet „a New Map of ye ISTHMUS of DARIEN in AMERICA. The Bay of PANAMA. The Gulph of VALLONA or St MICHAEL, with its ISLANDS & COUNTRIES Adjacent.“ Die Karte zeigt zahlreiche Orts- und Landschaftsbezeichnungen, Schiffe, eine große Windrose und handkoloriert wirkende Grenzlinien. Die historische Vorlage ist bibliografisch gut dokumentiert: eine Ausgabe wurde 1690 von Robert Morden und William Hacke herausgegeben und von Herman Moll gestochen; weitere Fassungen erschienen gegen Ende des 17. bzw. zu Beginn des 18. Jahrhunderts. Das vorliegende Exemplar ist nach Fotobefund jedoch sehr wahrscheinlich kein früher Originalabzug, sondern eine spätere dekorative Reproduktion. Dafür sprechen insbesondere die gleichmäßige Papierwirkung, die Rahmung und der insgesamt reproduktive Eindruck der Druckfläche. Rahmenmaß 31,5 × 50 cm. Zustand nach den Fotos ordentlich mit altersbedingter Tönung, vereinzelten Flecken und Gebrauchsspuren an Rahmen und Rückwand. Vorläufiger realistischer Privatverkaufswert als dekorative Reproduktion ca. 40–100 €. Sollte sich bei einer Untersuchung außerhalb des Rahmens überraschend ein historisches Büttenpapier, Plattenrand oder andere Merkmale eines frühen Tiefdruckabzugs zeigen, wäre das Blatt neu zu bewerten.",
      images: []
    }
  ];

  for (const work of works) {
    const existing = catalog.works.find((entry) => entry.sequence === work.sequence || entry.id === work.id);
    if (existing) Object.assign(existing, work);
    else catalog.works.push(work);
  }

  catalog.works.sort((a, b) => a.sequence - b.sequence);
  catalog.stats.works = catalog.works.length;
  catalog.stats.photos = catalog.works.reduce((sum, entry) => sum + (entry.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((entry) => entry.status === "katalogisiert").length;
})();
