/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// @jest-environment node
describe("setScriptSrc(): SSR safety", () => {
  it("should be importable when window is not available", async () => {
    await expect(import("./setScriptSrc.js")).resolves.toBeDefined();
  });
});
