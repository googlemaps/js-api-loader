[![npm](https://img.shields.io/npm/v/@googlemaps/js-api-loader)][npm-pkg]
[![License](https://img.shields.io/github/license/googlemaps/js-api-loader?color=blue)][license]
![Stable](https://img.shields.io/badge/stability-stable-green)
[![Tests/Build](https://github.com/googlemaps/js-api-loader/actions/workflows/test.yml/badge.svg)](https://github.com/googlemaps/js-api-loader/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/googlemaps/js-api-loader/branch/main/graph/badge.svg)](https://app.codecov.io/gh/googlemaps/js-api-loader/tree/main)
[![StackOverflow](https://img.shields.io/stackexchange/stackoverflow/t/google-maps?color=orange&label=google-maps&logo=stackoverflow)](https://stackoverflow.com/questions/tagged/google-maps)
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]

# Google Maps JavaScript API Loader

## Description

Load the Google Maps JavaScript API script dynamically. This is an npm version
of the [Dynamic Library Import](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import)
script.

## Requirements

- [Sign up with Google Maps Platform]
- A Google Cloud Platform [project] with the [**Maps JavaScript API**][maps-sdk]
  enabled
- An [API key] associated with the project above

## Installation

Install [`@googlemaps/js-api-loader`][npm-pkg] with:

```sh
npm install --save @googlemaps/js-api-loader

# or
yarn add @googlemaps/js-api-loader

# or
pnpm add @googlemaps/js-api-loader
```

TypeScript users should additionally install the types for the Google Maps
JavaScript API:

```sh
npm install --save-dev @types/google.maps
```

## Usage

```javascript
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// Set the options for loading the API.
setOptions({ key: "your-api-key-here" });

// Load the needed APIs.
// Note: once the returned promise is fulfilled, the libraries are also
//       available in the global `google.maps` namespace.
const { Map } = await importLibrary("maps");
const map = new Map(mapEl, mapOptions);

// Alternatively:
await importLibrary("maps");
const map = new google.maps.Map(mapEl, mapOptions);

// Or, if you prefer using callbacks instead of async/await:
importLibrary("maps").then(({ Map }) => {
  const map = new Map(mapEl, mapOptions);
});
```

If you use custom HTML elements from the Google Maps JavaScript API (e.g.
`<gmp-map>`, and `<gmp-advanced-marker>`), you need to import them as well.
Note that you do not need to await the result of `importLibrary()` in this case.
The custom elements will upgrade automatically once the library is loaded
and you can use the `whenDefined()` method to wait for the upgrade to
complete.

```javascript
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// Set the options for loading the API.
setOptions({ key: "your-api-key-here" });

// Start loading the libraries needed for custom elements.
importLibrary("maps"); // needed for <gmp-map>
importLibrary("marker"); // needed for <gmp-advanced-marker>

// Wait for gmp-map to be upgraded and interact with it.
await customElements.whenDefined("gmp-map");
const map = document.querySelector("gmp-map");
// ...
```

## Documentation

This package exports just two functions, `setOptions()` and `importLibrary()`.

```ts
// Using named exports:
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({ key: GOOGLE_MAPS_API_KEY });
await importLibrary("core");
```

### `setOptions(options: APIOptions): void`

Sets the options for loading the Google Maps JavaScript API and installs the
global `google.maps.importLibrary()` function that is used by the
`importLibrary()` function of this package.

This function should be called as early as possible in your application and
should only be called once. Any further calls will not have any effect and
log a warning to the console.

Below is a short summary of the accepted options, see the
[documentation][parameters] for full descriptions and additional information:

- `key: string`: Your API key. This is the only required option.
- `v: string`: The version of the Maps JavaScript API to load.
- `language: string`: The language to use.
- `region: string`: The region code to use.
- `libraries: string[]`: Additional libraries to preload.
- `authReferrerPolicy: string`: Set the referrer policy for the API requests.
- `mapIds: string[]`: An array of map IDs to preload.
- `channel: string`: Can be used to track your usage.
- `solutionChannel: string`: Used by the Google Maps Platform to track
  adoption and usage of examples and solutions.

### `importLibrary(library: string): Promise`

Loads the specified library. Returns a promise that resolves with the
library object when the library is loaded. In case of an error while loading
the library (might be due to poor network conditions and other unforseeable
circumstances), the promise is rejected with an error.

Calling this function for the first time will trigger loading the Google
Maps JavaScript API itself.

The following libraries are available:

- `core`: [`google.maps.CoreLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#CoreLibrary)
- `maps`: [`google.maps.MapsLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#MapsLibrary)
- `maps3d`: [`google.maps.Maps3DLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#Maps3DLibrary)
- `places`: [`google.maps.PlacesLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#PlacesLibrary)
- `geocoding`: [`google.maps.GeocodingLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#GeocodingLibrary)
- `routes`: [`google.maps.RoutesLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#RoutesLibrary)
- `marker`: [`google.maps.MarkerLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#MarkerLibrary)
- `geometry`: [`google.maps.GeometryLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#GeometryLibrary)
- `elevation`: [`google.maps.ElevationLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#ElevationLibrary)
- `streetView`: [`google.maps.StreetViewLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#StreetViewLibrary)
- `journeySharing`: [`google.maps.JourneySharingLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#JourneySharingLibrary)
- `visualization`: [`google.maps.VisualizationLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#VisualizationLibrary)
- `airQuality`: [`google.maps.AirQualityLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#AirQualityLibrary)
- `addressValidation`: [`google.maps.AddressValidationLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#AddressValidationLibrary)
- `drawing`: [`google.maps.DrawingLibrary`](https://developers.google.com/maps/documentation/javascript/reference/library-interfaces#DrawingLibrary) (deprecated)

## Migrating from v1 to v2

See the [migration guide](MIGRATION.md).

## Contributing

Contributions are welcome and encouraged! If you'd like to contribute, send
us a [pull request] and refer to our [code of conduct] and [contributing guide].

## Terms of Service

This library uses Google Maps Platform services. Use of Google Maps
Platform services through this library is subject to the Google Maps
Platform [Terms of Service].

This library is not a Google Maps Platform Core Service. Therefore, the
Google Maps Platform Terms of Service (e.g. Technical Support Services,
Service Level Agreements, and Deprecation Policy) do not apply to the code
in this library.

### European Economic Area (EEA) developers

If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

## Support

This library is offered via an open source [license]. It is not governed by
the Google Maps Platform Support [Technical Support Services Guidelines],
the [SLA], or the [Deprecation Policy]. However, any Google Maps Platform
services used by the library remain subject to the Google Maps Platform Terms of Service.

This library adheres to [semantic versioning] to indicate when
backwards-incompatible changes are introduced.

If you find a bug, or have a feature request, please [file an issue] on
GitHub. If you would like to get answers to technical questions from other
Google Maps Platform developers, ask through one of our
[developer community channels].
If you'd like to contribute, please check the [contributing guide].

You can also discuss this library on our [Discord server].

[API key]: https://developers.google.com/maps/documentation/javascript/get-api-key
[maps-sdk]: https://developers.google.com/maps/documentation/javascript
[reference]: https://googlemaps.github.io/js-api-loader/index.html
[documentation]: https://googlemaps.github.io/js-api-loader
[parameters]: https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
[npm-pkg]: https://npmjs.com/package/@googlemaps/js-api-loader
[code of conduct]: ?tab=coc-ov-file#readme
[contributing guide]: CONTRIBUTING.md
[Deprecation Policy]: https://cloud.google.com/maps-platform/terms
[developer community channels]: https://developers.google.com/maps/developer-community
[Discord server]: https://discord.gg/hYsWbmk
[file an issue]: https://github.com/googlemaps/js-api-loader/issues/new/choose
[license]: LICENSE
[project]: https://developers.google.com/maps/documentation/javascript/cloud-setup#enabling-apis
[pull request]: https://github.com/googlemaps/js-api-loader/compare
[semantic versioning]: https://semver.org
[Sign up with Google Maps Platform]: https://console.cloud.google.com/google/maps-apis/start
[SLA]: https://cloud.google.com/maps-platform/terms/sla
[Technical Support Services Guidelines]: https://cloud.google.com/maps-platform/terms/tssg
[Terms of Service]: https://cloud.google.com/maps-platform/terms
