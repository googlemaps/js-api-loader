/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ERR_DEPRECATED_LOADER } from "./messages.js";

export class Loader {
  constructor() {
    throw new Error(`[@googlemaps/js-api-loader] ${ERR_DEPRECATED_LOADER}`);
  }
}
