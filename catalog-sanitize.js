(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const placeholder = { src: "assets/favicon.svg", label: "Foto folgt" };

  for (const work of catalog.works) {
    let images = work.images;

    if (!Array.isArray(images)) {
      images = images ? [images] : [];
    }

    images = images
      .map((image) => {
        if (typeof image === "string") return { src: image };
        if (image && typeof image === "object" && typeof image.src === "string" && image.src.trim()) {
          return image;
        }
        return null;
      })
      .filter(Boolean);

    if (!images.length) images = [{ ...placeholder }];
    work.images = images;
    if (typeof work.artist !== "string") work.artist = work.artist ? String(work.artist) : "Unbekannter Künstler";
  }

  if (catalog.stats) {
    catalog.stats.works = catalog.works.length;
    catalog.stats.photos = catalog.works.reduce((sum, work) => sum + work.images.length, 0);
    catalog.stats.catalogued = catalog.works.filter((work) => work.status === "katalogisiert").length;
  }
})();
