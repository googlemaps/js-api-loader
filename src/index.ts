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

import { bootstrap } from "./bootstrap.js";

import {
  logDevNotice,
  logDevWarning,
  MSG_IMPORT_LIBRARY_EXISTS,
  MSG_SCRIPT_ELEMENT_EXISTS,
  MSG_REPEATED_SET_OPTIONS,
  MSG_SET_OPTIONS_NOT_CALLED,
} from "./messages.js";

export type APIOptions = {
  key?: string;
  v?: string;
  language?: string;
  region?: string;
  libraries?: string[];
  authReferrerPolicy?: string;
  mapIds?: string[];
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

// Development mode check - bundlers will replace process.env.NODE_ENV at build time
declare const process: { env: { NODE_ENV?: string } };
const __DEV__ = process.env.NODE_ENV !== 'production';

let setOptionsWasCalled_ = false;

/**
 * Sets the options for the Maps JavaScript API.
 *
 * Has to be called before any library is loaded.
 *
 * See https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
 * for the full documentation of available options.
 *
 * @param options The options to set.
 */
export function setOptions(options: APIOptions) {
  if (setOptionsWasCalled_) {
    logDevWarning(MSG_REPEATED_SET_OPTIONS(options));

    return;
  }

  installImportLibrary_(options);
  setOptionsWasCalled_ = true;
}

/**
 * Imports the specified library from the Maps JavaScript API.
 *
 * The first call to this function will start actually loading the Maps
 * JavaScript API.
 *
 * @param libraryName The name of the library to load.
 * @returns A promise that resolves with the loaded library. In case of an
 *   error (due to poor network conditions, browser extensions, etc.), the
 *   returned promise is rejected with an error.
 */
export async function importLibrary<TLibraryName extends APILibraryName>(
  libraryName: TLibraryName
): Promise<APILibraryMap[TLibraryName]>;

export async function importLibrary(
  ...parameters: Parameters<typeof google.maps.importLibrary>
): ReturnType<typeof google.maps.importLibrary>;

export async function importLibrary(libraryName: string): Promise<unknown> {
  if (!setOptionsWasCalled_) {
    logDevWarning(MSG_SET_OPTIONS_NOT_CALLED);
  }

  if (!window?.google?.maps?.importLibrary) {
    throw new Error("google.maps.importLibrary is not installed.");
  }

  return (await google.maps.importLibrary(
    libraryName
  )) as APILibraryMap[keyof APILibraryMap];
}

/**
 * The installImportLibrary_ function makes sure that a usable version of the
 * `google.maps.importLibrary` function exists.
 */
function installImportLibrary_(options: APIOptions) {
  const importLibraryExists = Boolean(window.google?.maps?.importLibrary);
  if (importLibraryExists) {
    logDevNotice(MSG_IMPORT_LIBRARY_EXISTS(options));
  } else if (__DEV__) {
    const scriptEl = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (scriptEl) {
      logDevWarning(MSG_SCRIPT_ELEMENT_EXISTS);
    }
  }

  // If the google.maps.importLibrary function already exists, bootstrap()
  // won't do anything, so we won't call it
  if (!importLibraryExists) {
    bootstrap(options);
  }
}

// export the deprecated (and non-functional) Loader class to trigger a strong
// error-message for users migrating to the new version
export * from "./deprecated.js";
