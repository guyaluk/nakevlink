/**
 * Geocoding Service using OpenStreetMap Nominatim API
 * Free geocoding service with rate limiting and error handling
 */

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName?: string;
}

export interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

// Rate limiting: Nominatim allows 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds to be safe

/**
 * Rate limiting utility
 */
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
}

/**
 * Geocode an address using OpenStreetMap Nominatim API
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  if (!address || address.trim().length === 0) {
    console.warn('Geocoding: Empty address provided');
    return null;
  }

  try {
    // Apply rate limiting
    await waitForRateLimit();

    // Clean and encode the address
    const cleanAddress = address.trim();
    const encodedAddress = encodeURIComponent(cleanAddress);

    // Nominatim API endpoint
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&addressdetails=1`;

    console.log(`Geocoding address: "${cleanAddress}"`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Nakevlink-App/1.0 (punch-card-app)', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: NominatimResponse[] = await response.json();

    if (!data || data.length === 0) {
      console.warn(`Geocoding: No results found for address: "${cleanAddress}"`);
      return null;
    }

    const result = data[0];
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Geocoding: Invalid coordinates returned:', result);
      return null;
    }

    const geocodingResult: GeocodingResult = {
      latitude,
      longitude,
      displayName: result.display_name,
    };

    console.log(`Geocoding success: "${cleanAddress}" -> ${latitude}, ${longitude}`);
    return geocodingResult;

  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Geocode with retry logic
 */
export async function geocodeAddressWithRetry(
  address: string,
  maxRetries: number = 2
): Promise<GeocodingResult | null> {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const result = await geocodeAddress(address);
      if (result) {
        return result;
      }

      // If no result but no error, don't retry
      return null;

    } catch (error) {
      console.error(`Geocoding attempt ${attempt} failed:`, error);

      if (attempt === maxRetries + 1) {
        console.error(`Geocoding failed after ${maxRetries + 1} attempts for: "${address}"`);
        return null;
      }

      // Wait before retry (exponential backoff)
      const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }

  return null;
}

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}