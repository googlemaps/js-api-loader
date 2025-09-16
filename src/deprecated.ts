/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { ERR_DEPRECATED_LOADER, logErrorOnce } from "./messages.js";

/**
 * @deprecated Use the new functional API: `setOptions()` and `importLibrary()`.
 * See the migration guide for more details: MIGRATION.md
 */
export class Loader {
  /** @deprecated */
  status = 0;

  /** @deprecated */
  options = {};

  constructor(...args: any[]) {
    logErrorOnce(ERR_DEPRECATED_LOADER);
  }

  /** @deprecated */
  public createUrl(): string {
    return "";
  }

  /** @deprecated */
  public deleteScript(): void {
    // do nothing
  }

  /** @deprecated */
  public async load(): Promise<any> {
    return new Promise(() => {});
  }

  /** @deprecated */
  public async loadPromise(): Promise<any> {
    return this.load();
  }

  /** @deprecated */
  public importLibrary(libraryName: any): Promise<any> {
    return new Promise(() => {});
  }

  /** @deprecated */
  public loadCallback(callback: any): void {
    // do nothing
  }
}
