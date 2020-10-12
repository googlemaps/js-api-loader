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

/**
 * @ignore
 */
declare global {
  interface Window {
    __googleMapsCallback: (e: Event) => void;
  }
}

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];

/**
 * The Google Maps JavaScript API
 * [documentation](https://developers.google.com/maps/documentation/javascript/tutorial)
 * is the authoritative source for [[LoaderOptions]].
 */
export interface LoaderOptions {
  /**
   * See https://developers.google.com/maps/documentation/javascript/get-api-key.
   */
  apiKey: string;
  /**
   * To track usage across different applications using the same client ID,
   * you may provide an optional channel parameter with your requests. By
   * specifying different channel values for different aspects of your
   * application, you can determine precisely how your application is used.
   *
   * For example, your externally-facing website may access the API using a
   * channel set to customer while your internal marketing department may use
   * a channel set to mkting. Your reports will break down usage by those
   * channel values.
   *
   * Channel reporting is available for applications using the Maps JavaScript
   * API, the image APIs or any of the Google Maps Platform web services.
   *
   * The channel parameter must use the following format:
   *
   * - Must be an ASCII alphanumeric string.
   * - Period (.), underscore (_) and hyphen (-) characters are allowed.
   * - The channel parameter is case-insensitive; upper-case, mixed-case, and
   *   lower-cased channel parameters will be merged into their lower-case
   *   equivalent. For example, usage on the `CUSTOMER` channel will be combined
   *   with the usage on the `customer` channel.
   * - The channel value must be a static value assigned per application
   *   instance, and must not be generated dynamically. You may not use
   *   channel values to track individual users, for example.
   */
  channel?: string;
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
   * For example, the following example localizes the language to the United
   * Kingdom:
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
   * (Beta) You can add multiple Map IDs to your map using the map_ids paramenter in
   * your bootstrap request.
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
 * loader.load().then(() => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */
export class Loader {
  /**
   * See [[LoaderOptions.version]]
   */
  version: string;
  /**
   * See [[LoaderOptions.apiKey]]
   */
  apiKey: string;
  /**
   * See [[LoaderOptions.id]]
   */
  channel: string;
  /**
   * See [[LoaderOptions.channel]]
   */
  id: string;
  /**
   * See [[LoaderOptions.libraries]]
   */
  libraries: Libraries;
  /**
   * See [[LoaderOptions.language]]
   */
  language: string;

  /**
   * See [[LoaderOptions.region]]
   */
  region: string;

  /**
   * See [[LoaderOptions.mapIds]]
   */
  mapIds: string[];

  /**
   * See [[LoaderOptions.nonce]]
   */
  nonce: string | null;

  /**
   * See [[LoaderOptions.url]]
   */
  url: string;

  private CALLBACK = "__googleMapsCallback";
  private callbacks: ((e: Event) => void)[] = [];
  private done = false;
  private loading = false;
  private onerrorEvent: Event;

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
    channel,
    id = "__googleMapsScriptId",
    libraries = [],
    language,
    region,
    version,
    mapIds,
    nonce,
    url = "https://maps.googleapis.com/maps/api/js",
  }: LoaderOptions) {
    this.version = version;
    this.apiKey = apiKey;
    this.channel = channel;
    this.id = id;
    this.libraries = libraries;
    this.language = language;
    this.region = region;
    this.mapIds = mapIds;
    this.nonce = nonce;
    this.url = url;
  }
  /**
   * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
   *
   * @ignore
   */
  createUrl(): string {
    let url = this.url;

    url += `?callback=${this.CALLBACK}`;

    if (this.apiKey) {
      url += `&key=${this.apiKey}`;
    }

    if (this.channel) {
      url += `&channel=${this.channel}`;
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

    return url;
  }

  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   */
  load(): Promise<void> {
    return this.loadPromise();
  }

  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   *
   * @ignore
   */
  loadPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadCallback((err: Event) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Load the Google Maps JavaScript API script with a callback.
   */
  loadCallback(fn: (e: Event) => void): void {
    this.callbacks.push(fn);
    this.execute();
  }

  /**
   * Set the script on document.
   */
  private setScript(): void {
    if (this.id && document.getElementById(this.id)) {
      this.callback();
      return;
    }

    const url = this.createUrl();
    const script = document.createElement("script");
    script.id = this.id;
    script.type = "text/javascript";
    script.src = url;
    script.onerror = this.loadErrorCallback.bind(this);
    script.defer = true;
    script.async = true;

    if (this.nonce) {
      script.nonce = this.nonce;
    }

    document.head.appendChild(script);
  }

  private loadErrorCallback(e: Event): void {
    this.onerrorEvent = e;
    this.callback();
  }

  private setCallback(): void {
    window.__googleMapsCallback = this.callback.bind(this);
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
    if (this.done) {
      this.callback();
    } else {
      if (this.loading) {
        // do nothing but wait
      } else {
        this.loading = true;
        this.setCallback();
        this.setScript();
      }
    }
  }
}
