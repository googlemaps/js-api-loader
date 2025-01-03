import { APILoadingError, type APIOptions, bootstrapLoader } from "./loader";

// fixme: remove the second importLibrary signature and ApiLibraryMap interface
//   once proper typings are implemented in @types/google.maps
//   (https://github.com/googlemaps/js-types/issues/95)

interface APILibraryMap {
  core: google.maps.CoreLibrary;
  drawing: google.maps.DrawingLibrary;
  elevation: google.maps.ElevationLibrary;
  geocoding: google.maps.GeocodingLibrary;
  geometry: google.maps.GeometryLibrary;
  journeySharing: google.maps.JourneySharingLibrary;
  maps: google.maps.MapsLibrary;
  maps3d: google.maps.Maps3DLibrary;
  marker: google.maps.MarkerLibrary;
  places: google.maps.PlacesLibrary;
  routes: google.maps.RoutesLibrary;
  streetView: google.maps.StreetViewLibrary;
  visualization: google.maps.VisualizationLibrary;
}

type APILibraryName = keyof APILibraryMap;

let isBootrapped_ = false;
let options_: APIOptions = {};
const libraries_: Partial<APILibraryMap> = {};

/**
 * Sets the options for the Maps JavaScript API.
 * Has to be called before any library is loaded for the first time.
 * Will throw an error after a library has been loaded for the first time.
 */
export function setOptions(options: APIOptions) {
  if (isBootrapped_) {
    throw new Error(
      "options cannot be modified after the API has been loaded."
    );
  }

  options_ = options;
}

/**
 * Import the specified library.
 */
export async function importLibrary(
  ...p: Parameters<typeof google.maps.importLibrary>
): ReturnType<typeof google.maps.importLibrary>;

export async function importLibrary<
  TLibraryName extends keyof APILibraryMap,
  TLibrary extends APILibraryMap[TLibraryName],
>(libraryName: TLibraryName): Promise<TLibrary> {
  if (!isBootrapped_) {
    bootstrapLoader(options_);
    isBootrapped_ = true;
  }

  if (!libraries_[libraryName]) {
    try {
      const library = (await google.maps.importLibrary(
        libraryName
      )) as TLibrary;
      libraries_[libraryName] = library;
    } catch (error) {
      if (error instanceof APILoadingError) {
        isBootrapped_ = false;
        throw new Error("The Google Maps JavaScript API failed to load.");
      }

      throw error;
    }
  }

  return libraries_[libraryName] as TLibrary;
}

/**
 * Synchronously loads a library. Will directly return the library, or null
 * if it hasn't been loaded.
 */
export function getImportedLibrary<
  TLibraryName extends APILibraryName,
  TLibrary extends APILibraryMap[TLibraryName],
>(libraryName: TLibraryName): TLibrary | null {
  if (!isLibraryImported(libraryName)) {
    throw new Error(`library ${libraryName} hasn't been imported.`);
  }

  return libraries_[libraryName] as TLibrary;
}

/**
 * Check if the given library has already been loaded.
 */
export function isLibraryImported(libraryName: APILibraryName): boolean {
  return libraryName in libraries_;
}

const api = {
  setOptions,
  importLibrary,
  getImportedLibrary,
  isLibraryImported,
};

export default api;