(() => {
  "use strict";
  const catalog = window.CATALOG_DATA;
  if (!catalog?.works) return;

  const placeholderSrc = "assets/photo-placeholder.svg";

  for (const work of catalog.works) {
    if (!Array.isArray(work.images)) continue;
    work.images = work.images.map((image) => {
      if (!image || typeof image !== "object") return image;
      const isTechnicalPlaceholder =
        image.src === "assets/favicon.svg" ||
        image.label === "Foto folgt" ||
        image.placeholder === true;
      if (!isTechnicalPlaceholder) return image;
      return {
        ...image,
        src: placeholderSrc,
        label: "Foto noch nicht hinterlegt",
        placeholder: true,
        runtimePlaceholder: true,
      };
    });
  }

  if (catalog.stats) {
    catalog.stats.photos = catalog.works.reduce(
      (sum, work) => sum + (work.images || []).filter((image) => !image?.placeholder).length,
      0,
    );
  }
})();
