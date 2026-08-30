(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const extraWorks = [
    {
      id: "G-081", sequence: 81, title: "America 1586 – Fantasiekarte der Amerikas",
      artist: "Anonym; dekorative historische Fantasiekarte",
      technique: "kolorierter Druck / Reproduktionsgrafik auf Papier",
      dating: "wohl um 1900; aufgedruckte Jahreszahl 1586 bezieht sich auf das dargestellte Kartenbild",
      dimensions: "", framedDimensions: "65 × 50,5 cm", value: "ca. 80–180 €", status: "katalogisiert",
      userNotes: ["Rahmenmaß 65 × 50,5 cm.", "Unten rechts bezeichnet: AMERICA 1586.", "Links Porträts mit den Bezeichnungen CHRISTOPHORVS COLVMBVS und REYNA YSABEL.", "Die Jahreszahl 1586 ist nicht als Herstellungsdatum des vorliegenden Blatts zu verstehen."],
      catalogText: "G-081 – America 1586 – Fantasiekarte der Amerikas\n\nDekorative kolorierte Karte von Nord- und Südamerika mit Porträts von Christoph Kolumbus und Königin Isabella, Segelschiff und Landungsszene. Die Bezeichnung AMERICA 1586 ist nicht als Herstellungsdatum des vorliegenden Drucks zu verstehen. Das Blatt wird als historisierende Reproduktions- bzw. Fantasiekarte, wahrscheinlich um 1900 oder frühes 20. Jahrhundert, eingeordnet. Außenmaß mit Rahmen 65 × 50,5 cm. Vorläufiger Privatverkaufswert etwa 80–180 €.", images: []
    },
    {
      id: "G-082", sequence: 82, title: "A New Map of ye Isthmus of Darien in America",
      artist: "nach William Hacke und Robert Morden; Stich Herman Moll",
      technique: "kolorierter kartografischer Druck / Reproduktion nach einer historischen Kupferstichkarte",
      dating: "historische Vorlage 1699/um 1721; vorliegend wahrscheinlich spätere Reproduktion",
      dimensions: "", framedDimensions: "31,5 × 50 cm", value: "ca. 40–100 €", status: "katalogisiert",
      userNotes: ["Rahmenmaß 31,5 × 50 cm.", "Historische Darien-/Panama-Karte.", "Nach Fotobefund wahrscheinlich spätere dekorative Reproduktion."],
      catalogText: "G-082 – A New Map of ye Isthmus of Darien in America\n\nHistorisierende Karte des Isthmus von Darién mit Panama, Teilen Costa Ricas und Kolumbiens. Historische Vorlage von William Hacke und Robert Morden, gestochen von Herman Moll. Das vorhandene Blatt wird vorläufig als spätere dekorative Reproduktion geführt. Außenmaß mit Rahmen 31,5 × 50 cm. Vorläufiger Privatverkaufswert etwa 40–100 €.", images: []
    },
    {
      id: "G-083", sequence: 83, title: "A Draft of the Golden & adjacent Islands",
      artist: "nach William Hacke; historische Ausgabe im Umfeld von Robert Morden / Herman Moll",
      technique: "kolorierter kartografischer Druck / Reproduktion nach einer historischen Kupferstichkarte",
      dating: "historische Vorlage 1699/um 1721; vorliegend wahrscheinlich spätere Reproduktion",
      dimensions: "", framedDimensions: "31,5 × 50 cm", value: "ca. 40–100 €", status: "katalogisiert",
      userNotes: ["Rahmenmaß 31,5 × 50 cm.", "Golden Islands / San-Blas-Inseln und Küste von Darién mit New Edinburgh.", "Gegenstück zu G-082."],
      catalogText: "G-083 – A Draft of the Golden & adjacent Islands\n\nKolorierte historisierende Karte der Golden Islands und der Küste des Isthmus von Darién. Das Blatt gehört zum selben historischen Darien-Kartenkomplex wie G-082 und wird als spätere Reproduktion nach einer Vorlage von 1699/um 1721 geführt. Außenmaß mit Rahmen 31,5 × 50 cm. Vorläufiger Privatverkaufswert etwa 40–100 €.", images: []
    },
    {
      id: "G-084", sequence: 84, title: "Mutter mit Kind in traditioneller Kleidung",
      artist: "Nicht identifiziert; keine Signatur erkennbar",
      technique: "wohl Öl- oder Acrylmalerei auf Malpappe/Karton",
      dating: "wohl 2. Hälfte 20. Jahrhundert",
      dimensions: "60 × 48 cm", framedDimensions: "", value: "ca. 80–180 €", status: "katalogisiert",
      userNotes: ["Maß 60 × 48 cm; ungerahmt.", "Darstellung einer Frau mit Kopftuch und eines kleinen Kindes.", "Keine sicher erkennbare Signatur oder Beschriftung."],
      catalogText: "G-084 – Mutter mit Kind in traditioneller Kleidung\n\nUngerahmte figurative Malerei auf fester Malpappe bzw. Karton. Keine Signatur, Datierung oder Provenienzangabe erkennbar. Vorläufig als anonyme Arbeit der zweiten Hälfte des 20. Jahrhunderts geführt. Maß 60 × 48 cm. Vorläufiger Privatverkaufswert etwa 80–180 €.", images: []
    },
    {
      id: "G-085", sequence: 85, title: "Zwei weibliche Aktstudien",
      artist: "Karin Karow",
      technique: "Kohle und farbige Pastellkreide auf Papier/Karton",
      dating: "Studienzeit an der Universität; genaue Datierung noch offen",
      dimensions: "60 × 48 cm", framedDimensions: "", value: "ca. 80–180 €", status: "katalogisiert",
      userNotes: [
        "Maß 60 × 48 cm; ungerahmt.",
        "Künstlerin: Karin Karow.",
        "Nach Angabe aus ihrer Studienzeit an der Universität.",
        "Darstellung zweier weiblicher Aktmodelle, eines frontal sitzend mit drapiertem Tuch, eines rückansichtig.",
        "Ausgeführt in kräftiger schwarzer Kohlezeichnung mit blauen, grünen, gelben und rötlichen Pastellakzenten.",
        "Papier/Karton mit deutlichen alters- und lagerungsbedingten Randbeschädigungen, Einrissen, Fehlstellen und Knicken; rückseitig unbezeichnet."
      ],
      catalogText: "G-085 – Zwei weibliche Aktstudien\n\nStudienarbeit von Karin Karow aus ihrer Zeit an der Universität. Das Blatt zeigt zwei weibliche Aktmodelle auf Hockern: links eine frontal bzw. leicht seitlich sitzende Figur mit über die Schulter geführtem Tuch, rechts eine Rückenansicht. Die Figuren sind mit kräftigen schwarzen Kohlestrichen modelliert und durch farbige Pastellkreiden in Blau, Grün, Gelb, Orange und Rot akzentuiert. Die schnelle, konstruktive Linienführung und die Betonung von Körpervolumen und Haltung entsprechen einer akademischen Figuren- bzw. Aktstudie. Maß 60 × 48 cm, ungerahmt. Der Bildträger zeigt deutliche alters- und lagerungsbedingte Schäden an den Rändern mit Einrissen, Fehlstellen, Knicken und Abrieb; die Rückseite ist unbezeichnet. Da die Entstehung als studentische Arbeit gesichert ist, wird das Werk als Studienarbeit und nicht als späteres Hauptwerk der Künstlerin geführt. Vorläufiger Privatverkaufswert etwa 80–180 €, wobei Provenienz, Dokumentation der Studienzeit und der Zustand für die weitere Bewertung wesentlich sind.",
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
  catalog.stats.photos = catalog.works.reduce((sum, entry) => sum + (entry.images?.length || 0), 0);
  catalog.stats.catalogued = catalog.works.filter((entry) => entry.status === "katalogisiert").length;
})();
