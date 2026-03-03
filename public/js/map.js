// public/js/map.js
// Uses Leaflet + OpenStreetMap to display a map for a listing

document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("map");
  if (!mapEl) return;

  // Make sure Leaflet is loaded
  if (typeof L === "undefined") {
    console.error("Leaflet library not loaded. Map cannot be displayed.");
    mapEl.innerHTML = '<p style="text-align:center;padding:1rem;">Map could not be loaded.</p>';
    return;
  }

  const lat = parseFloat(mapEl.dataset.lat);
  const lng = parseFloat(mapEl.dataset.lng);
  const title = mapEl.dataset.title || "Location";

  // If coordinates are missing or both zero (default), show a message
  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
    mapEl.innerHTML = '<p style="text-align:center;padding:1rem;color:#888;">Exact location will appear on the map after coordinates are set.</p>';
    return;
  }

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${title}</b>`)
    .openPopup();

  // Fix tile rendering after container becomes visible
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
});
