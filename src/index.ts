/*
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { bootstrap as bootstrapInternal } from "./bootstrap.js";

import {
  logDevNotice,
  logDevWarning,
  logError,
  ERR_KEY_VERSION_MISMATCH,
  INFO_LOADED_WITHOUT_OPTIONS,
  WARN_LANGUAGE_REGION_NOT_COMPATIBLE,
  WARN_SET_OPTIONS_AFTER_BOOTSTRAP,
} from "./messages.js";

export type APIOptions = {
  key?: string;

  v?: string;
  libraries?: string | string[];
  language?: string;
  region?: string;
  authReferrerPolicy?: string;
  mapIds?: string | string[];
  channel?: string;
  solutionChannel?: string;
};

// FIXME: remove the second importLibrary signature and ApiLibraryMap interface
//   once proper typings are implemented in @types/google.maps
//   (https://issuetracker.google.com/issues/423116767)

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
    logDevWarning(WARN_SET_OPTIONS_AFTER_BOOTSTRAP);
    return;
  }

  options_ = options;
}

/**
 * Import the specified library.
 */
export async function importLibrary(
  ...parameters: Parameters<typeof google.maps.importLibrary>
): ReturnType<typeof google.maps.importLibrary>;

export async function importLibrary<TLibraryName extends APILibraryName>(
  libraryName: TLibraryName
): Promise<APILibraryMap[TLibraryName]> {
  if (!isBootrapped_) {
    bootstrap(options_);
    isBootrapped_ = true;
  }

  if (!libraries_[libraryName]) {
    libraries_[libraryName] = (await google.maps.importLibrary(
      libraryName
    )) as APILibraryMap[TLibraryName];
  }

  return libraries_[libraryName] as APILibraryMap[TLibraryName];
}

/**
 * The bootstrap function makes sure that a usable version of the
 * google.maps.importLibrary function exists and loading of the maps API is
 * started.
 */
function bootstrap(options: APIOptions) {
  // check for maps JS already being loaded
  const scriptEl = document.querySelector(
    'script[src*="maps.googleapis.com/maps/api/js"]'
  ) as HTMLScriptElement | null;

  if (!scriptEl) {
    bootstrapInternal(options);
    return;
  }

  // Check the parameters to be compatible with `options` passed to this function:
  // - a different api key or different version will log an error
  // - different language or region will trigger warning in dev-mode
  // - in any other case we just log an informational message in dev-mode
  const scriptOptions = getOptionsFromURL(scriptEl.src);
  if (scriptOptions.key !== options.key || scriptOptions.v !== options.v) {
    logError(ERR_KEY_VERSION_MISMATCH(options, scriptOptions));
  } else if (
    scriptOptions.language !== options.language ||
    scriptOptions.region !== options.region
  ) {
    logDevWarning(WARN_LANGUAGE_REGION_NOT_COMPATIBLE(options, scriptOptions));
  } else {
    logDevNotice(INFO_LOADED_WITHOUT_OPTIONS);
  }

  // there is a script tag, and importLibrary is defined, so we're all set
  if (window.google?.maps?.importLibrary) return;

  // maps JS is currently being loaded, but wasn't loaded with the dynamic
  // import snipped. In this case, the importLibrary bootstrap function has to
  // be provided
  const scriptLoadedPromise = new Promise<void>((resolve, reject) => {
    // FIXME: it would probably be more precise to intercept (override and call
    //   the original) the callback function specified in
    //   `scriptOptions.callback`, but the load event should be sufficient.
    scriptEl.addEventListener("load", () => resolve());
    scriptEl.addEventListener("error", () => reject());
  });

  const importLibraryStub = async (name: string) => {
    await scriptLoadedPromise;

    // only do the recursive call if the importLibrary function has been replaced
    if (google.maps.importLibrary === importLibraryStub) {
      // FIXME: this shouldn't be possible. How should we handle this?
    } else {
      return google.maps.importLibrary(name);
    }
  };

  if (!window.google) window.google = {} as unknown as typeof google;
  if (!window.google.maps)
    window.google.maps = {} as unknown as typeof google.maps;

  google.maps.importLibrary = importLibraryStub;
}

function getOptionsFromURL(url: string): Partial<APIOptions> {
  const scriptParams = new URL(url).searchParams;
  const scriptOpts: Partial<APIOptions> = {};
  for (const [key, value] of scriptParams.entries()) {
    const optName = key.replace(/_[a-z]/g, (s: string) =>
      s.charAt(1).toUpperCase()
    ) as keyof APIOptions;

    if (optName === "libraries") {
      scriptOpts.libraries = value.split(",");
    } else {
      scriptOpts[optName] = value;
    }
  }

  return scriptOpts;
}

const api = {
  setOptions,
  importLibrary,
};

export default api;

// stub implementation for
export { Loader } from "./deprecated.js";
