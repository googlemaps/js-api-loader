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

import type { APIOptions } from "./index.js";

export const ERR_DEPRECATED_LOADER =
  "The Loader class is no longer available in this version." +
  "\nPlease use the new functional API: setOptions() and importLibrary()." +
  "\nFor more information, see the updated documentation at: " +
  "https://github.com/googlemaps/js-api-loader/blob/main/README.md";

export const ERR_KEY_VERSION_MISMATCH = (
  setOptions: Partial<APIOptions>,
  script: Partial<APIOptions>
): string =>
  `The Google Maps JavaScript API is already being loaded using a ` +
  `different key or version. The key "${script.key ?? ""}" and version ` +
  `"${script.v ?? ""}" are already in use, while "${setOptions.key ?? ""}" ` +
  `and "${setOptions.v ?? ""}" were specified to setOptions().`;

export const WARN_LANGUAGE_REGION_NOT_COMPATIBLE = (
  setOptions: Partial<APIOptions>,
  script: Partial<APIOptions>
): string =>
  `The Google Maps JavaScript API is already being loaded with a different ` +
  `language or region. The language "${script.language ?? ""}" and region ` +
  `"${script.region ?? ""}" are already in use, while ` +
  `"${setOptions.language ?? ""}" and "${setOptions.region ?? ""}" ` +
  `were specified.`;

export const INFO_LOADED_WITHOUT_OPTIONS =
  "The Google Maps JavaScript API was loaded outside the @googlemaps/js-api-loader. " +
  "The options passed to setOptions will be ignored.";

export const WARN_SET_OPTIONS_AFTER_BOOTSTRAP =
  "The setOptions() function was called after the Google Maps JavaScript API has already been bootstrapped. " +
  "The options passed to setOptions() will be ignored.";

// The __DEV__ global variable is set by rollup during the build process.
declare const __DEV__: boolean;

export const logError = (message: string) => {
  console.error(`[@googlemaps/js-api-loader] ${message}`);
};

const loggedErrors = new Set<string>();
export const logErrorOnce = (message: string) => {
  if (loggedErrors.has(message)) return;
  loggedErrors.add(message);

  logError(message);
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
