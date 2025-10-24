import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

// Configure the Google Maps API
setOptions({
  apiKey: "YOUR_API_KEY",
  version: "weekly",
});

// Initialize the map
async function initMap() {
  const { Map } = await importLibrary("maps");

  return new Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
  });
}

// Load markers
async function addMarkers(map) {
  const { AdvancedMarkerElement } = await importLibrary("marker");

  const marker = new AdvancedMarkerElement({
    position: { lat: 37.7749, lng: -122.4194 },
    title: "San Francisco",
  });
  marker.map = map;
}

// Start the application
initMap()
  .then((map) => addMarkers(map))
  .catch(console.error);
