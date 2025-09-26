/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { APIOptions } from "./index.js";

/**
 * Initializes and configures the Google Maps JavaScript API.
 *
 * When called the first time, this will install a proxy for the
 * `google.maps.importLibrary` function that will load the Maps JavaScript
 * API when called for the first time. Once the API is loaded, the proxy
 * function will be replaced with the real implementation.
 *
 * Any call beyond that will just trigger a warning being logged to the console.
 *
 * @function bootstrap
 * @param options - The configuration options to initialize the application.
 * @returns {void}
 */
export const bootstrap: (options: APIOptions) => void;
