(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const work = {
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
  };

  const existing = catalog.works.find((entry) => entry.sequence === work.sequence || entry.id === work.id);
  if (existing) Object.assign(existing, work);
  else catalog.works.push(work);

  catalog.works.sort((a, b) => a.sequence - b.sequence);
  catalog.stats.works = catalog.works.length;
  catalog.stats.photos = catalog.works.reduce((sum, item) => sum + (item.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((item) => item.status === "katalogisiert").length;
})();
