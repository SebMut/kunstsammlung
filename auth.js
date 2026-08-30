(() => {
  "use strict";

  const DEFAULT_PASSWORD_HASH = "cac592cb8886842647af4f64127e5c73f037413fcac1648fd03b11ea34ac4028";
  const PASSWORD_HASH_KEY = "kunstsammlung-password-hash-v1";
  const SESSION_KEY = "kunstsammlung-access-v1";

  const loginScreen = document.querySelector("#login-screen");
  const protectedContent = document.querySelector("#protected-content");
  const loginForm = document.querySelector("#login-form");
  const passwordInput = document.querySelector("#login-password");
  const passwordToggle = document.querySelector("#password-toggle");
  const loginError = document.querySelector("#login-error");
  const loginSubmit = document.querySelector("#login-submit");

  const hash = async (value) => {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const getPasswordHash = () => {
    try { return localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_PASSWORD_HASH; }
    catch { return DEFAULT_PASSWORD_HASH; }
  };

  const savePasswordHash = (value) => localStorage.setItem(PASSWORD_HASH_KEY, value);

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  const setupPasswordChange = () => {
    if (document.querySelector("#change-password-button")) return;
    const logoutButton = document.querySelector("#logout-button");
    if (!logoutButton) return;

    const changeButton = document.createElement("button");
    changeButton.className = "logout-button";
    changeButton.id = "change-password-button";
    changeButton.type = "button";
    changeButton.textContent = "Passwort ändern";
    logoutButton.before(changeButton);

    const dialog = document.createElement("dialog");
    dialog.className = "password-change-dialog";
    dialog.innerHTML = `
      <div class="password-change-card">
        <button class="password-change-close" type="button" aria-label="Schließen">×</button>
        <p class="login-kicker">Geschützter Bereich</p>
        <h2>Passwort ändern</h2>
        <p class="password-change-intro">Das neue Passwort gilt auf diesem Gerät und in diesem Browser.</p>
        <form class="password-change-form" novalidate>
          <label for="new-password">Neues Passwort</label>
          <input id="new-password" type="password" autocomplete="new-password" required />
          <label for="confirm-password">Neues Passwort bestätigen</label>
          <input id="confirm-password" type="password" autocomplete="new-password" required />
          <p class="password-change-message" role="status" aria-live="polite"></p>
          <div class="password-change-actions">
            <button class="password-change-cancel" type="button">Abbrechen</button>
            <button class="password-change-submit" type="submit">Neues Passwort speichern</button>
          </div>
        </form>
      </div>`;
    document.body.append(dialog);

    const form = dialog.querySelector("form");
    const first = dialog.querySelector("#new-password");
    const second = dialog.querySelector("#confirm-password");
    const message = dialog.querySelector(".password-change-message");
    const submit = dialog.querySelector(".password-change-submit");
    const close = () => { form.reset(); message.textContent = ""; dialog.close(); };

    changeButton.addEventListener("click", () => { form.reset(); message.textContent = ""; dialog.showModal(); first.focus(); });
    dialog.querySelector(".password-change-close").addEventListener("click", close);
    dialog.querySelector(".password-change-cancel").addEventListener("click", close);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "";
      if (first.value.length < 6) { message.textContent = "Das neue Passwort muss mindestens 6 Zeichen lang sein."; first.focus(); return; }
      if (first.value !== second.value) { message.textContent = "Die beiden Passwörter stimmen nicht überein."; second.focus(); return; }
      submit.disabled = true;
      try {
        savePasswordHash(await hash(first.value));
        message.textContent = "Passwort wurde geändert.";
        form.reset();
        setTimeout(() => { if (dialog.open) dialog.close(); }, 700);
      } catch { message.textContent = "Das Passwort konnte nicht gespeichert werden."; }
      finally { submit.disabled = false; }
    });
  };

  const unlock = async () => {
    loginScreen.hidden = true;
    protectedContent.hidden = false;
    document.body.classList.remove("auth-pending");
    document.body.classList.add("authenticated");
    try {
      await loadScript("catalog.js?v=auth3");
      await loadScript("catalog-extra.js?v=1");
      await loadScript("catalog-extra-081.js?v=2");
      await loadScript("catalog-extra-086.js?v=1");
      await loadScript("app.js?v=auth3");
      setupPasswordChange();
      document.querySelector("#logout-button")?.addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        location.hash = "";
        location.reload();
      });
    } catch {
      protectedContent.hidden = true;
      loginScreen.hidden = false;
      loginError.textContent = "Der Katalog konnte nicht geladen werden. Bitte laden Sie die Seite neu.";
    }
  };

  passwordToggle.addEventListener("click", () => {
    const show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    passwordToggle.textContent = show ? "Verbergen" : "Anzeigen";
    passwordInput.focus();
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.textContent = "";
    if (!passwordInput.value) { loginError.textContent = "Bitte geben Sie das Passwort ein."; return; }
    loginSubmit.disabled = true;
    try {
      if (await hash(passwordInput.value) === getPasswordHash()) {
        sessionStorage.setItem(SESSION_KEY, "granted");
        passwordInput.value = "";
        await unlock();
        return;
      }
      loginError.textContent = "Das Passwort ist nicht korrekt.";
      passwordInput.select();
    } catch { loginError.textContent = "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut."; }
    loginSubmit.disabled = false;
  });

  if (sessionStorage.getItem(SESSION_KEY) === "granted") unlock();
})();
