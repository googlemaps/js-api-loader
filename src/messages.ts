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
/* eslint-disable @typescript-eslint/no-empty-function */
export const MSG_DEPRECATED_LOADER =
  "The Loader class is no longer available in this version." +
  "\nPlease use the new functional API: setOptions() and importLibrary()." +
  "\nFor more information, see the updated documentation at: " +
  "https://github.com/googlemaps/js-api-loader/blob/main/README.md";

export const MSG_SET_OPTIONS_AFTER_BOOTSTRAP =
  "The setOptions() function was called after the Google Maps JavaScript API has already been bootstrapped. " +
  "The options passed to setOptions() will be ignored.";

export const MSG_IMPORT_LIBRARY_EXISTS =
  "The google.maps.importLibrary function is already defined, and " +
  "@googlemaps/js-api-loader will use the existing function instead of " +
  "overwriting it. The options passed to setOptions() will be ignored.";

export const MSG_SCRIPT_ELEMENT_EXISTS =
  "There already is a script loading the Google Maps JavaScript " +
  "API, and no google.maps.importLibrary function is defined. " +
  "@googlemaps/js-api-loader will proceed to bootstrap the API " +
  "with the specified options, but the existing script might cause " +
  "problems using the API. Make sure to remove the script " +
  "loading the API.";

// The __DEV__ global variable is set by rollup during the build process.
declare const __DEV__: boolean;

export const logError = (message: string) => {
  console.error(`[@googlemaps/js-api-loader] ${message}`);
};

export const logDevWarning = __DEV__
  ? (message: string) => {
      console.warn(`[@googlemaps/js-api-loader] ${message}`);
    }
  : () => {};

export const logDevNotice = __DEV__
  ? (message: string) => {
      console.info(`[@googlemaps/js-api-loader] ${message}`);
    }
  : () => {};
