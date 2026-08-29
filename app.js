(() => {
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works?.length) return;

  const grid = document.querySelector("#art-grid");
  const search = document.querySelector("#search");
  const statusFilter = document.querySelector("#status-filter");
  const sortOrder = document.querySelector("#sort-order");
  const resultLine = document.querySelector("#result-line");
  const emptyState = document.querySelector("#empty-state");
  const dialog = document.querySelector("#art-dialog");
  const lightbox = document.querySelector("#lightbox");
  let activeWork = null;
  let activeImageIndex = 0;

  const normalized = (value) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const displayTitle = (work) =>
    work.title && work.title !== work.id ? work.title : "Ohne gesicherten Titel";

  document.querySelector("#stat-works").textContent = catalog.stats.works;
  document.querySelector("#stat-photos").textContent = catalog.stats.photos;
  document.querySelector("#stat-catalogued").textContent = catalog.stats.catalogued;

  const heroWorks = catalog.works.filter((work) => work.images.length);
  const heroSelection = [heroWorks[39] ?? heroWorks[0], heroWorks[70] ?? heroWorks[1]].filter(Boolean);
  document.querySelector("#hero-art").innerHTML = heroSelection
    .map(
      (work) => `<div class="hero-image"><img src="${escapeHtml(work.images[0].src)}" alt="" /></div>`,
    )
    .join("");

  function searchText(work) {
    return normalized(
      [
        work.id,
        work.title,
        work.artist,
        work.technique,
        work.dating,
        work.dimensions,
        work.userNotes?.join(" "),
        work.catalogText,
      ].join(" "),
    );
  }

  function visibleWorks() {
    const query = normalized(search.value.trim());
    const status = statusFilter.value;
    const works = catalog.works.filter(
      (work) =>
        (status === "all" || work.status === status) &&
        (!query || searchText(work).includes(query)),
    );

    return works.sort((a, b) => {
      if (sortOrder.value === "title")
        return displayTitle(a).localeCompare(displayTitle(b), "de");
      if (sortOrder.value === "artist")
        return a.artist.localeCompare(b.artist, "de");
      return a.sequence - b.sequence;
    });
  }

  function cardMarkup(work) {
    const image = work.images[0];
    const subtitle = [work.artist, work.technique].filter(Boolean).join(" · ");
    return `
      <article class="art-card">
        <button type="button" data-work-sequence="${work.sequence}" aria-label="${escapeHtml(displayTitle(work))} öffnen">
          <div class="card-image">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(displayTitle(work))}" loading="lazy" decoding="async" />
            ${work.images.length > 1 ? `<span class="photo-count">${work.images.length} Fotos</span>` : ""}
            ${work.status === "ausstehend" ? '<span class="status-pill">Offen</span>' : ""}
          </div>
          <div class="card-copy">
            <div class="card-kicker"><span>${escapeHtml(work.id)}</span><span>${escapeHtml(work.dating || "")}</span></div>
            <h3>${escapeHtml(displayTitle(work))}</h3>
            <p>${escapeHtml(subtitle || "Zuordnung in Prüfung")}</p>
          </div>
        </button>
      </article>`;
  }

  function render() {
    const works = visibleWorks();
    grid.innerHTML = works.map(cardMarkup).join("");
    resultLine.textContent = `${works.length} von ${catalog.works.length} Werken`;
    emptyState.hidden = works.length > 0;

    grid.querySelectorAll("[data-work-sequence]").forEach((button) => {
      button.addEventListener("click", () => {
        const work = catalog.works.find(
          (entry) => entry.sequence === Number(button.dataset.workSequence),
        );
        openWork(work);
      });
    });
  }

  function metadataMarkup(work) {
    const rows = [
      ["Technik", work.technique],
      ["Datierung", work.dating],
      ["Maße", work.dimensions],
      ["Mit Rahmen", work.framedDimensions],
      ["Wertspanne", work.value],
      ["Status", work.status === "katalogisiert" ? "Vorläufig katalogisiert" : "Katalogisierung ausstehend"],
    ].filter(([, value]) => value);

    return rows
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");
  }

  function selectDialogImage(index) {
    activeImageIndex = index;
    const image = activeWork.images[index];
    const main = document.querySelector("#dialog-main-image");
    main.src = image.src;
    main.alt = `${displayTitle(activeWork)}, Aufnahme ${index + 1} von ${activeWork.images.length}`;
    document.querySelectorAll("#thumbnail-strip button").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === index);
    });
  }

  function openWork(work) {
    if (!work) return;
    activeWork = work;
    activeImageIndex = 0;
    document.querySelector("#dialog-id").textContent = work.id;
    document.querySelector("#dialog-title").textContent = displayTitle(work);
    document.querySelector("#dialog-artist").textContent = work.artist;
    document.querySelector("#dialog-metadata").innerHTML = metadataMarkup(work);
    document.querySelector("#dialog-notes").innerHTML = (work.userNotes?.length
      ? work.userNotes
      : ["Keine zusätzlichen Maß- oder Provenienzangaben erfasst."]
    )
      .map((note) => `<p>${escapeHtml(note)}</p>`)
      .join("");
    document.querySelector("#dialog-catalog").textContent =
      work.catalogText ||
      "Für dieses Werk liegt im geteilten Chat noch kein abgeschlossener Katalogtext vor.";
    document.querySelector("#catalog-details").open = false;
    document.querySelector("#thumbnail-strip").innerHTML = work.images
      .map(
        (image, index) => `
          <button type="button" aria-label="Aufnahme ${index + 1} anzeigen">
            <img src="${escapeHtml(image.src)}" alt="" loading="lazy" />
          </button>`,
      )
      .join("");
    document.querySelectorAll("#thumbnail-strip button").forEach((button, index) => {
      button.addEventListener("click", () => selectDialogImage(index));
    });
    selectDialogImage(0);
    dialog.showModal();
    history.replaceState(null, "", `#werk-${work.sequence}`);
  }

  function closeDialog(target = dialog) {
    target.close();
    if (target === dialog) history.replaceState(null, "", "#sammlung");
  }

  [search, statusFilter, sortOrder].forEach((control) =>
    control.addEventListener("input", render),
  );
  document.querySelector("#reset-filters").addEventListener("click", () => {
    search.value = "";
    statusFilter.value = "all";
    sortOrder.value = "sequence";
    render();
  });
  document.querySelector("#dialog-close").addEventListener("click", () => closeDialog());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  document.querySelector("#main-image-button").addEventListener("click", () => {
    const image = activeWork.images[activeImageIndex];
    document.querySelector("#lightbox-image").src = image.src;
    document.querySelector("#lightbox-image").alt = `${displayTitle(activeWork)}, vergrößerte Aufnahme`;
    lightbox.showModal();
  });
  document.querySelector("#lightbox-close").addEventListener("click", () => closeDialog(lightbox));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeDialog(lightbox);
  });

  render();

  const match = location.hash.match(/^#werk-(\d+)$/);
  if (match) openWork(catalog.works.find((work) => work.sequence === Number(match[1])));
})();
