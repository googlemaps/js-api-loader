/**
 * Copyright 2021 Google LLC
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

    const result = await importLibrary("maps");
    expect(result).toBe(lib);
  });

  it("should pass the library name to the google.maps.importLibrary function", async () => {
    const { importLibrary } = await import("./index.js");

    await importLibrary("maps");

    expect(mockImportLibrary).toHaveBeenCalledWith("maps");
  });

  it("should log a warning if setOptions is called after bootstrap", async () => {
    const { setOptions, importLibrary } = await import("./index.js");
    const { logDevWarning } = await import("./messages.js");

    await importLibrary("maps");
    setOptions({ key: "foo", v: "bar" });

    expect(logDevWarning).toHaveBeenCalledWith(
      messages.WARN_SET_OPTIONS_AFTER_BOOTSTRAP
    );
  });
});

describe("importLibrary(): caching of loaded libraries", () => {
  it("should only call importLibrary once for the same library", async () => {
    const { importLibrary } = await import("./index.js");
    const lib = {} as google.maps.MapsLibrary;
    mockImportLibrary.mockResolvedValue(lib);

    await importLibrary("maps");
    await importLibrary("maps");

    expect(mockImportLibrary).toHaveBeenCalledTimes(1);
  });

  it("should call importLibrary for each library", async () => {
    const { importLibrary } = await import("./index.js");
    const lib = {} as google.maps.MapsLibrary;
    mockImportLibrary.mockResolvedValue(lib);

    await importLibrary("maps");
    await importLibrary("places");

    expect(mockImportLibrary).toHaveBeenCalledTimes(2);
  });
});

describe("importLibrary(): cooperative loading with existing script tag", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  it("should use existing google.maps.importLibrary if available", async () => {
    const { importLibrary } = await import("./index.js");
    const existingMockImportLibrary: ImportLibraryMock = jest.fn();
    globalThis.google = {
      maps: { importLibrary: existingMockImportLibrary },
    } as unknown as typeof globalThis.google;

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js";
    document.head.appendChild(script);

    await importLibrary("maps");

    expect(mockBootstrap).not.toHaveBeenCalled();
    expect(existingMockImportLibrary).toHaveBeenCalledWith("maps");
  });

  it("should wait for script to load if importLibrary is not available", async () => {
    const { importLibrary } = await import("./index.js");

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=foo&v=bar";
    document.head.appendChild(script);

    // this will create a stub for google.maps.importLibrary that waits for the
    // existing script to load and define
    const importLibraryPromise = importLibrary("maps");

    // At this point, the stub exists, but the real function doesn't.
    // Let's simulate the script finishing its load.
    const newMockImportLibrary: ImportLibraryMock = jest.fn();
    globalThis.google.maps.importLibrary = newMockImportLibrary;

    // Now, trigger the 'load' event. The stub's promise should resolve,
    // and it should call the function that now exists.
    script.dispatchEvent(new Event("load", { bubbles: true }));

    // Wait for the promise returned by our loader to resolve.
    await importLibraryPromise;

    // Check that the function that became available *after* the script loaded was called.
    expect(newMockImportLibrary).toHaveBeenCalledWith("maps");
  });

  it("should log an error if key or version are different", async () => {
    const { setOptions, importLibrary } = await import("./index.js");
    const { logError } = await import("./messages.js");

    const existingMockImportLibrary: ImportLibraryMock = jest.fn();
    globalThis.google = {
      maps: { importLibrary: existingMockImportLibrary },
    } as unknown as typeof globalThis.google;

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=foo&v=bar";
    document.head.appendChild(script);

    const setOptionsParams = { key: "different", v: "different" };
    setOptions(setOptionsParams);
    await importLibrary("maps");

    expect(logError).toHaveBeenCalledWith(
      messages.ERR_KEY_VERSION_MISMATCH(setOptionsParams, {
        key: "foo",
        v: "bar",
      })
    );
  });

  it("should log a warning if language or region are different", async () => {
    const { setOptions, importLibrary } = await import("./index.js");
    const { logDevWarning } = await import("./messages.js");

    const existingMockImportLibrary: ImportLibraryMock = jest.fn();
    globalThis.google = {
      maps: { importLibrary: existingMockImportLibrary },
    } as unknown as typeof globalThis.google;

    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?language=en&region=US";
    document.head.appendChild(script);

    const setOptionsParams = { language: "de", region: "DE" };
    setOptions(setOptionsParams);
    await importLibrary("maps");

    expect(logDevWarning).toHaveBeenCalledWith(
      messages.WARN_LANGUAGE_REGION_NOT_COMPATIBLE(setOptionsParams, {
        language: "en",
        region: "US",
      })
    );
  });

  it("should log a notice if options are compatible", async () => {
    const { setOptions, importLibrary } = await import("./index.js");
    const { logDevNotice } = await import("./messages.js");

    const existingMockImportLibrary: ImportLibraryMock = jest.fn();
    globalThis.google = {
      maps: { importLibrary: existingMockImportLibrary },
    } as unknown as typeof globalThis.google;

    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=foo&v=bar&language=en&region=US";
    document.head.appendChild(script);

    setOptions({ key: "foo", v: "bar", language: "en", region: "US" });
    await importLibrary("maps");

    expect(logDevNotice).toHaveBeenCalledWith(
      messages.INFO_LOADED_WITHOUT_OPTIONS
    );
  });
});
