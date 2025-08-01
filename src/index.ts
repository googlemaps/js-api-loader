/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 *      Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import isEqual from "fast-deep-equal";

export const DEFAULT_ID = "__googleMapsScriptId";

// https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import
export type Library =
  | "core"
  | "maps"
  | "maps3d"
  | "places"
  | "geocoding"
  | "routes"
  | "marker"
  | "geometry"
  | "elevation"
  | "streetView"
  | "journeySharing"
  | "drawing"
  | "visualization";

export type Libraries = Library[];

/**
 * The Google Maps JavaScript API
 * [documentation](https://developers.google.com/maps/documentation/javascript/tutorial)
 * is the authoritative source for [[LoaderOptions]].
/**
 * Loader options
 */
export interface LoaderOptions {
  /**
   * See https://developers.google.com/maps/documentation/javascript/get-api-key.
   */
  apiKey: string;
  /**
   * @deprecated See https://developers.google.com/maps/premium/overview.
   */
  channel?: string;
  /**
   * @deprecated See https://developers.google.com/maps/premium/overview, use `apiKey` instead.
   */
  client?: string;
  /**
   * In your application you can specify release channels or version numbers:
   *
   * The weekly version is specified with `version=weekly`. This version is
   * updated once per week, and is the most current.
   *
   * ```
   * const loader = Loader({apiKey, version: 'weekly'});
   * ```
   *
   * The quarterly version is specified with `version=quarterly`. This version
   * is updated once per quarter, and is the most predictable.
   *
   * ```
   * const loader = Loader({apiKey, version: 'quarterly'});
   * ```
   *
   * The version number is specified with `version=n.nn`. You can choose
   * `version=3.40`, `version=3.39`, or `version=3.38`. Version numbers are
   * updated once per quarter.
   *
   * ```
   * const loader = Loader({apiKey, version: '3.40'});
   * ```
   *
   * If you do not explicitly specify a version, you will receive the
   * weekly version by default.
   */
  version?: string;
  /**
   * The id of the script tag. Before adding a new script, the Loader will check for an existing one.
   */
  id?: string;
  /**
   * When loading the Maps JavaScript API via the URL you may optionally load
   * additional libraries through use of the libraries URL parameter. Libraries
   * are modules of code that provide additional functionality to the main Maps
   * JavaScript API but are not loaded unless you specifically request them.
   *
   * ```
   * const loader = Loader({
   *  apiKey,
   *  libraries: ['drawing', 'geometry', 'places', 'visualization'],
   * });
   * ```
   *
   * Set the [list of libraries](https://developers.google.com/maps/documentation/javascript/libraries) for more options.
   */
  libraries?: Libraries;
  /**
   * By default, the Maps JavaScript API uses the user's preferred language
   * setting as specified in the browser, when displaying textual information
   * such as the names for controls, copyright notices, driving directions and
   * labels on maps. In most cases, it's preferable to respect the browser
   * setting. However, if you want the Maps JavaScript API to ignore the
   * browser's language setting, you can force it to display information in a
   * particular language when loading the Maps JavaScript API code.
   *
   * For example, the following example localizes the language to Japan:
   *
   * ```
   * const loader = Loader({apiKey, language: 'ja', region: 'JP'});
   * ```
   *
   * See the [list of supported
   * languages](https://developers.google.com/maps/faq#languagesupport). Note
   * that new languages are added often, so this list may not be exhaustive.
   *
   */
  language?: string;
  /**
   * When you load the Maps JavaScript API from maps.googleapis.com it applies a
   * default bias for application behavior towards the United States. If you
   * want to alter your application to serve different map tiles or bias the
   * application (such as biasing geocoding results towards the region), you can
   * override this default behavior by adding a region parameter when loading
   * the Maps JavaScript API code.
   *
   * The region parameter accepts Unicode region subtag identifiers which
   * (generally) have a one-to-one mapping to country code Top-Level Domains
   * (ccTLDs). Most Unicode region identifiers are identical to ISO 3166-1
   * codes, with some notable exceptions. For example, Great Britain's ccTLD is
   * "uk" (corresponding to the domain .co.uk) while its region identifier is
   * "GB."
   *
   * For example, the following example localizes the map to the United Kingdom:
   *
   * ```
   * const loader = Loader({apiKey, region: 'GB'});
   * ```
   */
  region?: string;
  /**
   * @deprecated Passing `mapIds` is no longer required in the script tag.
   */
  mapIds?: string[];
  /**
   * Use a custom url and path to load the Google Maps API script.
   */
  url?: string;
  /**
   * Use a cryptographic nonce attribute.
   */
  nonce?: string;
  /**
   * The number of script load retries.
   */
  retries?: number;
  /**
   * Maps JS customers can configure HTTP Referrer Restrictions in the Cloud
   * Console to limit which URLs are allowed to use a particular API Key. By
   * default, these restrictions can be configured to allow only certain paths
   * to use an API Key. If any URL on the same domain or origin may use the API
   * Key, you can set `auth_referrer_policy=origin` to limit the amount of data
   * sent when authorizing requests from the Maps JavaScript API. This is
   * available starting in version 3.46. When this parameter is specified and
   * HTTP Referrer Restrictions are enabled on Cloud Console, Maps JavaScript
   * API will only be able to load if there is an HTTP Referrer Restriction that
   * matches the current website's domain without a path specified.
   */
  authReferrerPolicy?: "origin";
}

