const LANG_KEY = "lang";
const translations = {
  en: null,
  ar: null,
};

// Get the root URL of the application
function getRootUrl() {
  const currentUrl = window.location.href;
  const index = currentUrl.indexOf("nmu-dorm-app");
  const rootUrl = currentUrl.substring(0, index + "nmu-dorm-app".length);
  return rootUrl;
}

// Fetch translations for the specified language
function fetchTranslations(url, lang) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${lang} translations`);
      }
      return response.json();
    })
    .then((data) => {
      translations[lang] = data;
      setLanguage(lang, true);
    })
    .catch((error) => {
      console.error(error);
    });
}

// Toggle between languages
function toggleLanguage() {
  const currentLang = localStorage.getItem(LANG_KEY) || "en";
  const newLang = currentLang === "en" ? "ar" : "en";
  const rootUrl = getRootUrl();

  if (translations[newLang]) {
    setLanguage(newLang, true);
  } else {
    fetchTranslations(rootUrl + `/assets/compiled/languages/${newLang}.json`, newLang);
  }
}

// Update the stylesheet links to switch between LTR and RTL styles
function updateStylesheet(oldStyle, newStyle) {
  var stylesheet = document.querySelector('link[href$="' + oldStyle + '"]');
  if (stylesheet) {
    var currentURL = stylesheet.href;
    var newURL = currentURL.replace(oldStyle, newStyle);
    stylesheet.href = newURL;
  } else {
    console.error("No matching stylesheet found for " + oldStyle);
  }
}

// Set the language and update the UI accordingly
function setLanguage(lang, persist = false) {
  if (lang === "ar") {
    document.documentElement.setAttribute("dir", "rtl");
    updateStylesheet("app.css", "app.rtl.css");
    updateStylesheet("app-dark.css", "app-dark.rtl.css");
    if(hasDataTable()){
      updateStylesheet("table-datatable-jquery.css", "table-datatable-jquery.rtl.css");
      updateStylesheet("table-datatable.css", "table-datatable.rtl.css");
    }
  } else if(lang === 'en') {
    document.documentElement.setAttribute("dir", "ltr");
    updateStylesheet("app.rtl.css", "app.css");
    updateStylesheet("app-dark.rtl.css", "app-dark.css");
    if(hasDataTable()){
      updateStylesheet("table-datatable-jquery.rtl.css", "table-datatable-jquery.css");
     updateStylesheet("table-datatable.rtl.css", "table-datatable.css");
    }

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

// Update the DataTable styles based on the language direction
function hasDataTable() {
  return $('.dataTable').length > 0 || $('#table1').length > 0;
}

function initializeLanguageToggle() {
  const langToggleBtn = document.getElementById("toggle-language");

  let selectedLang;

  const savedLang = localStorage.getItem(LANG_KEY);
  if (savedLang) {
    selectedLang = savedLang;
    if (selectedLang !== localStorage.getItem(LANG_KEY)) {
      setLanguage(selectedLang);
    }
  } else {
    selectedLang = "en"; // Default language
    setLanguage(selectedLang, true);
  }

  // Add event listener to language toggle button
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => toggleLanguage());
  }

  return selectedLang;
}

// Initialize the language toggle on page load
const currentLang = initializeLanguageToggle();



// Initialize the language toggle on page load
document.addEventListener("DOMContentLoaded", initializeLanguageToggle);
