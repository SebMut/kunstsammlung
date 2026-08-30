(() => {
  "use strict";

  const button = document.querySelector("#pdf-export-button");
  if (!button) return;

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const displayTitle = (work) =>
    work.title && work.title !== work.id ? work.title : "Ohne gesicherten Titel";

  const absoluteUrl = (src) => new URL(src, window.location.href).href;

  const photoMarkup = (work) => {
    if (!work.images?.length) return '<div class="no-photo">Kein Foto</div>';
    return `
      <div class="photo-strip" aria-label="${work.images.length} Fotografien">
        ${work.images
          .map(
            (image) =>
              `<img src="${escapeHtml(absoluteUrl(image.src))}" alt="" />`,
          )
          .join("")}
      </div>`;
  };

  const workRow = (work) => {
    const status =
      work.status === "katalogisiert" ? "Katalogisiert" : "Offen";
    const dimensions = [
      work.dimensions ? `Bild: ${work.dimensions}` : "",
      work.framedDimensions ? `Rahmen: ${work.framedDimensions}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const details = [work.technique, work.dating].filter(Boolean).join("\n");

    return `
      <tr>
        <td class="photos-cell">${photoMarkup(work)}</td>
        <td class="id-cell">
          <strong>${escapeHtml(work.id)}</strong>
          <span>${work.images?.length || 0} Foto${work.images?.length === 1 ? "" : "s"}</span>
        </td>
        <td class="work-cell">
          <strong>${escapeHtml(displayTitle(work))}</strong>
          <span>${escapeHtml(work.artist || "Zuordnung in Prüfung")}</span>
        </td>
        <td class="detail-cell">${escapeHtml(details || "–")}</td>
        <td class="dimension-cell">${escapeHtml(dimensions || "–")}</td>
        <td class="value-cell">
          <strong>${escapeHtml(work.value || "–")}</strong>
          <span class="status ${work.status === "katalogisiert" ? "done" : "open"}">${status}</span>
        </td>
      </tr>`;
  };

  const waitForImages = async (doc) => {
    const images = Array.from(doc.images);
    await Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
      ),
    );
  };

  button.addEventListener("click", async () => {
    const catalog = window.CATALOG_DATA;
    if (!catalog?.works?.length) {
      alert("Der Katalog ist noch nicht vollständig geladen. Bitte versuchen Sie es erneut.");
      return;
    }

    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      alert("Das PDF-Fenster wurde vom Browser blockiert. Bitte Pop-ups für diese Seite erlauben.");
      return;
    }

    const works = [...catalog.works].sort((a, b) => a.sequence - b.sequence);
    const today = new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kunstsammlung – PDF-Übersicht</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      color: #1d211e;
      background: #fff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cover-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12mm;
      margin: 0 0 5mm;
      padding: 0 0 4mm;
      border-bottom: 1.2pt solid #1d211e;
    }
    .cover-head p { margin: 0 0 1.5mm; color: #7f3d2c; font-size: 7.5pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .cover-head h1 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 25pt; font-weight: 400; letter-spacing: -.02em; }
    .summary { text-align: right; color: #696c66; font-size: 8pt; line-height: 1.55; white-space: nowrap; }
    .summary strong { color: #1d211e; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    col.photos { width: 27%; }
    col.id { width: 7%; }
    col.work { width: 23%; }
    col.detail { width: 18%; }
    col.dimension { width: 13%; }
    col.value { width: 12%; }
    thead { display: table-header-group; }
    thead th {
      padding: 2.3mm 2mm;
      border-bottom: 1pt solid #8b8b84;
      background: #f1eee7;
      color: #565a55;
      font-size: 6.8pt;
      font-weight: 700;
      letter-spacing: .08em;
      text-align: left;
      text-transform: uppercase;
    }
    tbody tr { break-inside: avoid; page-break-inside: avoid; }
    tbody td {
      height: 29mm;
      padding: 2mm;
      vertical-align: middle;
      border-bottom: .55pt solid #cfcac0;
      overflow: hidden;
    }
    tbody tr:nth-child(even) td { background: #fbfaf7; }
    .photos-cell { padding: 1.8mm 2mm 1.8mm 0; }
    .photo-strip { width: 100%; height: 24.5mm; display: flex; align-items: stretch; gap: 1mm; overflow: hidden; }
    .photo-strip img { min-width: 0; flex: 1 1 0; height: 100%; object-fit: cover; background: #e5e0d6; }
    .no-photo { height: 24.5mm; display: grid; place-items: center; border: .6pt solid #d5d0c7; color: #8b8b84; background: #f4f1eb; }
    .id-cell strong, .work-cell strong, .value-cell strong { display: block; }
    .id-cell strong { color: #7f3d2c; font-size: 8pt; letter-spacing: .03em; }
    .id-cell span { display: block; margin-top: 1.5mm; color: #777a75; font-size: 6.8pt; }
    .work-cell strong { max-height: 9mm; overflow: hidden; font-family: Georgia, "Times New Roman", serif; font-size: 11pt; font-weight: 400; line-height: 1.05; }
    .work-cell span { display: block; max-height: 8mm; margin-top: 1.4mm; overflow: hidden; color: #60645f; font-size: 7.4pt; line-height: 1.25; }
    .detail-cell, .dimension-cell { color: #555954; font-size: 7.2pt; line-height: 1.35; white-space: pre-line; }
    .value-cell strong { max-height: 9mm; overflow: hidden; font-size: 7.5pt; line-height: 1.25; }
    .status { display: inline-block; margin-top: 1.8mm; padding: 1mm 1.6mm; border: .55pt solid #bdb8af; font-size: 6.2pt; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    .status.done { color: #45644b; background: #edf3ed; border-color: #b7c7b9; }
    .status.open { color: #7f3d2c; background: #f5ece8; border-color: #d7b9ae; }
    .print-note { margin-top: 4mm; color: #777a75; font-size: 6.8pt; line-height: 1.4; }
    @media screen {
      body { padding: 10mm; background: #e9e6df; }
      .sheet { max-width: 277mm; margin: 0 auto; padding: 10mm; background: #fff; box-shadow: 0 5mm 15mm rgba(0,0,0,.12); }
    }
    @media print {
      .sheet { padding: 0; }
    }
  </style>
</head>
<body>
  <main class="sheet">
    <header class="cover-head">
      <div>
        <p>Digitaler Sammlungskatalog</p>
        <h1>Kunstsammlung – Übersicht</h1>
      </div>
      <div class="summary">
        <strong>${catalog.stats.works} Werke</strong> · ${catalog.stats.photos} Fotografien<br />
        ${catalog.stats.catalogued} katalogisiert · Stand ${escapeHtml(today)}
      </div>
    </header>

    <table aria-label="Kunstsammlung Übersicht">
      <colgroup>
        <col class="photos" /><col class="id" /><col class="work" />
        <col class="detail" /><col class="dimension" /><col class="value" />
      </colgroup>
      <thead>
        <tr>
          <th>Fotografien</th>
          <th>Nr.</th>
          <th>Werk / Künstler</th>
          <th>Technik / Datierung</th>
          <th>Maße</th>
          <th>Wert / Status</th>
        </tr>
      </thead>
      <tbody>${works.map(workRow).join("")}</tbody>
    </table>

    <p class="print-note">Vorläufiger Sammlungskatalog auf Grundlage der vorhandenen Fotografien und Erfassungsdaten; kein Echtheitsgutachten oder verbindliche Taxation.</p>
  </main>
</body>
</html>`);
    printWindow.document.close();

    try {
      await waitForImages(printWindow.document);
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 250);
    } catch {
      printWindow.focus();
      printWindow.print();
    }
  });
})();