/**
 * The status of the [[Loader]].
 */
export enum LoaderStatus {
  INITIALIZED,
  LOADING,
  SUCCESS,
  FAILURE,
}

/**
 * [[Loader]] makes it easier to add Google Maps JavaScript API to your application
 * dynamically using
 * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * It works by dynamically creating and appending a script node to the the
 * document head and wrapping the callback function so as to return a promise.
 *
 * ```
 * const loader = new Loader({
 *   apiKey: "",
 *   version: "weekly",
 *   libraries: ["places"]
 * });
 *
 * loader.load().then((google) => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */
export class Loader {
  private static instance: Loader;
  /**
   * See [[LoaderOptions.version]]
   */
  public readonly version: string;
  /**
   * See [[LoaderOptions.apiKey]]
   */
  public readonly apiKey: string;
  /**
   * See [[LoaderOptions.channel]]
   */
  public readonly channel: string;
  /**
   * See [[LoaderOptions.client]]
   */
  public readonly client: string;
  /**
   * See [[LoaderOptions.id]]
   */
  public readonly id: string;
  /**
   * See [[LoaderOptions.libraries]]
   */
  public readonly libraries: Libraries;
  /**
   * See [[LoaderOptions.language]]
   */
  public readonly language: string;

  /**
   * See [[LoaderOptions.region]]
   */
  public readonly region: string;

  /**
   * See [[LoaderOptions.mapIds]]
   */
  public readonly mapIds: string[];

  /**
   * See [[LoaderOptions.nonce]]
   */
  public readonly nonce: string | null;

  /**
   * See [[LoaderOptions.retries]]
   */
  public readonly retries: number;

  /**
   * See [[LoaderOptions.url]]
   */
  public readonly url: string;
  /**
   * See [[LoaderOptions.authReferrerPolicy]]
   */
  public readonly authReferrerPolicy: "origin";

  private callbacks: ((e: ErrorEvent) => void)[] = [];
  private done = false;
  private loading = false;
  private onerrorEvent: ErrorEvent;
  private errors: ErrorEvent[] = [];

  /**
   * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
   * using this library, instead the defaults are set by the Google Maps
   * JavaScript API server.
   *
   * ```
   * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
   * ```
   */
  constructor({
    apiKey,
    authReferrerPolicy,
    channel,
    client,
    id = DEFAULT_ID,
    language,
    libraries = [],
    mapIds,
    nonce,
    region,
    retries = 3,
    url = "https://maps.googleapis.com/maps/api/js",
    version,
  }: LoaderOptions) {
    this.apiKey = apiKey;
    this.authReferrerPolicy = authReferrerPolicy;
    this.channel = channel;
    this.client = client;
    this.id = id || DEFAULT_ID; // Do not allow empty string
    this.language = language;
    this.libraries = libraries;
    this.mapIds = mapIds;
    this.nonce = nonce;
    this.region = region;
    this.retries = retries;
    this.url = url;
    this.version = version;

    if (Loader.instance) {
      if (!isEqual(this.options, Loader.instance.options)) {
        throw new Error(
          `Loader must not be called again with different options. ${JSON.stringify(
            this.options
          )} !== ${JSON.stringify(Loader.instance.options)}`
        );
      }

      return Loader.instance;
    }

    Loader.instance = this;
  }

