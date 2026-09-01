(() => {
  "use strict";

  const OWNER = "SebMut";
  const REPO = "kunstsammlung";
  const BRANCH = "main";
  const MANIFEST_PATH = "catalog-media.json";
  const TOKEN_KEY = "kunstsammlung-github-token-v1";
  const API_VERSION = "2026-03-10";
  const PLACEHOLDER_SRC = "assets/photo-placeholder.svg";
  const LEGACY_DB = "kunstsammlung-artwork-images";
  const LEGACY_STORE = "images";
  const baseImages = new Map();
  let manifest = { version: 1, works: {} };
  let lastCommitSha = "";

  const catalog = window.CATALOG_DATA;
  if (!catalog?.works?.length) return;

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const token = () => {
    try { return localStorage.getItem(TOKEN_KEY) || ""; }
    catch { return ""; }
  };

  const saveToken = (value) => {
    if (value) localStorage.setItem(TOKEN_KEY, value.trim());
    else localStorage.removeItem(TOKEN_KEY);
  };

  const api = async (path, options = {}) => {
    const headers = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
      ...(options.headers || {}),
    };
    const auth = options.token ?? token();
    if (auth) headers.Authorization = `Bearer ${auth}`;
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
    if (!response.ok) {
      let detail = "";
      try { detail = (await response.json())?.message || ""; } catch {}
      const error = new Error(detail || `GitHub API: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    if (response.status === 204) return null;
    return response.json();
  };

  const decodeBase64Utf8 = (value) => {
    const binary = atob(String(value || "").replace(/\s/g, ""));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

  const cleanName = (name, fallback = "bild.jpg") => {
    const safe = String(name || fallback)
      .normalize("NFKD")
      .replace(/[^\w.\-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return safe || fallback;
  };

  const workFolder = (workId) => `assets/artworks/${workId}`;
  const rawUrl = (path) =>
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path.split("/").map(encodeURIComponent).join("/")}?v=${encodeURIComponent(lastCommitSha || Date.now())}`;

  const placeholderImage = () => ({
    src: PLACEHOLDER_SRC,
    label: "Foto noch nicht hinterlegt",
    placeholder: true,
    runtimePlaceholder: true,
  });

  for (const work of catalog.works) {
    baseImages.set(work.id, (work.images || []).filter((image) => !image?.runtimePlaceholder).map((image) => ({ ...image })));
  }

  const getManifestEntry = (workId, source = manifest) => {
    source.works ||= {};
    source.works[workId] ||= { uploads: [], hidden: [] };
    source.works[workId].uploads ||= [];
    source.works[workId].hidden ||= [];
    return source.works[workId];
  };

  const fetchManifestAt = async (ref = BRANCH, authToken = token()) => {
    try {
      const data = await api(`/contents/${encodeURIComponent(MANIFEST_PATH)}?ref=${encodeURIComponent(ref)}&t=${Date.now()}`, { token: authToken });
      const parsed = JSON.parse(decodeBase64Utf8(data.content));
      parsed.version ||= 1;
      parsed.works ||= {};
      return parsed;
    } catch (error) {
      if (error.status === 404) return { version: 1, works: {} };
      throw error;
    }
  };

  const updateStatsAndGrid = () => {
    catalog.stats.photos = catalog.works.reduce(
      (sum, work) => sum + (work.images || []).filter((image) => !image?.placeholder).length,
      0,
    );
    const stat = document.querySelector("#stat-photos");
    if (stat) stat.textContent = catalog.stats.photos;
    document.querySelector("#search")?.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const applyManifest = (nextManifest = manifest) => {
    manifest = nextManifest;
    for (const work of catalog.works) {
      const entry = getManifestEntry(work.id);
      const hidden = new Set(entry.hidden || []);
      const originals = (baseImages.get(work.id) || []).filter((image) => !hidden.has(image.src));
      const synced = (entry.uploads || []).map((item) => ({
        src: rawUrl(item.path),
        name: item.name || item.path.split("/").pop(),
        githubSynced: true,
        githubPath: item.path,
      }));
      work.images = [...originals, ...synced];
      if (!work.images.length) work.images.push(placeholderImage());
    }
    updateStatsAndGrid();
  };

  const refreshFromGitHub = async () => {
    const next = await fetchManifestAt(BRANCH, token());
    applyManifest(next);
    const currentId = document.querySelector("#dialog-id")?.textContent?.trim();
    const work = catalog.works.find((item) => item.id === currentId);
    if (work) renderDialogImages(work);
  };

  const createGitBlob = async (content, encoding) =>
    api("/git/blobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, encoding }),
    });

  const commitAtomic = async ({ message, addFiles = [], deletePaths = [], mutateManifest }) => {
    if (!token()) throw new Error("GitHub ist noch nicht verbunden.");

    const ref = await api(`/git/ref/heads/${encodeURIComponent(BRANCH)}`);
    const parentSha = ref.object.sha;
    const parentCommit = await api(`/git/commits/${parentSha}`);
    const baseTree = parentCommit.tree.sha;
    const freshManifest = await fetchManifestAt(parentSha, token());
    const nextManifest = structuredClone(freshManifest);
    mutateManifest?.(nextManifest);

    const tree = [];
    for (const file of addFiles) {
      const content = await blobToBase64(file.blob);
      const blob = await createGitBlob(content, "base64");
      tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    const manifestBlob = await createGitBlob(`${JSON.stringify(nextManifest, null, 2)}\n`, "utf-8");
    tree.push({ path: MANIFEST_PATH, mode: "100644", type: "blob", sha: manifestBlob.sha });

    for (const path of [...new Set(deletePaths.filter(Boolean))]) {
      tree.push({ path, mode: "100644", type: "blob", sha: null });
    }

    const nextTree = await api("/git/trees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_tree: baseTree, tree }),
    });

    const commit = await api("/git/commits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, tree: nextTree.sha, parents: [parentSha] }),
    });

    try {
      await api(`/git/refs/heads/${encodeURIComponent(BRANCH)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
    } catch (error) {
      if (error.status === 409 || error.status === 422) {
        throw new Error("Der GitHub-Stand wurde gleichzeitig geändert. Bitte den Vorgang noch einmal starten.");
      }
      throw error;
    }

    lastCommitSha = commit.sha;
    applyManifest(nextManifest);
    return commit.sha;
  };

  const requireToken = () => {
    if (token()) return true;
    openGithubDialog("Für Uploads und Löschungen zuerst GitHub verbinden.");
    return false;
  };

  const uploadBlobs = async (work, items) => {
    if (!requireToken() || !items.length) return false;
    const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    const additions = items.map((item, index) => {
      const extName = cleanName(item.name || `bild-${index + 1}.jpg`);
      const path = `${workFolder(work.id)}/${stamp}-${String(index + 1).padStart(2, "0")}-${extName}`;
      return { path, blob: item.blob, name: item.name || extName };
    });

    await commitAtomic({
      message: `${work.id}: ${additions.length} Bild${additions.length === 1 ? "" : "er"} hinzufügen`,
      addFiles: additions,
      mutateManifest(next) {
        const entry = getManifestEntry(work.id, next);
        for (const item of additions) {
          entry.uploads.push({ path: item.path, name: item.name, addedAt: new Date().toISOString() });
          entry.hidden = entry.hidden.filter((src) => src !== item.path);
        }
      },
    });
    return true;
  };

  const deleteImage = async (work, image) => {
    if (!requireToken() || !image || image.placeholder) return false;
    const isSynced = Boolean(image.githubSynced && image.githubPath);
    const originalSrc = image.src;
    const deletePaths = [];

    if (isSynced) {
      deletePaths.push(image.githubPath);
    } else if (/^assets\/[A-Za-z0-9_./-]+$/.test(originalSrc)) {
      deletePaths.push(originalSrc);
    }

    await commitAtomic({
      message: `${work.id}: Bild löschen`,
      deletePaths,
      mutateManifest(next) {
        const entry = getManifestEntry(work.id, next);
        if (isSynced) {
          entry.uploads = entry.uploads.filter((item) => item.path !== image.githubPath);
        } else if (!entry.hidden.includes(originalSrc)) {
          entry.hidden.push(originalSrc);
        }
      },
    });
    return true;
  };

  const setMessage = (text, kind = "") => {
    const node = document.querySelector("#github-media-message");
    if (!node) return;
    node.textContent = text;
    node.dataset.kind = kind;
  };

  const renderDialogImages = (work, preferredIndex = 0) => {
    const strip = document.querySelector("#thumbnail-strip");
    const main = document.querySelector("#dialog-main-image");
    if (!strip || !main || !work?.images?.length) return;

    strip.innerHTML = work.images.map((image, index) => `
      <span class="github-media-thumb">
        <button class="github-media-select" type="button" data-github-image-index="${index}" aria-label="Aufnahme ${index + 1} anzeigen">
          <img src="${esc(image.src)}" alt="" loading="lazy" />
        </button>
        ${image.placeholder ? "" : `<button class="github-media-delete" type="button" data-github-delete-index="${index}" title="Bild aus GitHub löschen" aria-label="Aufnahme ${index + 1} löschen">×</button>`}
      </span>`).join("");

    const select = (index) => {
      const safe = Math.max(0, Math.min(index, work.images.length - 1));
      const image = work.images[safe];
      main.src = image.src;
      main.alt = `${work.title || work.id}, Aufnahme ${safe + 1} von ${work.images.length}`;
      strip.dataset.activeIndex = String(safe);
      strip.querySelectorAll("[data-github-image-index]").forEach((button, i) => {
        button.classList.toggle("active", i === safe);
      });
    };

    strip.querySelectorAll("[data-github-image-index]").forEach((button) => {
      button.addEventListener("click", () => select(Number(button.dataset.githubImageIndex)));
    });

    strip.querySelectorAll("[data-github-delete-index]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const index = Number(button.dataset.githubDeleteIndex);
        const image = work.images[index];
        if (!image) return;
        if (!confirm(`Aufnahme ${index + 1} aus ${work.id} wirklich zentral aus GitHub löschen?`)) return;
        button.disabled = true;
        try {
          await deleteImage(work, image);
          renderDialogImages(work, Math.min(index, work.images.length - 1));
          await renderManageList(work);
          setMessage("Bild wurde in GitHub gelöscht und ist damit auf allen Geräten entfernt.", "success");
        } catch (error) {
          console.error(error);
          setMessage(error.message || "Das Bild konnte nicht gelöscht werden.", "error");
          button.disabled = false;
        }
      });
    });

    select(preferredIndex);
  };

  const openLegacyDb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(LEGACY_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(LEGACY_STORE)) {
        const store = db.createObjectStore(LEGACY_STORE, { keyPath: "key" });
        store.createIndex("workId", "workId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const legacyForWork = async (workId) => {
    const db = await openLegacyDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(LEGACY_STORE, "readonly");
        const request = tx.objectStore(LEGACY_STORE).index("workId").getAll(workId);
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } finally { db.close(); }
  };

  const deleteLegacy = async (keys) => {
    if (!keys.length) return;
    const db = await openLegacyDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(LEGACY_STORE, "readwrite");
        const store = tx.objectStore(LEGACY_STORE);
        keys.forEach((key) => store.delete(key));
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } finally { db.close(); }
  };

  const renderManageList = async (work) => {
    const list = document.querySelector("#github-media-list");
    const legacyBox = document.querySelector("#github-legacy-box");
    if (!list || !legacyBox) return;

    const images = (work.images || []).map((image, index) => ({ image, index })).filter(({ image }) => !image.placeholder);
    list.innerHTML = images.length ? images.map(({ image, index }) => `
      <li>
        <img src="${esc(image.src)}" alt="" />
        <span><strong>${image.githubSynced ? esc(image.name || `GitHub-Bild ${index + 1}`) : `Katalogbild ${index + 1}`}</strong><small>${image.githubSynced ? "GitHub-synchronisiert" : "Vorhandenes Katalogbild"}</small></span>
        <button type="button" data-manage-delete="${index}">Bild löschen</button>
      </li>`).join("") : '<li class="github-media-empty">Für dieses Werk ist aktuell kein Bild hinterlegt.</li>';

    const legacy = await legacyForWork(work.id).catch(() => []);
    legacyBox.hidden = legacy.length === 0;
    legacyBox.innerHTML = legacy.length ? `
      <strong>${legacy.length} lokal gespeicherte${legacy.length === 1 ? "s Bild" : " Bilder"} gefunden</strong>
      <span>Diese stammen aus der bisherigen Geräte-Speicherung und sind noch nicht in GitHub.</span>
      <button type="button" id="github-migrate-local">Jetzt zu GitHub synchronisieren</button>` : "";

    legacyBox.querySelector("#github-migrate-local")?.addEventListener("click", async (event) => {
      if (!requireToken()) return;
      const button = event.currentTarget;
      button.disabled = true;
      setMessage("Lokale Bilder werden nach GitHub übertragen …");
      try {
        const current = await legacyForWork(work.id);
        const items = current.map((record, index) => ({
          blob: record.blob,
          name: record.name || `lokales-bild-${index + 1}.jpg`,
        }));
        if (await uploadBlobs(work, items)) {
          await deleteLegacy(current.map((record) => record.key));
          renderDialogImages(work, Math.max(0, work.images.length - items.length));
          await renderManageList(work);
          setMessage("Lokale Bilder wurden nach GitHub übertragen und sind jetzt auf allen Geräten verfügbar.", "success");
        }
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Die lokalen Bilder konnten nicht synchronisiert werden.", "error");
        button.disabled = false;
      }
    });
  };

  const createMediaPanel = () => {
    const info = document.querySelector("#art-dialog .dialog-info");
    if (!info || document.querySelector("#github-media-panel")) return;

    const panel = document.createElement("section");
    panel.id = "github-media-panel";
    panel.className = "dialog-section github-media-panel";
    panel.innerHTML = `
      <div class="github-media-heading">
        <div>
          <h3>Bilder verwalten</h3>
          <p>Uploads und Löschungen werden direkt nach GitHub committed und sind danach auf allen Geräten identisch.</p>
        </div>
        <label class="github-media-upload">
          Bilder hinzufügen
          <input id="github-media-input" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple />
        </label>
      </div>
      <div id="github-legacy-box" class="github-legacy-box" hidden></div>
      <p id="github-media-message" class="github-media-message" aria-live="polite"></p>
      <ul id="github-media-list" class="github-media-list"></ul>`;
    info.insertBefore(panel, document.querySelector("#catalog-details"));

    panel.querySelector("#github-media-input").addEventListener("change", async (event) => {
      const input = event.currentTarget;
      const workId = document.querySelector("#dialog-id")?.textContent?.trim();
      const work = catalog.works.find((item) => item.id === workId);
      const files = Array.from(input.files || []);
      if (!work || !files.length) return;
      if (!requireToken()) { input.value = ""; return; }

      const invalid = files.find((file) => !file.type.startsWith("image/"));
      if (invalid) { setMessage("Bitte nur Bilddateien auswählen.", "error"); input.value = ""; return; }
      const tooLarge = files.find((file) => file.size > 20 * 1024 * 1024);
      if (tooLarge) { setMessage(`„${tooLarge.name}“ ist größer als 20 MB.`, "error"); input.value = ""; return; }

      input.disabled = true;
      setMessage(`${files.length} Bild${files.length === 1 ? "" : "er"} werden nach GitHub übertragen …`);
      try {
        const items = files.map((file) => ({ blob: file, name: file.name }));
        await uploadBlobs(work, items);
        renderDialogImages(work, Math.max(0, work.images.length - files.length));
        await renderManageList(work);
        setMessage("Upload committed. Die Bilder sind jetzt zentral in GitHub gespeichert.", "success");
      } catch (error) {
        console.error(error);
        setMessage(error.message || "Der GitHub-Upload ist fehlgeschlagen.", "error");
      } finally {
        input.disabled = false;
        input.value = "";
      }
    });

    panel.querySelector("#github-media-list").addEventListener("click", (event) => {
      const button = event.target.closest("[data-manage-delete]");
      if (!button) return;
      document.querySelector(`#thumbnail-strip [data-github-delete-index="${button.dataset.manageDelete}"]`)?.click();
    });
  };

  let githubDialog;
  const openGithubDialog = (initialMessage = "") => {
    githubDialog ||= document.querySelector("#github-connect-dialog");
    if (!githubDialog) return;
    const input = githubDialog.querySelector("#github-token-input");
    const message = githubDialog.querySelector("#github-connect-message");
    input.value = token();
    message.textContent = initialMessage;
    githubDialog.showModal();
  };

  const createGithubSettings = () => {
    const nav = document.querySelector(".site-header nav");
    const logout = document.querySelector("#logout-button");
    if (!nav || !logout || document.querySelector("#github-connect-button")) return;

    const button = document.createElement("button");
    button.id = "github-connect-button";
    button.className = "logout-button";
    button.type = "button";
    button.textContent = token() ? "GitHub verbunden" : "GitHub verbinden";
    logout.before(button);

    githubDialog = document.createElement("dialog");
    githubDialog.id = "github-connect-dialog";
    githubDialog.className = "github-connect-dialog";
    githubDialog.innerHTML = `
      <div class="github-connect-card">
        <button type="button" class="github-connect-close" aria-label="Schließen">×</button>
        <p class="login-kicker">GitHub-Synchronisierung</p>
        <h2>GitHub verbinden</h2>
        <p>Hinterlege auf diesem Gerät einen Fine-grained Personal Access Token für <strong>${OWNER}/${REPO}</strong> mit ausschließlich <strong>Contents: Read and write</strong>. Der Token bleibt nur in diesem Browser und wird nie ins Repository geschrieben.</p>
        <label for="github-token-input">Fine-grained Token</label>
        <input id="github-token-input" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…" />
        <p id="github-connect-message" class="github-connect-message" aria-live="polite"></p>
        <div class="github-connect-actions">
          <button type="button" class="github-token-remove">Verbindung entfernen</button>
          <button type="button" class="github-token-save">Prüfen & speichern</button>
        </div>
      </div>`;
    document.body.append(githubDialog);

    const close = () => githubDialog.close();
    githubDialog.querySelector(".github-connect-close").addEventListener("click", close);
    button.addEventListener("click", () => openGithubDialog());

    githubDialog.querySelector(".github-token-save").addEventListener("click", async (event) => {
      const save = event.currentTarget;
      const value = githubDialog.querySelector("#github-token-input").value.trim();
      const message = githubDialog.querySelector("#github-connect-message");
      if (!value) { message.textContent = "Bitte einen Token eingeben."; return; }
      save.disabled = true;
      message.textContent = "GitHub-Zugriff wird geprüft …";
      try {
        await fetchManifestAt(BRANCH, value);
        saveToken(value);
        button.textContent = "GitHub verbunden";
        message.textContent = "Verbindung erfolgreich. Uploads und Löschungen werden jetzt nach GitHub geschrieben.";
        await refreshFromGitHub();
      } catch (error) {
        message.textContent = error.status === 401 || error.status === 403
          ? "Der Token ist ungültig oder hat nicht die benötigte Contents-Berechtigung."
          : (error.message || "GitHub konnte nicht erreicht werden.");
      } finally { save.disabled = false; }
    });

    githubDialog.querySelector(".github-token-remove").addEventListener("click", () => {
      saveToken("");
      githubDialog.querySelector("#github-token-input").value = "";
      githubDialog.querySelector("#github-connect-message").textContent = "GitHub-Verbindung auf diesem Gerät entfernt.";
      button.textContent = "GitHub verbinden";
    });
  };

  const watchDialog = () => {
    const idNode = document.querySelector("#dialog-id");
    if (!idNode) return;
    new MutationObserver(async () => {
      const work = catalog.works.find((item) => item.id === idNode.textContent.trim());
      if (!work) return;
      setMessage("");
      renderDialogImages(work);
      await renderManageList(work);
    }).observe(idNode, { childList: true, characterData: true, subtree: true });

    document.querySelector("#main-image-button")?.addEventListener("click", (event) => {
      const main = document.querySelector("#dialog-main-image");
      const lightbox = document.querySelector("#lightbox");
      const image = document.querySelector("#lightbox-image");
      if (!main?.src || !lightbox || !image) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      image.src = main.src;
      image.alt = main.alt || "Vergrößerte Aufnahme";
      lightbox.showModal();
    }, true);
  };

  const init = async () => {
    createGithubSettings();
    createMediaPanel();
    watchDialog();
    try {
      manifest = await fetchManifestAt(BRANCH, token());
      applyManifest(manifest);
    } catch (error) {
      console.error("GitHub-Medienmanifest konnte nicht geladen werden.", error);
      setMessage("Der zentrale GitHub-Bildstand konnte nicht geladen werden.", "error");
    }
    const currentId = document.querySelector("#dialog-id")?.textContent?.trim();
    const current = catalog.works.find((item) => item.id === currentId);
    if (current) {
      renderDialogImages(current);
      await renderManageList(current);
    }
  };

  init();
})();
