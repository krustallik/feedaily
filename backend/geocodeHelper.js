const GEOAPIFY_API_KEY = "5d90eb12d82b4a0f89c7a04b82faab81"; // Replace with your key

async function getPlaceNameFromCoords(lat, lon) {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch from Geoapify");
    }
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].properties.formatted;
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point in decimal degrees
 * @param {number} lon1 - Longitude of first point in decimal degrees
 * @param {number} lat2 - Latitude of second point in decimal degrees
 * @param {number} lon2 - Longitude of second point in decimal degrees
 * @returns {number} Distance in kilometers
 */
const TO_RAD = Math.PI / 180;
const R = 6371; // km

function calculateDistance(lat1, lon1, lat2, lon2) {
  const φ1 = lat1 * TO_RAD, φ2 = lat2 * TO_RAD;
  const dφ = (lat2 - lat1) * TO_RAD;
  const dλ = (lon2 - lon1) * TO_RAD;

  const hφ = dφ * 0.5, hλ = dλ * 0.5;
  const s1 = Math.sin(hφ);
  const s2 = Math.sin(hλ);
  const a = s1*s1 + Math.cos(φ1) * Math.cos(φ2) * s2*s2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export { getPlaceNameFromCoords, calculateDistance };