/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
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
  __DEV__
    ? "The Google Maps JavaScript API is already being loaded using a different key or version. " +
      `The key "${script.key ?? ""}" and version "${script.v ?? ""}" are already in use, ` +
      `while "${setOptions.key ?? ""}" and "${setOptions.v ?? ""}" were specified.`
    : "Key or version mismatch.";

export const WARN_LANGUAGE_REGION_NOT_COMPATIBLE = (
  setOptions: Partial<APIOptions>,
  script: Partial<APIOptions>
): string =>
  __DEV__
    ? "The Google Maps JavaScript API is already being loaded with a different language or region. " +
      `The language "${script.language ?? ""}" and region "${
        script.region ?? ""
      }" are already in use, ` +
      `while "${setOptions.language ?? ""}" and "${
        setOptions.region ?? ""
      }" were specified.`
    : "Language or region mismatch.";

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
