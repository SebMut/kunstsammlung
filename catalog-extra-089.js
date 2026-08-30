(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const works = [
    {
      id: "G-089", sequence: 89, title: "Regenszene mit Motorradfahrer", artist: "Karin Karow",
      technique: "Tusche, Pinselzeichnung und Lavierung auf Papier",
      dating: "Studienzeit an der Universität; genaue Datierung noch offen", dimensions: "48 × 24 cm", framedDimensions: "",
      value: "ca. 80–180 €", status: "katalogisiert",
      userNotes: ["Maß 48 × 24 cm; ungerahmt.","Künstlerin: Karin Karow.","Nach Angabe aus ihrer Studienzeit an der Universität.","Schwarz-graue städtische Regenszene mit Motorrad-/Rollerfahrer und mehreren Passanten unter Regenschirmen.","Ausgeführt mit schwarzer Tusche, Pinselzeichnung und grauen Lavierungen auf stärkerem Zeichen- bzw. Aquarellpapier.","Rückseite mit schwachen Bleistiftspuren/Notizen; keine sicher lesbare zusätzliche Beschriftung.","Papier mit altersbedingten Stockflecken und Verfärbungen, insbesondere an den Rändern und auf der Rückseite."],
      catalogText: "G-089 – Regenszene mit Motorradfahrer\n\nStudienarbeit von Karin Karow aus ihrer Zeit an der Universität. Das schmale Querformat zeigt eine städtische Regenszene: Im Zentrum beugt sich eine Person über ein Motorrad bzw. einen Roller, während sich im Hintergrund und seitlich mehrere Passanten mit Regenschirmen bewegen. Die Komposition ist mit kräftiger schwarzer Tusche und Pinselzeichnung angelegt und durch graue Lavierungen räumlich verdichtet. Die reduzierte Palette und die schnelle, illustrative Linienführung sprechen für eine akademische bzw. angewandt-grafische Studienarbeit. Maß 48 × 24 cm, ungerahmt. Das Papier zeigt altersbedingte Stockflecken, Verfärbungen und Gebrauchsspuren; auf der Rückseite befinden sich nur schwache, nicht sicher lesbare Bleistiftspuren. Vorläufiger Privatverkaufswert etwa 80–180 €.", images: []
    },
    {
      id: "G-090", sequence: 90, title: "Liegende weibliche Figur im Innenraum", artist: "Karin Karow",
      technique: "Kohle / schwarze Kreide auf Papier", dating: "Studienzeit an der Universität; genaue Datierung noch offen", dimensions: "57 × 41 cm", framedDimensions: "", value: "ca. 30–80 €", status: "katalogisiert",
      userNotes: ["Maß 57 × 41 cm; ungerahmt.","Künstlerin: Karin Karow.","Studienarbeit aus ihrer Universitätszeit.","Motiv: liegende weibliche Akt-/Figurenstudie im Innenraum; zweite angeschnittene Figur.","Technik: Kohle / schwarze Kreide auf Papier.","Zustand: sehr stark beschädigt; große Fehlstellen, Risse, Ausbrüche und Knicke."],
      catalogText: "G-090 – Liegende weibliche Figur im Innenraum\n\nStudienarbeit von Karin Karow aus ihrer Universitätszeit. Liegende weibliche Akt-/Figurenstudie im Innenraum mit einer zweiten angeschnittenen Figur. Ausgeführt in Kohle bzw. schwarzer Kreide auf Papier. Maß 57 × 41 cm, ungerahmt. Das Blatt ist sehr stark beschädigt und weist große Fehlstellen, Risse, Ausbrüche und Knicke auf. Vorläufiger Privatverkaufswert ca. 30–80 €.", images: []
    },
    {
      id: "G-091", sequence: 91, title: "Liegende weibliche Aktstudie in Blau", artist: "Karin Karow",
      technique: "vermutlich Gouache / Deckfarbe auf Papier bzw. Karton", dating: "Studienzeit an der Universität; genaue Datierung noch offen", dimensions: "60 × 42 cm", framedDimensions: "", value: "ca. 80–180 €", status: "katalogisiert",
      userNotes: ["Maß 60 × 42 cm; ungerahmt.","Künstlerin: Karin Karow.","Studienarbeit aus ihrer Universitätszeit.","Motiv: liegende weibliche Aktstudie in kühler blau-grüner Farbigkeit.","Technik vermutlich Gouache / Deckfarbe auf Papier bzw. Karton.","Zustand: kleinere Risse, Randbeschädigungen und Gebrauchsspuren."],
      catalogText: "G-091 – Liegende weibliche Aktstudie in Blau\n\nStudienarbeit von Karin Karow aus ihrer Universitätszeit. Das Blatt zeigt eine liegende weibliche Aktstudie in kühler blau-grüner Farbigkeit. Technik vermutlich Gouache bzw. Deckfarbe auf Papier oder Karton. Maß 60 × 42 cm, ungerahmt. Kleinere Risse, Randbeschädigungen und Gebrauchsspuren sind vorhanden. Vorläufiger Privatverkaufswert ca. 80–180 €.", images: []
    },
    {
      id: "G-092", sequence: 92, title: "Liegende weibliche Aktstudie mit rosafarbenem Akzent", artist: "Karin Karow",
      technique: "vermutlich Gouache / Deckfarbe auf Papier bzw. Karton", dating: "Studienzeit an der Universität; genaue Datierung noch offen", dimensions: "40 × 30 cm", framedDimensions: "", value: "ca. 50–120 €", status: "katalogisiert",
      userNotes: ["Maß 40 × 30 cm; ungerahmt.","Künstlerin: Karin Karow.","Studienarbeit aus ihrer Universitätszeit.","Motiv: liegende weibliche Aktstudie in Blau mit rosafarbenem Akzent.","Technik vermutlich Gouache / Deckfarbe auf Papier bzw. Karton.","Zustand: deutliche Stockflecken auf der Rückseite; leichte Verformungen und altersbedingte Gebrauchsspuren."],
      catalogText: "G-092 – Liegende weibliche Aktstudie mit rosafarbenem Akzent\n\nStudienarbeit von Karin Karow aus ihrer Universitätszeit. Liegende weibliche Aktstudie in Blau mit rosafarbenem Akzent. Technik vermutlich Gouache bzw. Deckfarbe auf Papier oder Karton. Maß 40 × 30 cm, ungerahmt. Auf der Rückseite zeigen sich deutliche Stockflecken; außerdem leichte Verformungen und altersbedingte Gebrauchsspuren. Vorläufiger Privatverkaufswert ca. 50–120 €.", images: []
    },
    {
      id: "G-093", sequence: 93, title: "Expressive Kopf-/Figurenstudie", artist: "Karin Karow",
      technique: "vermutlich Gouache / Deckfarbe auf Papier", dating: "Studienzeit an der Universität; genaue Datierung noch offen", dimensions: "52 × 41,5 cm", framedDimensions: "", value: "ca. 60–140 €", status: "katalogisiert",
      userNotes: ["Maß 52 × 41,5 cm; ungerahmt.","Künstlerin: Karin Karow.","Studienarbeit aus ihrer Universitätszeit.","Motiv: expressive, stark abstrahierte Kopf-/Figurenstudie in Ocker-, Grün- und Schwarztönen.","Technik vermutlich Gouache / Deckfarbe auf Papier.","Am linken Rand ist eine handschriftliche Namensnotiz erkennbar."],
      catalogText: "G-093 – Expressive Kopf-/Figurenstudie\n\nStudienarbeit von Karin Karow aus ihrer Universitätszeit. Expressive, stark abstrahierte Kopf-/Figurenstudie in Ocker-, Grün- und Schwarztönen. Technik vermutlich Gouache bzw. Deckfarbe auf Papier. Maß 52 × 41,5 cm, ungerahmt. Am linken Rand ist eine handschriftliche Namensnotiz erkennbar. Vorläufiger Privatverkaufswert ca. 60–140 €.", images: []
    },
    {
      id: "G-094", sequence: 94, title: "Zwei weibliche Akt-/Figurenstudien", artist: "Karin Karow",
      technique: "vermutlich Gouache / Deckfarbe mit zeichnerischen Konturen auf Papier", dating: "1959", dimensions: "50 × 32 cm mit Passepartout", framedDimensions: "", value: "ca. 80–180 €", status: "katalogisiert",
      userNotes: ["Maß 50 × 32 cm mit Passepartout; ungerahmt.","Künstlerin: Karin Karow.","Studienarbeit aus ihrer Universitätszeit.","Datierung 1959; rückseitig handschriftlich „Karin Karow 59“.","Motiv: zwei weibliche Akt-/Figurenstudien.","Technik vermutlich Gouache / Deckfarbe mit zeichnerischen Konturen auf Papier.","Zustand: altersbedingte Flecken, leichte Verformungen und Randbeschädigungen."],
      catalogText: "G-094 – Zwei weibliche Akt-/Figurenstudien\n\nStudienarbeit von Karin Karow, datiert 1959. Die Datierung und Zuschreibung werden durch die rückseitige handschriftliche Beschriftung „Karin Karow 59“ belegt. Das Blatt zeigt zwei weibliche Akt-/Figurenstudien und ist vermutlich in Gouache bzw. Deckfarbe mit zeichnerischen Konturen auf Papier ausgeführt. Maß 50 × 32 cm mit Passepartout, ungerahmt. Altersbedingte Flecken, leichte Verformungen und Randbeschädigungen. Vorläufiger Privatverkaufswert ca. 80–180 €.", images: []
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
