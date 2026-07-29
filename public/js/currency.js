/**
 * Wanderlust Currency Converter System
 * Base Currency: INR (₹)
 * Supported Currencies: INR (₹), USD ($), EUR (€), GBP (£)
 */

const currencyRates = {
  INR: { symbol: "₹", rate: 1.0, locale: "en-IN" },
  USD: { symbol: "$", rate: 0.012, locale: "en-US" },
  EUR: { symbol: "€", rate: 0.011, locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.0094, locale: "en-GB" }
};

const CURRENCY_KEY = "wanderlust_selected_currency";

function getStoredCurrency() {
  return localStorage.getItem(CURRENCY_KEY) || "INR";
}

function convertAndFormatPrice(basePriceINR, currencyCode) {
  const info = currencyRates[currencyCode] || currencyRates.INR;
  const converted = Math.round(basePriceINR * info.rate);
  return `${info.symbol}${converted.toLocaleString(info.locale)}`;
}

function updatePageCurrency(currCode) {
  const info = currencyRates[currCode] || currencyRates.INR;

  // Update all price elements with class .listing-price and data-base-price attribute
  document.querySelectorAll(".listing-price").forEach((el) => {
    const basePrice = parseFloat(el.getAttribute("data-base-price"));
    if (!isNaN(basePrice)) {
      el.textContent = convertAndFormatPrice(basePrice, currCode);
    }
  });

  // Sync all currency select dropdowns
  document.querySelectorAll(".currency-selector-select").forEach((select) => {
    select.value = currCode;
  });

  // Store in localStorage
  localStorage.setItem(CURRENCY_KEY, currCode);
}

function setCurrency(currCode) {
  if (currencyRates[currCode]) {
    updatePageCurrency(currCode);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const currentCurrency = getStoredCurrency();
  updatePageCurrency(currentCurrency);

  // Attach change listener to all currency selects
  document.querySelectorAll(".currency-selector-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      setCurrency(e.target.value);
    });
  });
});
