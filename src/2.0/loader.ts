/*
 * NOTE: this is functionally equivalent to (and originally copied from) the
 * official dynamic library import script:
 *   https://developers.google.com/maps/documentation/javascript/load-maps-js-api
 *
 * Formatting etc:
 *  - removed IIFE parameters
 *  - formatted code, inlined/renamed variables and functions
 *  - fixed typescript compatibility
 *  - slightly restructured
 * Functional Changes:
 *  - added support for TrustedTypes
 *  - add APILoadingError
 */

export type APIOptions = {
  key?: string;
  v?: string;
  libraries?: string | string[];
  language?: string;
  region?: string;
  authReferrerPolicy?: string;
  mapIds?: string | string[];
  channel?: string;
  solutionChannel?: string;
};

export class APILoadingError extends Error {}

/**
 * Creates the bootstrap function for the API loader. The bootstrap function is
 * an initial version of `google.maps.importLibrary` that loads the actual JS
 * which will then replace the bootstrap-function with the actual implementation.
 */
export function bootstrapLoader(options: APIOptions) {
  if (google.maps.importLibrary)
    throw new Error("bootstrapLoader can only be called once");

  let apiLoadedPromise: Promise<void>;

  // @ts-ignore
  if (!window.google) window.google = {};
  // @ts-ignore
  if (!window.google.maps) window.google.maps = {};

  const libraries = new Set();
  const urlParameters = new URLSearchParams();

  const startLoading = () => {
    if (apiLoadedPromise) {
      return apiLoadedPromise;
    }

    apiLoadedPromise = new Promise((resolve, reject) => {
      urlParameters.set("libraries", [...libraries] + "");
      for (const [name, value] of Object.entries(options)) {
        urlParameters.set(
          name.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
          value as string
        );
      }
      urlParameters.set("callback", `google.maps.__ib__`);

      const scriptEl = document.createElement("script");
      scriptEl.src = `https://maps.googleapis.com/maps/api/js?${urlParameters.toString()}`;

      scriptEl.onerror = () => {
        reject(new APILoadingError());
      };

      const nonceScript =
        document.querySelector<HTMLScriptElement>("script[nonce]");
      scriptEl.nonce = nonceScript?.nonce || "";

      // @ts-ignore
      google.maps["__ib__"] = resolve;

      document.head.append(scriptEl);
    });

    return apiLoadedPromise;
  };

  // create the intermediate importLibrary function that loads the API and calls
  // the real importLibrary function.
  google.maps.importLibrary = async (library: string) => {
    libraries.add(library);

    await startLoading();

    return google.maps.importLibrary(library);
  };
}
