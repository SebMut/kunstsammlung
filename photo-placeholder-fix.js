(() => {
  "use strict";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const EMPTY_IMAGE = Object.freeze({ src: "", noImage: true });

  const emptyImages = () => new Proxy([], {
    get(target, property, receiver) {
      if (property === "0") return EMPTY_IMAGE;
      return Reflect.get(target, property, receiver);
    },
  });

  const isTechnicalPlaceholder = (image) => {
    if (!image || typeof image !== "object") return false;
    const src = String(image.src || "");
    const label = String(image.label || "").toLowerCase();
    return Boolean(
      image.placeholder === true ||
      image.runtimePlaceholder === true ||
      src === "assets/favicon.svg" ||
      src.includes("photo-placeholder.svg") ||
      label.includes("foto folgt") ||
      label.includes("foto noch nicht hinterlegt") ||
      label.includes("foto noch nicht hinterlegt"),
    );
  };

  const sanitizeWork = (work) => {
    const source = Array.isArray(work.images) ? Array.from(work.images) : [];
    const images = source.filter((image) => !isTechnicalPlaceholder(image));
    work.images = images.length ? images : emptyImages();
  };

  const sanitizeAll = () => {
    catalog.works.forEach(sanitizeWork);
    if (catalog.stats) {
      catalog.stats.photos = catalog.works.reduce((sum, work) => sum + work.images.length, 0);
    }
    const stat = document.querySelector("#stat-photos");
    if (stat) stat.textContent = catalog.stats.photos;
  };

  const currentWork = () => {
    const id = document.querySelector("#dialog-id")?.textContent?.trim();
    return catalog.works.find((work) => work.id === id);
  };

  const syncDialogState = () => {
    const work = currentWork();
    const main = document.querySelector("#dialog-main-image");
    const mainButton = document.querySelector("#main-image-button");
    const strip = document.querySelector("#thumbnail-strip");
    const media = document.querySelector("#art-dialog .dialog-media");
    if (!main || !mainButton || !strip || !media) return;

    const hasImages = Boolean(work?.images?.length);
    media.classList.toggle("is-empty", !hasImages);
    mainButton.disabled = !hasImages;
    main.hidden = !hasImages;

    if (!hasImages) {
      main.removeAttribute("src");
      main.alt = "";
      strip.innerHTML = "";
    }
  };

  const cleanRenderedCards = () => {
    document.querySelectorAll("#art-grid .card-image").forEach((box) => {
      const image = box.querySelector("img");
      const empty = !image || !image.getAttribute("src");
      box.classList.toggle("no-image", empty);
      if (image && !image.getAttribute("src")) image.remove();
    });
  };

  const style = document.createElement("style");
  style.textContent = `
    #art-grid .card-image.no-image { background: transparent; }
    #art-dialog .dialog-media.is-empty { background: var(--white); }
    #art-dialog .dialog-media.is-empty .main-image-button,
    #art-dialog .dialog-media.is-empty .thumbnail-strip { visibility: hidden; }
  `;
  document.head.append(style);

  sanitizeAll();

  const search = document.querySelector("#search");
  search?.addEventListener("input", () => {
    sanitizeAll();
    syncDialogState();
  }, true);

  const grid = document.querySelector("#art-grid");
  if (grid) {
    new MutationObserver(cleanRenderedCards).observe(grid, { childList: true, subtree: true });
  }

  const dialogId = document.querySelector("#dialog-id");
  if (dialogId) {
    new MutationObserver(() => queueMicrotask(syncDialogState)).observe(dialogId, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  queueMicrotask(() => {
    cleanRenderedCards();
    syncDialogState();
  });
})();
