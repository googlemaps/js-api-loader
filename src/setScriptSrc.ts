/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { logDevNotice, MSG_TRUSTED_TYPES_POLICY_FAILED } from "./messages.js";

// Try to create a TrustedTypes policy if supported and allowed by CSP.
// Falls back to a simple passthrough if:
// - Trusted Types is not supported
// - CSP doesn't allow this policy name
// - Policy with this name already exists

let policy: {
  createScriptURL: (url: string) => string | TrustedScriptURL;
};

try {
  policy = window.trustedTypes.createPolicy("@googlemaps/js-api-loader", {
    createScriptURL: (url: string) => url,
  });
} catch (e) {
  logDevNotice(MSG_TRUSTED_TYPES_POLICY_FAILED(e));
  policy = { createScriptURL: (url: string) => url };
}

export function setScriptSrc(script: HTMLScriptElement, src: string): void {
  script.src = policy.createScriptURL(src) as string;
}
