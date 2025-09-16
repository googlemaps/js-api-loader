[![npm](https://img.shields.io/npm/v/@googlemaps/js-api-loader)][npm-pkg]
![Release](https://github.com/googlemaps/js-api-loader/workflows/Release/badge.svg)
![Stable](https://img.shields.io/badge/stability-stable-green)
[![Tests/Build](https://github.com/googlemaps/js-api-loader/actions/workflows/test.yml/badge.svg)](https://github.com/googlemaps/js-api-loader/actions/workflows/test.yml)

[![codecov](https://codecov.io/gh/googlemaps/js-api-loader/branch/main/graph/badge.svg)](https://codecov.io/gh/googlemaps/js-api-loader)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

![Contributors](https://img.shields.io/github/contributors/googlemaps/js-api-loader?color=green)
[![License](https://img.shields.io/github/license/googlemaps/js-api-loader?color=blue)][license]
[![StackOverflow](https://img.shields.io/stackexchange/stackoverflow/t/google-maps?color=orange&label=google-maps&logo=stackoverflow)](https://stackoverflow.com/questions/tagged/google-maps)
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]

# Google Maps JavaScript API Loader

## Description

Load the Google Maps JavaScript API script dynamically. This is essentially
an npm version of the [Dynamic Library Import](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import)
script.

## Requirements

- [Sign up with Google Maps Platform]
- A Google Cloud Platform [project] with the [**Maps JavaScript API**]
  [maps-sdk] enabled
- An [API key] associated with the project above
- [@googlemaps/js-api-loader NPM package][npm-pkg]

## Installation

Install the [`@googlemaps/js-api-loader` NPM package][npm-pkg] with:

```sh
npm install @googlemaps/js-api-loader
```

Alternatively you may add the UMD package directly to the html document using
the unpkg link.

```html
<script src="https://unpkg.com/@googlemaps/js-api-loader@2.x/dist/index.umd.js"></script>
```

When adding via unpkg, the loader can be accessed at `google.maps.plugins.loader.Loader`.

### TypeScript

TypeScript users need to install the following types package.

```sh
npm install --save-dev @types/google.maps
```

## Documentation

The reference documentation can be found at this [link][reference]. The Google
Maps JavaScript API documentation is the authoritative source for the loader options.

## Usage

```javascript
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// set the options for loading the API.
// See here for a list of supported options:
//   https://developers.google.com/maps/documentation/javascript/load-maps-js-api#required_parameters
setOptions({ key: "your-api-key-here" });

// load the needed APIs asynchronously.
// Once the returned promise is fulfilled, the libraries are also
// available in the global `google.maps` namespace.
const { Map } = await importLibrary("maps");
const map = new Map(mapEl, mapOptions);

// alternatively:
await importLibrary("maps");
const map = new google.maps.Map(mapEl, mapOptions);

// or, if you prefer using callbacks instead of async/awqait:
importLibrary("maps").then(() => {
  const map = new google.maps.Map(mapEl, mapOptions);
});
```

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
[similar inquiry]: https://github.com/googlemaps/js-api-loader/issues
[SLA]: https://cloud.google.com/maps-platform/terms/sla
[Technical Support Services Guidelines]: https://cloud.google.com/maps-platform/terms/tssg
[Terms of Service]: https://cloud.google.com/maps-platform/terms
