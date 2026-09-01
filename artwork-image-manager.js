(() => {
  "use strict";

  const panel = document.querySelector("#artwork-upload-panel");
  const list = document.querySelector("#artwork-upload-list");
  const strip = document.querySelector("#thumbnail-strip");
  const idNode = document.querySelector("#dialog-id");
  if (!panel || !list || !strip || !idNode) return;

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const findWork = () => {
    const workId = idNode.textContent?.trim();
    return window.CATALOG_DATA?.works?.find((work) => work.id === workId);
  };

  const heading = panel.querySelector(".artwork-upload-heading h3");
  const intro = panel.querySelector(".artwork-upload-heading p");
  if (heading) heading.textContent = "Bilder verwalten";
  if (intro) intro.textContent = "Vorhandene Katalogbilder und eigene Uploads können hier einzeln gelöscht werden. Neue Bilder werden auf diesem Gerät im Browser gespeichert.";

  const renderList = () => {
    const work = findWork();
    if (!work) return;

    const images = (work.images || [])
      .map((image, index) => ({ image, index }))
      .filter(({ image }) => image && !image.placeholder);

    if (!images.length) {
      list.innerHTML = '<li class="artwork-managed-empty">Für dieses Werk ist aktuell kein Bild hinterlegt.</li>';
      return;
    }

    list.innerHTML = images.map(({ image, index }) => {
      const ownUpload = Boolean(image.uploaded);
      const title = ownUpload
        ? (image.name || `Eigenes Bild ${index + 1}`)
        : `Katalogbild ${index + 1}`;
      const kind = ownUpload ? "Eigener Upload" : "Vorhandenes Katalogbild";
      return `
        <li class="artwork-managed-image">
          <img class="artwork-managed-preview" src="${escapeHtml(image.src)}" alt="" loading="lazy" />
          <span class="artwork-managed-copy">
            <strong>${escapeHtml(title)}</strong>
            <small>${kind}</small>
          </span>
          <button type="button" data-manage-image-index="${index}">Bild löschen</button>
        </li>`;
    }).join("");
  };

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-manage-image-index]");
    if (!button) return;
    const index = Number(button.dataset.manageImageIndex);
    const deleteButton = strip.querySelector(`[data-delete-image-index="${index}"]`);
    if (!deleteButton) return;
    deleteButton.click();
  });

  new MutationObserver(renderList).observe(strip, { childList: true, subtree: true });
  new MutationObserver(renderList).observe(idNode, { childList: true, characterData: true, subtree: true });
  new MutationObserver(() => {
    const children = Array.from(list.children);
    const isManaged = children.length > 0 && children.every((child) =>
      child.classList.contains("artwork-managed-image") || child.classList.contains("artwork-managed-empty"),
    );
    if (!isManaged) renderList();
  }).observe(list, { childList: true });

  renderList();
})();
