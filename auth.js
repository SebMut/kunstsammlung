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
    try {
      return localStorage.getItem(PASSWORD_HASH_KEY) || DEFAULT_PASSWORD_HASH;
    } catch {
      return DEFAULT_PASSWORD_HASH;
    }
  };

  const savePasswordHash = (value) => {
    localStorage.setItem(PASSWORD_HASH_KEY, value);
  };

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

    const style = document.createElement("style");
    style.id = "password-change-styles";
    style.textContent = `
      .password-change-dialog {
        width: min(500px, calc(100vw - 32px));
        max-width: none;
        padding: 0;
        border: 0;
        background: var(--white);
        color: var(--ink);
      }
      .password-change-dialog::backdrop {
        background: rgba(16, 18, 16, .66);
        backdrop-filter: blur(5px);
      }
      .password-change-card { position: relative; padding: 38px; }
      .password-change-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 36px;
        height: 36px;
        border: 1px solid var(--line);
        border-radius: 50%;
        background: transparent;
        color: var(--muted);
        font-size: 22px;
        line-height: 1;
      }
      .password-change-card h2 {
        margin: 8px 0 12px;
        font-family: var(--serif);
        font-size: 42px;
        font-weight: 300;
        line-height: 1;
      }
      .password-change-intro {
        margin: 0 0 28px;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.6;
      }
      .password-change-form label {
        display: block;
        margin: 18px 0 8px;
        color: var(--muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .1em;
        text-transform: uppercase;
      }
      .password-change-form input {
        width: 100%;
        height: 50px;
        padding: 0 14px;
        border: 1px solid var(--line);
        border-radius: 0;
        outline: 0;
        background: rgba(250,249,246,.65);
        color: var(--ink);
      }
      .password-change-form input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent);
      }
      .password-change-message {
        min-height: 21px;
        margin: 10px 0 4px;
        color: var(--accent);
        font-size: 12px;
      }
      .password-change-message.success { color: #4c694f; }
      .password-change-actions {
        margin-top: 22px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .password-change-actions button {
        min-height: 44px;
        padding: 0 16px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--ink);
      }
      .password-change-actions button[type="submit"] {
        border-color: var(--ink);
        background: var(--ink);
        color: var(--white);
      }
      .password-change-actions button[type="submit"]:hover {
        border-color: var(--accent);
        background: var(--accent);
      }
      .password-change-actions button:disabled { cursor: wait; opacity: .64; }
      @media (max-width: 780px) {
        .site-header nav { gap: 8px; }
        .password-change-card { padding: 34px 22px 26px; }
        .password-change-card h2 { font-size: 36px; }
        .password-change-actions { flex-direction: column-reverse; }
        .password-change-actions button { width: 100%; }
      }
    `;
    document.head.append(style);

    const changeButton = document.createElement("button");
    changeButton.className = "logout-button";
    changeButton.id = "change-password-button";
    changeButton.type = "button";
    changeButton.textContent = "Passwort ändern";
    logoutButton.before(changeButton);

    const dialog = document.createElement("dialog");
    dialog.className = "password-change-dialog";
    dialog.id = "password-change-dialog";
    dialog.setAttribute("aria-labelledby", "password-change-title");
    dialog.innerHTML = `
      <div class="password-change-card">
        <button class="password-change-close" id="password-change-close" type="button" aria-label="Passwortdialog schließen">×</button>
        <p class="login-kicker">Geschützter Bereich</p>
        <h2 id="password-change-title">Passwort ändern</h2>
        <p class="password-change-intro">Das neue Passwort ersetzt das bisherige Passwort auf diesem Gerät und in diesem Browser.</p>
        <form class="password-change-form" id="password-change-form" novalidate>
          <label for="new-password">Neues Passwort</label>
          <input id="new-password" type="password" autocomplete="new-password" required />
          <label for="confirm-password">Neues Passwort bestätigen</label>
          <input id="confirm-password" type="password" autocomplete="new-password" required />
          <p class="password-change-message" id="password-change-message" role="status" aria-live="polite"></p>
          <div class="password-change-actions">
            <button id="password-change-cancel" type="button">Abbrechen</button>
            <button id="password-change-submit" type="submit">Neues Passwort speichern</button>
          </div>
        </form>
      </div>
    `;
    document.body.append(dialog);

    const form = dialog.querySelector("#password-change-form");
    const newPassword = dialog.querySelector("#new-password");
    const confirmPassword = dialog.querySelector("#confirm-password");
    const message = dialog.querySelector("#password-change-message");
    const submit = dialog.querySelector("#password-change-submit");

    const closeDialog = () => {
      form.reset();
      message.textContent = "";
      message.classList.remove("success");
      dialog.close();
    };

    changeButton.addEventListener("click", () => {
      form.reset();
      message.textContent = "";
      message.classList.remove("success");
      dialog.showModal();
      newPassword.focus();
    });

    dialog.querySelector("#password-change-close").addEventListener("click", closeDialog);
    dialog.querySelector("#password-change-cancel").addEventListener("click", closeDialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "";
      message.classList.remove("success");

      if (!newPassword.value) {
        message.textContent = "Bitte geben Sie ein neues Passwort ein.";
        newPassword.focus();
        return;
      }

      if (newPassword.value.length < 6) {
        message.textContent = "Das neue Passwort muss mindestens 6 Zeichen lang sein.";
        newPassword.focus();
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        message.textContent = "Die beiden Passwörter stimmen nicht überein.";
        confirmPassword.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = "Wird gespeichert …";

      try {
        savePasswordHash(await hash(newPassword.value));
        message.textContent = "Passwort wurde geändert.";
        message.classList.add("success");
        form.reset();
        setTimeout(() => {
          if (dialog.open) dialog.close();
        }, 700);
      } catch {
        message.textContent = "Das Passwort konnte in diesem Browser nicht gespeichert werden.";
      } finally {
        submit.disabled = false;
        submit.textContent = "Neues Passwort speichern";
      }
    });
  };

  const unlock = async () => {
    loginScreen.hidden = true;
    protectedContent.hidden = false;
    document.body.classList.remove("auth-pending");
    document.body.classList.add("authenticated");

    try {
      await loadScript("catalog.js?v=auth1");
      await loadScript("app.js?v=auth1");
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
    passwordToggle.setAttribute("aria-label", show ? "Passwort verbergen" : "Passwort anzeigen");
    passwordInput.focus();
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginError.textContent = "";

    if (!passwordInput.value) {
      loginError.textContent = "Bitte geben Sie das Passwort ein.";
      passwordInput.focus();
      return;
    }

    loginSubmit.disabled = true;
    loginSubmit.firstChild.textContent = "Wird geprüft … ";

    try {
      if (await hash(passwordInput.value) === getPasswordHash()) {
        sessionStorage.setItem(SESSION_KEY, "granted");
        passwordInput.value = "";
        await unlock();
        return;
      }

      loginError.textContent = "Das Passwort ist nicht korrekt.";
      passwordInput.select();
    } catch {
      loginError.textContent = "Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es erneut.";
    }

    loginSubmit.disabled = false;
    loginSubmit.firstChild.textContent = "Sammlung öffnen ";
  });

  if (sessionStorage.getItem(SESSION_KEY) === "granted") {
    unlock();
  }
})();
