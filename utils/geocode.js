// Utility to convert an address string to [longitude, latitude] using OpenStreetMap Nominatim.
// Returns [longitude, latitude] or throws if the address cannot be found.
// Nominatim rate-limits to 1 request/second — respect that in production.

async function geocode(address) {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;

    const response = await fetch(url, {
        headers: {
            // Bug fix: original had a Unicode em-dash (‑) in the User-Agent string
            // which can cause API request failures. Using a plain ASCII hyphen.
            "User-Agent": "Wanderlust-App/1.0 (educational project)",
        },
    });

    if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.length) {
        throw new Error(`Address not found: "${address}"`);
    }

    const { lon, lat } = data[0];
    return [parseFloat(lon), parseFloat(lat)];
}

module.exports = { geocode };
