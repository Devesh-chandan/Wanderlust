// Utility to convert an address string to latitude/longitude using OpenStreetMap Nominatim
// Returns a promise that resolves to [longitude, latitude] or rejects if not found
// Nominatim rate limits 1 request per second; adjust as needed.

async function geocode(address) {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Major‑Project1/1.0 (https://github.com/your-repo)"
    }
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.length) {
    throw new Error("Address not found");
  }
  const { lon, lat } = data[0];
  return [parseFloat(lon), parseFloat(lat)];
}

module.exports = { geocode };
