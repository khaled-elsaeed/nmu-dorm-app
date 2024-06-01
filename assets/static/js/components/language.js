const LANG_KEY = "lang";

document.addEventListener("DOMContentLoaded", function () {
  const langToggleBtn = document.getElementById("toggle-language");

  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => toggleLanguage());
  }

  const translations = {
    en: null,
    ar: null,
  };

  // Fetch translations
  fetch("assets/compiled/languages/en.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch English translations");
      }
      return response.json();
    })
    .then((data) => {
      translations.en = data;
      checkLanguage();
    })
    .catch((error) => {
      console.error(error);
    });

  fetch("assets/compiled/languages/ar.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch Arabic translations");
      }
      return response.json();
    })
    .then((data) => {
      translations.ar = data;
      checkLanguage();
    })
    .catch((error) => {
      console.error(error);
    });

  function checkLanguage() {
    const savedLang = localStorage.getItem(LANG_KEY) || "en";
    if (translations.en && translations.ar) {
      setLanguage(savedLang);
    }
  }

  function toggleLanguage() {
    const currentLang = localStorage.getItem(LANG_KEY) || "en";
    const newLang = currentLang === "en" ? "ar" : "en";
    setLanguage(newLang, true);
  }

  function setLanguage(lang, persist = false) {
    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      loadStylesheet("./assets/compiled/css/app.rtl.css");
      loadStylesheet("./assets/compiled/css/app-dark.rtl.css");
      removeStylesheet("./assets/compiled/css/app.css");
      removeStylesheet("./assets/compiled/css/app-dark.css");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      loadStylesheet("./assets/compiled/css/app.css");
      loadStylesheet("./assets/compiled/css/app-dark.css");
      removeStylesheet("./assets/compiled/css/app.rtl.css");
      removeStylesheet("./assets/compiled/css/app-dark.rtl.css");
    }

    if (persist) {
      localStorage.setItem(LANG_KEY, lang);
    }

    const translation = translations[lang];
    document.documentElement.lang = lang;

    // Update text content
    document.querySelectorAll("[data-translate-key]").forEach((element) => {
      const key = element.getAttribute("data-translate-key");
      element.textContent = translation[key] || element.textContent;
    });
  }

  function loadStylesheet(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function removeStylesheet(href) {
    const links = document.querySelectorAll(`link[href="${href}"]`);
    links.forEach((link) => link.remove());
  }
});
