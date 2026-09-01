(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  for (const work of catalog.works) {
    let images = work.images;

    if (!Array.isArray(images)) {
      images = images ? [images] : [];
    }

    work.images = images
      .map((image) => {
        if (typeof image === "string" && image.trim()) return { src: image };
        if (image && typeof image === "object" && typeof image.src === "string" && image.src.trim()) {
          return image;
        }
        return null;
      })
      .filter(Boolean);

    if (typeof work.artist !== "string") {
      work.artist = work.artist ? String(work.artist) : "Unbekannter Künstler";
    }
  }

  if (catalog.stats) {
    catalog.stats.works = catalog.works.length;
    catalog.stats.photos = catalog.works.reduce((sum, work) => sum + work.images.length, 0);
    catalog.stats.catalogued = catalog.works.filter((work) => work.status === "katalogisiert").length;
  }
})();
