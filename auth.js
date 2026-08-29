(() => {
  "use strict";

  const PASSWORD_HASH = "cac592cb8886842647af4f64127e5c73f037413fcac1648fd03b11ea34ac4028";
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

  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  const unlock = async () => {
    loginScreen.hidden = true;
    protectedContent.hidden = false;
    document.body.classList.remove("auth-pending");
    document.body.classList.add("authenticated");

    try {
      await loadScript("catalog.js?v=auth1");
      await loadScript("app.js?v=auth1");
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
      if (await hash(passwordInput.value) === PASSWORD_HASH) {
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
