/*
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TrustedTypePolicyFactory } from "trusted-types";

import { logDevWarning, MSG_TRUSTED_TYPES_POLICY_FAILED } from "./messages.js";

const TRUSTED_TYPES_POLICY_NAME = "@googlemaps/js-api-loader";
interface TrustedTypesGlobals {
  trustedTypes?: TrustedTypePolicyFactory;
}

type Policy = {
  createScriptURL: (url: string) => string | TrustedScriptURL;
};

const fallbackPolicy: Policy = { createScriptURL: (url: string) => url };

let policy: Policy | undefined;

/*
 * Tries to create a Trusted Types policy when supported. Falls back to a string passthrough
 * when Trusted Types is unsupported, blocked by CSP, or already registered.
 */
function getPolicy(): Policy {
  if (policy) {
    return policy;
  }

  const trustedTypes = (globalThis as TrustedTypesGlobals).trustedTypes;

  if (!trustedTypes) {
    policy = fallbackPolicy;
    return policy;
  }

  try {
    policy = trustedTypes.createPolicy(TRUSTED_TYPES_POLICY_NAME, {
      createScriptURL: (url: string) => url,
    });
  } catch (e) {
    logDevWarning(
      MSG_TRUSTED_TYPES_POLICY_FAILED(TRUSTED_TYPES_POLICY_NAME, e)
    );
    policy = fallbackPolicy;
  }

  return policy;
}

export function setScriptSrc(script: HTMLScriptElement, src: string): void {
  script.src = getPolicy().createScriptURL(src) as string;
}
