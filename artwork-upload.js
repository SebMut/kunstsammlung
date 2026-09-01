(() => {
  "use strict";

  const DB_NAME = "kunstsammlung-artwork-images";
  const DB_VERSION = 1;
  const STORE_NAME = "images";
  const HIDDEN_IMAGES_KEY = "kunstsammlung-hidden-images-v1";
  const PLACEHOLDER_SRC = "assets/photo-placeholder.svg";
  const objectUrls = new Map();

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const openDb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "key" });
        store.createIndex("workId", "workId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const withStore = async (mode, callback) => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      let result;
      try { result = callback(store); }
      catch (error) { reject(error); return; }
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    }).finally(() => db.close());
  };

  const getAllRecords = async () => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  };

  const getRecordsForWork = async (workId) => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).index("workId").getAll(workId);
      request.onsuccess = () => resolve((request.result || []).sort((a, b) => a.createdAt - b.createdAt));
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  };

  const loadHiddenImages = () => {
    try {
      const value = JSON.parse(localStorage.getItem(HIDDEN_IMAGES_KEY) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch { return {}; }
  };

  const hideCatalogImage = (workId, src) => {
    const hidden = loadHiddenImages();
    const values = new Set(Array.isArray(hidden[workId]) ? hidden[workId] : []);
    values.add(src);
    hidden[workId] = Array.from(values);
    localStorage.setItem(HIDDEN_IMAGES_KEY, JSON.stringify(hidden));
  };

  const makeKey = (workId) => `${workId}:${crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`}`;

  const ensureUrl = (record) => {
    if (!objectUrls.has(record.key)) objectUrls.set(record.key, URL.createObjectURL(record.blob));
    return objectUrls.get(record.key);
  };

  const uploadedImage = (record) => ({
    src: ensureUrl(record),
    uploaded: true,
    uploadKey: record.key,
    name: record.name || "Hochgeladenes Bild",
  });

  const placeholderImage = () => ({
    src: PLACEHOLDER_SRC,
    label: "Foto noch nicht hinterlegt",
    placeholder: true,
    runtimePlaceholder: true,
  });

  const findWork = (workId) => window.CATALOG_DATA?.works?.find((work) => work.id === workId);

  const updateStats = () => {
    const catalog = window.CATALOG_DATA;
    if (!catalog?.works) return;
    catalog.stats.photos = catalog.works.reduce(
      (sum, work) => sum + (work.images || []).filter((image) => !image?.placeholder).length,
      0,
    );
    const stat = document.querySelector("#stat-photos");
    if (stat) stat.textContent = catalog.stats.photos;
  };

  const refreshGrid = () => {
    updateStats();
    document.querySelector("#search")?.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const mergeStoredImages = async () => {
    const catalog = window.CATALOG_DATA;
    if (!catalog?.works) return;
    const records = await getAllRecords();
    const hidden = loadHiddenImages();
    const grouped = new Map();

    records.forEach((record) => {
      if (!grouped.has(record.workId)) grouped.set(record.workId, []);
      grouped.get(record.workId).push(record);
    });

    for (const work of catalog.works) {
      work.images ||= [];
      const hiddenForWork = new Set(Array.isArray(hidden[work.id]) ? hidden[work.id] : []);
      work.images = work.images.filter((image) =>
        !image?.uploaded &&
        !image?.runtimePlaceholder &&
        !hiddenForWork.has(image?.src),
      );
      const extras = (grouped.get(work.id) || [])
        .sort((a, b) => a.createdAt - b.createdAt)
        .map(uploadedImage);
      work.images.push(...extras);
      if (!work.images.length) work.images.push(placeholderImage());
    }

    refreshGrid();
  };

  const setMessage = (text, kind = "") => {
    const node = document.querySelector("#artwork-upload-message");
    if (!node) return;
    node.textContent = text;
    node.dataset.kind = kind;
  };

  const deleteImage = async (work, image) => {
    if (!work || !image || image.placeholder) return false;

    if (image.uploaded && image.uploadKey) {
      await withStore("readwrite", (store) => store.delete(image.uploadKey));
      const url = objectUrls.get(image.uploadKey);
      if (url) URL.revokeObjectURL(url);
      objectUrls.delete(image.uploadKey);
    } else if (image.src) {
      hideCatalogImage(work.id, image.src);
    }

    await mergeStoredImages();
    await refreshUploadList(work.id);
    return true;
  };

  const renderDialogImages = (work, preferredIndex = 0) => {
    const strip = document.querySelector("#thumbnail-strip");
    const main = document.querySelector("#dialog-main-image");
    if (!strip || !main || !work?.images?.length) return;

    strip.innerHTML = work.images.map((image, index) => `
      <span class="artwork-thumb">
        <button class="artwork-thumb-select" type="button" data-upload-image-index="${index}" aria-label="Aufnahme ${index + 1} anzeigen">
          <img src="${escapeHtml(image.src)}" alt="" loading="lazy" />
        </button>
        ${image.placeholder ? "" : `<button class="artwork-thumb-delete" type="button" data-delete-image-index="${index}" aria-label="Aufnahme ${index + 1} löschen" title="Dieses Bild löschen">×</button>`}
      </span>`).join("");

    const select = (index) => {
      const safeIndex = Math.max(0, Math.min(index, work.images.length - 1));
      const image = work.images[safeIndex];
      if (!image) return;
      main.src = image.src;
      main.alt = `${work.title || work.id}, Aufnahme ${safeIndex + 1} von ${work.images.length}`;
      strip.dataset.activeIndex = String(safeIndex);
      strip.querySelectorAll("[data-upload-image-index]").forEach((button, i) => {
        button.classList.toggle("active", i === safeIndex);
      });
    };

    strip.querySelectorAll("[data-upload-image-index]").forEach((button) => {
      button.addEventListener("click", () => select(Number(button.dataset.uploadImageIndex)));
    });

    strip.querySelectorAll("[data-delete-image-index]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const index = Number(button.dataset.deleteImageIndex);
        const image = work.images[index];
        if (!image) return;
        if (!window.confirm(`Aufnahme ${index + 1} aus ${work.id} wirklich löschen?`)) return;

        button.disabled = true;
        try {
          await deleteImage(work, image);
          renderDialogImages(work, Math.min(index, work.images.length - 1));
          setMessage(`Aufnahme ${index + 1} aus ${work.id} gelöscht.`, "success");
        } catch (error) {
          console.error(error);
          setMessage("Das Bild konnte nicht gelöscht werden.", "error");
          button.disabled = false;
        }
      });
    });

    select(preferredIndex);
  };

  const refreshUploadList = async (workId) => {
    const list = document.querySelector("#artwork-upload-list");
    if (!list) return;
    const records = await getRecordsForWork(workId);
    list.innerHTML = records.length ? records.map((record) => `
      <li>
        <span>${escapeHtml(record.name || "Bild")}</span>
        <button type="button" data-delete-upload="${escapeHtml(record.key)}">Entfernen</button>
      </li>`).join("") : '<li class="upload-empty">Noch keine eigenen Bilder hochgeladen.</li>';
  };

  const createUploadUi = () => {
    const dialogInfo = document.querySelector("#art-dialog .dialog-info");
    if (!dialogInfo || document.querySelector("#artwork-upload-panel")) return;

    const panel = document.createElement("section");
    panel.className = "dialog-section artwork-upload-panel";
    panel.id = "artwork-upload-panel";
    panel.innerHTML = `
      <div class="artwork-upload-heading">
        <div><h3>Eigene Bilder</h3><p>Bilder werden auf diesem Gerät im Browser gespeichert und dem aktuellen Gxx zugeordnet. Einzelne Bilder können direkt über das × an der Vorschau gelöscht werden.</p></div>
        <label class="artwork-upload-button">
          Bilder hinzufügen
          <input id="artwork-upload-input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple />
        </label>
      </div>
      <p id="artwork-upload-message" class="artwork-upload-message" aria-live="polite"></p>
      <ul id="artwork-upload-list" class="artwork-upload-list"></ul>`;
    dialogInfo.insertBefore(panel, document.querySelector("#catalog-details"));

    const input = panel.querySelector("#artwork-upload-input");
    input.addEventListener("change", async () => {
      const workId = document.querySelector("#dialog-id")?.textContent?.trim();
      const work = findWork(workId);
      const files = Array.from(input.files || []);
      if (!work || !files.length) return;

      const invalid = files.find((file) => !file.type.startsWith("image/"));
      if (invalid) {
        setMessage("Bitte nur Bilddateien auswählen.", "error");
        input.value = "";
        return;
      }

      const tooLarge = files.find((file) => file.size > 25 * 1024 * 1024);
      if (tooLarge) {
        setMessage(`„${tooLarge.name}“ ist größer als 25 MB.`, "error");
        input.value = "";
        return;
      }

      input.disabled = true;
      setMessage(`${files.length} Bild${files.length === 1 ? "" : "er"} werden gespeichert …`);
      try {
        const now = Date.now();
        await withStore("readwrite", (store) => {
          files.forEach((file, index) => store.put({
            key: makeKey(workId),
            workId,
            name: file.name,
            type: file.type,
            size: file.size,
            createdAt: now + index,
            blob: file,
          }));
        });
        await mergeStoredImages();
        renderDialogImages(work, Math.max(0, work.images.length - files.length));
        await refreshUploadList(workId);
        setMessage(`${files.length} Bild${files.length === 1 ? "" : "er"} zu ${workId} hinzugefügt.`, "success");
      } catch (error) {
        console.error(error);
        setMessage("Die Bilder konnten nicht gespeichert werden. Möglicherweise ist der Browserspeicher voll.", "error");
      } finally {
        input.disabled = false;
        input.value = "";
      }
    });

    panel.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-delete-upload]");
      if (!button) return;
      const workId = document.querySelector("#dialog-id")?.textContent?.trim();
      const work = findWork(workId);
      if (!work) return;
      const image = work.images.find((entry) => entry.uploadKey === button.dataset.deleteUpload);
      if (!image) return;
      if (!window.confirm(`Dieses hochgeladene Bild aus ${workId} wirklich löschen?`)) return;

      button.disabled = true;
      try {
        await deleteImage(work, image);
        renderDialogImages(work, 0);
        setMessage(`Bild aus ${workId} gelöscht.`, "success");
      } catch (error) {
        console.error(error);
        setMessage("Das Bild konnte nicht gelöscht werden.", "error");
        button.disabled = false;
      }
    });

    const idNode = document.querySelector("#dialog-id");
    if (idNode) {
      new MutationObserver(() => {
        const workId = idNode.textContent.trim();
        const work = findWork(workId);
        setMessage("");
        if (!workId || !work) return;
        renderDialogImages(work, 0);
        refreshUploadList(workId).catch(console.error);
      }).observe(idNode, { childList: true, characterData: true, subtree: true });
    }

    const mainButton = document.querySelector("#main-image-button");
    mainButton?.addEventListener("click", (event) => {
      const main = document.querySelector("#dialog-main-image");
      const lightbox = document.querySelector("#lightbox");
      const lightboxImage = document.querySelector("#lightbox-image");
      if (!main?.src || !lightbox || !lightboxImage) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      lightboxImage.src = main.src;
      lightboxImage.alt = main.alt || "Vergrößerte Aufnahme";
      lightbox.showModal();
    }, true);
  };

  const init = async () => {
    createUploadUi();
    try { await mergeStoredImages(); }
    catch (error) { console.error("Gespeicherte Werkbilder konnten nicht geladen werden.", error); }
    const currentId = document.querySelector("#dialog-id")?.textContent?.trim();
    const currentWork = findWork(currentId);
    if (currentWork) {
      renderDialogImages(currentWork, 0);
      refreshUploadList(currentId).catch(console.error);
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();

  window.addEventListener("beforeunload", () => objectUrls.forEach((url) => URL.revokeObjectURL(url)));
})();
