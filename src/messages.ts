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
import { APIOptions } from "./index.js";

export const MSG_DEPRECATED_LOADER =
  "The Loader class is no longer available in this version." +
  "\nPlease use the new functional API: setOptions() and importLibrary()." +
  "\nFor more information, see the updated documentation at: " +
  "https://github.com/googlemaps/js-api-loader/blob/main/README.md";

export const MSG_REPEATED_SET_OPTIONS = (options: APIOptions) =>
  `The setOptions() function should only be called once. The options passed ` +
  `to the additional call (${JSON.stringify(options)}) will be ignored.`;

export const MSG_IMPORT_LIBRARY_EXISTS = (options: APIOptions) =>
  `The google.maps.importLibrary() function is already defined, and ` +
  `@googlemaps/js-api-loader will use the existing function instead of ` +
  `overwriting it. The options passed to setOptions ` +
  `(${JSON.stringify(options)}) will be ignored.`;

export const MSG_SET_OPTIONS_NOT_CALLED =
  "No options were set before calling importLibrary. Make sure to configure " +
  "the loader using setOptions().";

export const MSG_SCRIPT_ELEMENT_EXISTS =
  "There already is a script loading the Google Maps JavaScript " +
  "API, and no google.maps.importLibrary function is defined. " +
  "@googlemaps/js-api-loader will proceed to bootstrap the API " +
  "with the specified options, but the existing script might cause " +
  "problems using the API. Make sure to remove the script " +
  "loading the API.";

// Development mode check - bundlers will replace process.env.NODE_ENV at build time
declare const process: { env: { NODE_ENV?: string } };
const __DEV__ = process.env.NODE_ENV !== 'production';

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