  public get options(): LoaderOptions {
    return {
      version: this.version,
      apiKey: this.apiKey,
      channel: this.channel,
      client: this.client,
      id: this.id,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      mapIds: this.mapIds,
      nonce: this.nonce,
      url: this.url,
      authReferrerPolicy: this.authReferrerPolicy,
    };
  }

  public get status(): LoaderStatus {
    if (this.errors.length) {
      return LoaderStatus.FAILURE;
    }
    if (this.done) {
      return LoaderStatus.SUCCESS;
    }
    if (this.loading) {
      return LoaderStatus.LOADING;
    }
    return LoaderStatus.INITIALIZED;
  }

  private get failed(): boolean {
    return this.done && !this.loading && this.errors.length >= this.retries + 1;
  }

  /**
   * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
   *
   * @ignore
   * @deprecated
   */
  public createUrl(): string {
    let url = this.url;

    url += `?callback=__googleMapsCallback&loading=async`;

    if (this.apiKey) {
      url += `&key=${this.apiKey}`;
    }

    if (this.channel) {
      url += `&channel=${this.channel}`;
    }

    if (this.client) {
      url += `&client=${this.client}`;
    }

    if (this.libraries.length > 0) {
      url += `&libraries=${this.libraries.join(",")}`;
    }

    if (this.language) {
      url += `&language=${this.language}`;
    }

    if (this.region) {
      url += `&region=${this.region}`;
    }

    if (this.version) {
      url += `&v=${this.version}`;
    }

    if (this.mapIds) {
      url += `&map_ids=${this.mapIds.join(",")}`;
    }

    if (this.authReferrerPolicy) {
      url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
    }

    return url;
  }

  public deleteScript(): void {
    const script = document.getElementById(this.id);
    if (script) {
      script.remove();
    }
  }

  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   * @deprecated, use importLibrary() instead.
   */
  public load(): Promise<typeof google> {
    return this.loadPromise();
  }

  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   *
   * @ignore
   * @deprecated, use importLibrary() instead.
   */
  public loadPromise(): Promise<typeof google> {
    return new Promise((resolve, reject) => {
      this.loadCallback((err: ErrorEvent) => {
        if (!err) {
          resolve(window.google);
        } else {
          reject(err.error);
        }
      });
    });
  }

  /**
   * See https://developers.google.com/maps/documentation/javascript/reference/top-level#google.maps.importLibrary
   */
  public importLibrary(name: "core"): Promise<google.maps.CoreLibrary>;
  public importLibrary(name: "maps"): Promise<google.maps.MapsLibrary>;
  public importLibrary(name: "maps3d"): Promise<google.maps.Maps3DLibrary>;
  public importLibrary(name: "places"): Promise<google.maps.PlacesLibrary>;
  public importLibrary(
    name: "geocoding"
  ): Promise<google.maps.GeocodingLibrary>;
  public importLibrary(name: "routes"): Promise<google.maps.RoutesLibrary>;
  public importLibrary(name: "marker"): Promise<google.maps.MarkerLibrary>;
  public importLibrary(name: "geometry"): Promise<google.maps.GeometryLibrary>;
  public importLibrary(
    name: "elevation"
  ): Promise<google.maps.ElevationLibrary>;
  public importLibrary(
    name: "streetView"
  ): Promise<google.maps.StreetViewLibrary>;
  public importLibrary(
    name: "journeySharing"
  ): Promise<google.maps.JourneySharingLibrary>;
  public importLibrary(name: "drawing"): Promise<google.maps.DrawingLibrary>;
  public importLibrary(
    name: "visualization"
  ): Promise<google.maps.VisualizationLibrary>;
  public importLibrary(name: Library): Promise<unknown>;
  public importLibrary(name: Library): Promise<unknown> {
    this.execute();
    return google.maps.importLibrary(name);
  }

