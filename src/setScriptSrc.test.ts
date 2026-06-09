/**
 * @jest-environment node
 *
 * Copyright 2026 Google LLC
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

type TrustedTypesStub = {
  createPolicy: jest.Mock;
};

declare global {
  // Node does not provide this, but tests attach a stub.
  var trustedTypes: TrustedTypesStub | undefined;
}

describe("setScriptSrc()", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // make sure these tests are running without a window-instance
    if (typeof window !== "undefined") {
      throw new Error("Expected Node test environment without window.");
    }
  });

  afterEach(() => {
    globalThis.trustedTypes = undefined;
  });

  it("falls back to a plain string when Trusted Types are not available", async () => {
    globalThis.trustedTypes = undefined;

    const { setScriptSrc } = await import("./setScriptSrc.js");
    const script = { src: "" } as HTMLScriptElement;

    setScriptSrc(script, "https://maps.googleapis.com/maps/api/js");

    expect(script.src).toBe("https://maps.googleapis.com/maps/api/js");
  });

  it("creates and uses a Trusted Types policy when available", async () => {
    const createScriptURL = jest.fn((url: string) => `tt:${url}`);
    const createPolicy = jest.fn(() => ({ createScriptURL }));

    globalThis.trustedTypes = {
      createPolicy,
    };

    const { setScriptSrc } = await import("./setScriptSrc.js");
    const script = { src: "" } as HTMLScriptElement;

    setScriptSrc(script, "https://maps.googleapis.com/maps/api/js");

    expect(createPolicy).toHaveBeenCalledTimes(1);
    expect(createPolicy).toHaveBeenCalledWith(
      "@googlemaps/js-api-loader",
      expect.objectContaining({
        createScriptURL: expect.any(Function),
      })
    );
    expect(createScriptURL).toHaveBeenCalledWith(
      "https://maps.googleapis.com/maps/api/js"
    );
    expect(script.src).toBe("tt:https://maps.googleapis.com/maps/api/js");
  });

  it("falls back when policy creation fails", async () => {
    const createPolicy = jest.fn(() => {
      throw new Error("policy denied");
    });

    globalThis.trustedTypes = {
      createPolicy,
    };

    const { setScriptSrc } = await import("./setScriptSrc.js");
    const script = { src: "" } as HTMLScriptElement;

    setScriptSrc(script, "https://maps.googleapis.com/maps/api/js");

    expect(createPolicy).toHaveBeenCalledTimes(1);
    expect(script.src).toBe("https://maps.googleapis.com/maps/api/js");
  });
});
