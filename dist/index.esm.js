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
var Loader = /** @class */ (function () {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    function Loader(_a) {
        var apiKey = _a.apiKey, channel = _a.channel, client = _a.client, _b = _a.id, id = _b === void 0 ? "__googleMapsScriptId" : _b, _c = _a.libraries, libraries = _c === void 0 ? [] : _c, language = _a.language, region = _a.region, version = _a.version, mapIds = _a.mapIds, nonce = _a.nonce, _d = _a.url, url = _d === void 0 ? "https://maps.googleapis.com/maps/api/js" : _d;
        this.CALLBACK = "__googleMapsCallback";
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.version = version;
        this.apiKey = apiKey;
        this.channel = channel;
        this.client = client;
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
    Loader.prototype.createUrl = function () {
        var url = this.url;
        url += "?callback=" + this.CALLBACK;
        if (this.apiKey) {
            url += "&key=" + this.apiKey;
        }
        if (this.channel) {
            url += "&channel=" + this.channel;
        }
        if (this.client) {
            url += "&client=" + this.client;
        }
        if (this.libraries.length > 0) {
            url += "&libraries=" + this.libraries.join(",");
        }
        if (this.language) {
            url += "&language=" + this.language;
        }
        if (this.region) {
            url += "&region=" + this.region;
        }
        if (this.version) {
            url += "&v=" + this.version;
        }
        if (this.mapIds) {
            url += "&map_ids=" + this.mapIds.join(",");
        }
        return url;
    };
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     */
    Loader.prototype.load = function () {
        return this.loadPromise();
    };
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     */
    Loader.prototype.loadPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadCallback(function (err) {
                if (!err) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    };
    /**
     * Load the Google Maps JavaScript API script with a callback.
     */
    Loader.prototype.loadCallback = function (fn) {
        this.callbacks.push(fn);
        this.execute();
    };
    /**
     * Set the script on document.
     */
    Loader.prototype.setScript = function () {
        if (this.id && document.getElementById(this.id)) {
            this.callback();
            return;
        }
        var url = this.createUrl();
        var script = document.createElement("script");
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
    };
    Loader.prototype.loadErrorCallback = function (e) {
        this.onerrorEvent = e;
        this.callback();
    };
    Loader.prototype.setCallback = function () {
        window.__googleMapsCallback = this.callback.bind(this);
    };
    Loader.prototype.callback = function () {
        var _this = this;
        this.done = true;
        this.loading = false;
        this.callbacks.forEach(function (cb) {
            cb(_this.onerrorEvent);
        });
        this.callbacks = [];
    };
    Loader.prototype.execute = function () {
        if (window.google && window.google.maps && window.google.maps.version) {
            console.warn("Aborted attempt to load Google Maps JS with @googlemaps/js-api-loader." +
                "This may result in undesirable behavior as script parameters may not match.");
            this.callback();
        }
        if (this.done) {
            this.callback();
        }
        else {
            if (this.loading) ;
            else {
                this.loading = true;
                this.setCallback();
                this.setScript();
            }
        }
    };
    return Loader;
}());

export { Loader };
//# sourceMappingURL=index.esm.js.map
