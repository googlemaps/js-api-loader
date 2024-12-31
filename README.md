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
Load the Google Maps JavaScript API script dynamically. This takes inspiration from the [google-maps](https://www.npmjs.com/package/google-maps) npm package but updates it with ES6, Promises, and TypeScript.

## Requirements

* [Sign up with Google Maps Platform]
* A Google Maps Platform [project] with the [**Maps Javascript API**][maps-sdk] enabled
* An [API key] associated with the project above
* [@googlemaps/js-api-loader NPM package][npm-pkg]

## Installation

Install the [@googlemaps/js-api-loader NPM package][npm-pkg] with:

```sh
npm i @googlemaps/js-api-loader
```

Alternatively you may add the umd package directly to the html document using the unpkg link.

```html
<script src="https://unpkg.com/@googlemaps/js-api-loader@1.x/dist/index.min.js"></script>
```

When adding via unpkg, the loader can be accessed at `google.maps.plugins.loader.Loader`.

### TypeScript

TypeScript users need to install the following types package.

```sh
npm i -D @types/google.maps
```

## Documentation

The reference documentation can be found at this [link](https://googlemaps.github.io/js-api-loader/index.html). The Google Maps JavaScript API [documentation](https://developers.google.com/maps/documentation/javascript/tutorial) is the authoritative source for the loader options.

## Usage

```javascript
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: "",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4
};

```

Using a promise for a specific library.

```javascript
// Promise for a specific library
loader
  .importLibrary('maps')
  .then(({Map}) => {
    new Map(document.getElementById("map"), mapOptions);
  })
  .catch((e) => {
    // do something
  });
```

Using a promise for when the script has loaded.

```javascript
// Promise
loader
  .load()
  .then((google) => {
    new google.maps.Map(document.getElementById("map"), mapOptions);
  })
  .catch(e => {
    // do something
  });
```

Alternatively, if you want to use a callback.

```javascript
// Callback
loader.loadCallback(e => {
  if (e) {
    console.log(e);
  } else {
    new google.maps.Map(document.getElementById("map"), mapOptions);
  }
});
```

View the package in action [here](https://googlemaps.github.io/js-api-loader/examples/index.html).

## Contributing

Contributions are welcome and encouraged! If you'd like to contribute, send us a [pull request] and refer to our [code of conduct] and [contributing guide].

## Terms of Service

This library uses Google Maps Platform services. Use of Google Maps Platform services through this library is subject to the Google Maps Platform [Terms of Service].

This library is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this library.

## Support

This library is offered via an open source [license]. It is not governed by the Google Maps Platform Support [Technical Support Services Guidelines, the SLA, or the [Deprecation Policy]. However, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service.

This library adheres to [semantic versioning] to indicate when backwards-incompatible changes are introduced. Accordingly, while the library is in version 0.x, backwards-incompatible changes may be introduced at any time.

If you find a bug, or have a feature request, please [file an issue] on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels]. If you'd like to contribute, please check the [contributing guide].

You can also discuss this library on our [Discord server].

[API key]: https://developers.google.com/maps/documentation/javascript/get-api-key
[maps-sdk]: https://developers.google.com/maps/documentation/javascript
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
