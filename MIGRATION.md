# Migration from v1.x to v2.x

This guide provides instructions for migrating from version 1.x of
`@googlemaps/js-api-loader` to version 2.x.

## Core Concepts

The primary change in v2.x is the move from a class-based (`Loader`) to a
functional approach. This simplifies the API and aligns it with
[the recommended way](https://developers.google.com/maps/documentation/javascript/load-maps-js-api)
to load the Google Maps JavaScript API.

- **v1.x:** You would create an instance of the `Loader` class with your 
  configuration and then call methods like `load()` or `importLibrary()` on 
  that instance.
- **v2.x:** You now use two standalone functions: `setOptions()` to 
  configure the API loader and `importLibrary()` to load specific libraries.

Generally, the Loader constructor can be replaced with a call to `setOptions()`,
and the different methods used to actually load the API are all replaced
with calls to `importLibrary()`.

## Key Changes

| Feature                | v1.x (`Loader` class)                | v2.x (functions)                        |
| :--------------------- | :----------------------------------- | :-------------------------------------- |
| **Initialization**     | `new Loader({ apiKey: '...', ... })` | `setOptions({ key: '...', ... })`       |
| **Loading Libraries**  | `loader.importLibrary('maps')`       | `importLibrary('maps')`                 |
| **Legacy Loading**     | `loader.load()`                      | Removed. Use `importLibrary()` instead. |
| **API Key Parameters** | `apiKey`                             | `key`                                   |
|                        | `version`                            | `v`                                     |

## Typical Use Cases Compared

### v1.x

The most common use case of the 1.x versions was loading a predefined set of
libraries explicitly, and then using the global `google.maps` namespace.

```javascript
import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "YOUR_API_KEY",
  version: "weekly",
  libraries: ["maps", "places"],
});

// a) using load() with promises
loader.load().then(() => initMap());

// b) using load() with async/await:
await loader.load();
initMap();

// c) using callback
loader.loadCallback(() => {
  initMap();
});

function initMap() {
  // use the global google.maps namespace once loading is complete
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
```

### v2.x

The typical use case from versions 2.0 onwards is to use `importLibrary` to get
access to the classes and features needed from the Maps JavaScript API.

```javascript
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({
  key: "YOUR_API_KEY",
  v: "weekly",
});

try {
  const { Map } = await importLibrary("maps");
  // Use the maps library
  const map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
} catch (e) {
  // do something
}
```

However, all the examples from the 1.x version can also be written based
on the 2.x version, since – besides returning the library object – the
`importLibrary()` function also populates the global `google.maps` namespace.

<details>
<summary>Imitating the 1.x API</summary>

```javascript
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

setOptions({
  key: "YOUR_API_KEY",
  v: "weekly",

  // Libraries can still be specified in `setOptions`. This makes sure that
  // all libraries are available when the importLibrary promise is resolved.
  libraries: ["maps", "places"],
});

// The examples from above, rewritten with v2.0:
//
// a) using promises (note: which library is imported in these cases makes
//    little difference: the libraries were specified in `setOptions` and
//    we're not using the returned value)
importLibrary("core").then(() => initMap());

// b) using load() with async/await:
await importLibrary("core");
initMap();

// c) using a callback – this is identical to a)

function initMap() {
  // Use the global google.maps namespace once loading is complete
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
```

</details>
