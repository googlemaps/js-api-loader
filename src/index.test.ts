/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { jest } from "@jest/globals";
import type { bootstrap } from "./bootstrap.js";
import { logDevWarning } from "./messages.js";

type ImportLibraryMock = jest.Mock<typeof google.maps.importLibrary>;

const messages = await import("./messages.js");

const mockImportLibrary: ImportLibraryMock = jest.fn();

const mockBootstrap: jest.Mock<typeof bootstrap> = jest.fn(() => {
  // The bootstrap mock needs to provide `google.maps.importLibrary` for the
  // tests.
  globalThis.google = {
    maps: {
      importLibrary: mockImportLibrary,
    },
  } as unknown as typeof globalThis.google;
});

jest.unstable_mockModule("./bootstrap.js", () => ({
  bootstrap: mockBootstrap,
}));

jest.unstable_mockModule("./messages.js", () => ({
  ...messages,
  logError: jest.fn(),
  logDevWarning: jest.fn(),
  logDevNotice: jest.fn(),
}));

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  delete globalThis.google;
});

describe("importLibrary(): basic operation", () => {
  it("should bootstrap and call importLibrary when a library is imported", async () => {
    const { importLibrary } = await import("./index.js");

    await importLibrary("maps");

    expect(mockBootstrap).toHaveBeenCalledTimes(1);
    expect(mockImportLibrary).toHaveBeenCalledTimes(1);
    expect(mockImportLibrary).toHaveBeenCalledWith("maps");
  });

  it("should pass options to the bootstrap function", async () => {
    const { setOptions, importLibrary } = await import("./index.js");

    const options = { key: "foo", v: "bar" };

    setOptions(options);
    await importLibrary("maps");

    expect(mockBootstrap).toHaveBeenCalledWith(options);
  });

  it("should return the value from importLibrary", async () => {
    const { importLibrary } = await import("./index.js");

    // The mocked library object is a placeholder to verify that `importLibrary`
    // returns the correct value.
    const lib = {} as never as google.maps.MapsLibrary;
    mockImportLibrary.mockResolvedValue(lib);

    const result = await importLibrary("core");
    expect(result).toBe(lib);
  });

  it("should pass the library name to the google.maps.importLibrary function", async () => {
    const { importLibrary } = await import("./index.js");

    await importLibrary("core");

    expect(mockImportLibrary).toHaveBeenCalledWith("core");
  });

  it("should log a warning if setOptions is called after bootstrap", async () => {
    const { setOptions, importLibrary } = await import("./index.js");
    const { logDevWarning } = await import("./messages.js");

    await importLibrary("core");
    setOptions({ key: "foo", v: "bar" });

    expect(logDevWarning).toHaveBeenCalledWith(
      messages.MSG_SET_OPTIONS_AFTER_BOOTSTRAP
    );
  });
});

describe("importLibrary(): existing loaders and/or script tags", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("shouldn't bootstrap if google.maps.importLibrary is available", async () => {
    const { importLibrary } = await import("./index.js");
    const existingMockImportLibrary: ImportLibraryMock = jest.fn();
    globalThis.google = {
      maps: { importLibrary: existingMockImportLibrary },
    } as unknown as typeof globalThis.google;

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js";
    document.head.appendChild(script);

    await importLibrary("core");

    expect(mockBootstrap).not.toHaveBeenCalled();
    expect(existingMockImportLibrary).toHaveBeenCalledWith("core");
  });

  it("should bootstrap if google.maps.importLibrary isn't available", async () => {
    const { importLibrary } = await import("./index.js");

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js";
    document.head.appendChild(script);

    await importLibrary("core");

    expect(mockBootstrap).toHaveBeenCalled();
  });

  it("should log a message if google.maps.importLibrary is already defined", async () => {
    const { importLibrary } = await import("./index.js");
    const { logDevNotice } = await import("./messages.js");

    globalThis.google = {
      maps: { importLibrary: jest.fn() },
    } as unknown as typeof globalThis.google;

    await importLibrary("core");

    expect(logDevNotice).toHaveBeenCalled();
  });

  it("should log a message if a script tag is already defined", async () => {
    const { importLibrary } = await import("./index.js");
    const { logDevWarning } = await import("./messages.js");

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js";
    document.head.appendChild(script);

    await importLibrary("core");

    expect(logDevWarning).toHaveBeenCalled();
  });
});
