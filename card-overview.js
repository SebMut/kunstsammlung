(() => {
  "use strict";

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const conciseDating = (value) => {
    const dating = String(value ?? "").trim();
    if (!dating) return "Datierung offen";
    const firstPart = dating.split(";")[0].trim();
    return firstPart.length > 34 ? `${firstPart.slice(0, 31).trim()}…` : firstPart;
  };

  const dimensionsText = (work) => {
    const image = String(work.dimensions ?? "").trim();
    const framed = String(work.framedDimensions ?? "").trim();
    if (image && framed) return `Bild ${image} · Rahmen ${framed}`;
    if (image) return image;
    if (framed) return `Rahmen ${framed}`;
    return "";
  };

  const enhanceCard = (card) => {
    if (card.dataset.overviewEnhanced === "true") return;

    const button = card.querySelector("[data-work-sequence]");
    const catalog = window.CATALOG_DATA;
    if (!button || !catalog?.works?.length) return;

    const sequence = Number(button.dataset.workSequence);
    const work = catalog.works.find((entry) => entry.sequence === sequence);
    const copy = card.querySelector(".card-copy");
    if (!work || !copy) return;

    const kickerParts = copy.querySelectorAll(".card-kicker span");
    if (kickerParts[1]) {
      kickerParts[1].textContent = conciseDating(work.dating);
      kickerParts[1].title = String(work.dating ?? "");
    }

    const oldSubtitle = copy.querySelector(":scope > p");
    if (oldSubtitle) {
      oldSubtitle.className = "card-artist";
      oldSubtitle.textContent = work.artist || "Zuordnung in Prüfung";
    }

    const facts = [
      ["Technik", work.technique],
      ["Maße", dimensionsText(work)],
      ["Wert", work.value],
    ].filter(([, value]) => String(value ?? "").trim());

    if (facts.length) {
      const details = document.createElement("div");
      details.className = "card-overview-details";
      details.innerHTML = facts
        .map(
          ([label, value]) => `
            <div class="card-overview-fact${label === "Wert" ? " card-overview-fact--value" : ""}">
              <span class="card-overview-label">${escapeHtml(label)}</span>
              <span class="card-overview-value">${escapeHtml(value)}</span>
            </div>`,
        )
        .join("");
      copy.append(details);
    }

    card.dataset.overviewEnhanced = "true";
  };

  const enhanceAll = () => {
    document.querySelectorAll("#art-grid .art-card").forEach(enhanceCard);
  };

  const start = () => {
    const grid = document.querySelector("#art-grid");
    if (!grid) return;

    const observer = new MutationObserver(() => enhanceAll());
    observer.observe(grid, { childList: true, subtree: true });

    enhanceAll();
    let attempts = 0;
    const waitForCatalog = window.setInterval(() => {
      attempts += 1;
      enhanceAll();
      if (window.CATALOG_DATA?.works?.length || attempts >= 80) window.clearInterval(waitForCatalog);
    }, 250);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
