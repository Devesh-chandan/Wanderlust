/**
 * Wanderlust Google Translate Integration & Language Switcher
 */

function getGoogleTranslateLang() {
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  if (match && match[1]) {
    const parts = decodeURIComponent(match[1]).split("/");
    return parts[parts.length - 1] || "en";
  }
  return localStorage.getItem("wanderlust_lang") || "en";
}

function changeLanguage(langCode) {
  localStorage.setItem("wanderlust_lang", langCode);
  const domain = window.location.hostname;

  if (langCode === "en") {
    // Clear cookies for default language
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
  } else {
    // Set googtrans cookie: /en/langCode
    const cookieVal = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${domain};`;
  }

  // Attempt inline combo change first
  const combo = document.querySelector(".goog-te-combo");
  if (combo) {
    combo.value = langCode;
    combo.dispatchEvent(new Event("change"));
  }
  
  // Reload page to apply full translation across DOM
  setTimeout(() => {
    window.location.reload();
  }, 150);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentLang = getGoogleTranslateLang();

  document.querySelectorAll(".lang-selector-select").forEach((select) => {
    select.value = currentLang;
    select.addEventListener("change", (e) => {
      changeLanguage(e.target.value);
    });
  });

  // Runtime safeguard to prevent Google Translate from injecting body top offsets
  setInterval(() => {
    if (document.body && document.body.style.top !== "0px" && document.body.style.top !== "") {
      document.body.style.top = "0px";
    }
    if (document.body && document.body.style.marginTop !== "0px" && document.body.style.marginTop !== "") {
      document.body.style.marginTop = "0px";
    }
  }, 250);
});