  /**
   * Load the Google Maps JavaScript API script with a callback.
   * @deprecated, use importLibrary() instead.
   */
  public loadCallback(fn: (e: ErrorEvent) => void): void {
    this.callbacks.push(fn);
    this.execute();
  }

  /**
   * Set the script on document.
   */
  private setScript(): void {
    if (document.getElementById(this.id)) {
      // TODO wrap onerror callback for cases where the script was loaded elsewhere
      this.callback();
      return;
    }

    const params = {
      key: this.apiKey,
      channel: this.channel,
      client: this.client,
      libraries: this.libraries.length && this.libraries,
      v: this.version,
      mapIds: this.mapIds,
      language: this.language,
      region: this.region,
      authReferrerPolicy: this.authReferrerPolicy,
    };
    // keep the URL minimal:
    Object.keys(params).forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (key) => !(params as any)[key] && delete (params as any)[key]
    );

    if (!window?.google?.maps?.importLibrary) {
      // tweaked copy of https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import
      // which also sets the base url, the id, and the nonce
      /* eslint-disable */
      ((g) => {
        // @ts-ignore
        let h,
          a,
          k,
          p = "The Google Maps JavaScript API",
          c = "google",
          l = "importLibrary",
          q = "__ib__",
          m = document,
          b = window;
        // @ts-ignore
        b = b[c] || (b[c] = {});
        // @ts-ignore
        const d = b.maps || (b.maps = {}),
          r = new Set(),
          e = new URLSearchParams(),
          u = () =>
            // @ts-ignore
            h || (h = new Promise(async (f, n) => {
              await (a = m.createElement("script"));
              a.id = this.id;
              e.set("libraries", [...r] + "");
              // @ts-ignore
              for (k in g) e.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
              e.set("callback", c + ".maps." + q);
              a.src = this.url + `?` + e;
              d[q] = f;
              a.onerror = () => (h = n(Error(p + " could not load.")));
              // @ts-ignore
              a.nonce = this.nonce || m.querySelector("script[nonce]")?.nonce || "";
              m.head.append(a);
            }));
        // @ts-ignore
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
      })(params);
      /* eslint-enable */
    }

    // While most libraries populate the global namespace when loaded via bootstrap params,
    // this is not the case for "marker" when used with the inline bootstrap loader
    // (and maybe others in the future). So ensure there is an importLibrary for each:
    const libraryPromises = this.libraries.map((library) =>
      this.importLibrary(library)
    );
    // ensure at least one library, to kick off loading...
    if (!libraryPromises.length) {
      libraryPromises.push(this.importLibrary("core"));
    }
    Promise.all(libraryPromises).then(
      () => this.callback(),
      (error) => {
        const event = new ErrorEvent("error", { error }); // for backwards compat
        this.loadErrorCallback(event);
      }
    );
  }

  /**
   * Reset the loader state.
   */
  private reset(): void {
    this.deleteScript();
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.onerrorEvent = null;
  }

  private resetIfRetryingFailed(): void {
    if (this.failed) {
      this.reset();
    }
  }

  private loadErrorCallback(e: ErrorEvent): void {
    this.errors.push(e);

    if (this.errors.length <= this.retries) {
      const delay = this.errors.length * 2 ** this.errors.length;

      console.error(
        `Failed to load Google Maps script, retrying in ${delay} ms.`
      );

      setTimeout(() => {
        this.deleteScript();
        this.setScript();
      }, delay);
    } else {
      this.onerrorEvent = e;
      this.callback();
    }
  }

  private callback(): void {
    this.done = true;
    this.loading = false;

    this.callbacks.forEach((cb) => {
      cb(this.onerrorEvent);
    });

    this.callbacks = [];
  }

  private execute(): void {
    this.resetIfRetryingFailed();

    if (this.loading) {
      // do nothing but wait
      return;
    }

    if (this.done) {
      this.callback();
    } else {
      // short circuit and warn if google.maps is already loaded
      if (window.google && window.google.maps && window.google.maps.version) {
        console.warn(
          "Google Maps already loaded outside @googlemaps/js-api-loader. " +
            "This may result in undesirable behavior as options and script parameters may not match."
        );
        this.callback();
        return;
      }

      this.loading = true;
      this.setScript();
    }
  }
}
