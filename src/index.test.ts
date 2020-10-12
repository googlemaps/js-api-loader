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

import { Loader, LoaderOptions } from ".";

afterEach(() => {
  document.getElementsByTagName("html")[0].innerHTML = "";
});

test.each([
  [{}, "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback"],
  [
    { apiKey: "foo" },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&key=foo",
  ],
  [
    {
      apiKey: "foo",
      version: "weekly",
      libraries: ["places"],
      language: "language",
      region: "region",
    },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&key=foo&libraries=places&language=language&region=region&v=weekly",
  ],
  [
    { mapIds: ["foo", "bar"] },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&map_ids=foo,bar",
  ],
  [
    { url: "https://example.com/js" },
    "https://example.com/js?callback=__googleMapsCallback",
  ],
  [
    { channel: "foo" },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&channel=foo",
  ],
])("createUrl is correct", (options: LoaderOptions, expected: string) => {
  const loader = new Loader(options);
  expect(loader.createUrl()).toEqual(expected);
});

test("setScript adds a script to head with correct attributes", () => {
  const loader = new Loader({ apiKey: "foo" });

  loader["setScript"]();

  const script = document.head.childNodes[0] as HTMLScriptElement;

  expect(script.id).toEqual(loader.id);
  expect(script.src).toEqual(loader.createUrl());
  expect(script.defer).toBeTruthy();
  expect(script.async).toBeTruthy();
  expect(script.onerror).toBeTruthy();
  expect(script.type).toEqual("text/javascript");
});

test("setScript does not add second script with same id", () => {
  new Loader({ apiKey: "foo", id: "bar" })["setScript"]();
  new Loader({ apiKey: "foo", id: "bar" })["setScript"]();

  expect(document.head.childNodes.length).toBe(1);
});

test("setScript adds a script with id", () => {
  const loader = new Loader({ apiKey: "foo", id: "bar" });
  loader["setScript"]();

  const script = document.head.childNodes[0] as HTMLScriptElement;
  expect(script.id).toEqual(loader.id);
});

test("load should return a promise that resolves even if called twice", () => {
  const loader = new Loader({ apiKey: "foo" });

  expect.assertions(1);
  const promise = Promise.all([loader.load(), loader.load()]).then(() => {
    expect(loader["done"]).toBeTruthy();
  });

  window.__googleMapsCallback(null);

  return promise;
});

test("loadCallback callback should fire", () => {
  const loader = new Loader({ apiKey: "foo" });

  expect.assertions(2);
  loader.loadCallback((e: Event) => {
    expect(loader["done"]).toBeTruthy();
    expect(e).toBeUndefined();
  });

  window.__googleMapsCallback(null);
});

test("script onerror should reject promise", () => {
  const loader = new Loader({ apiKey: "foo" });

  expect.assertions(3);

  const promise = loader.load().catch((e) => {
    expect(e).toBeTruthy();
    expect(loader["done"]).toBeTruthy();
    expect(loader["loading"]).toBeFalsy();
  });

  loader["loadErrorCallback"](document.createEvent("ErrorEvent"));

  return promise;
});

test("loader should resolve immediately when successfully loaded", async () => {
  // use await/async pattern since the promise resolves without trigger
  const loader = new Loader({ apiKey: "foo" });
  loader["done"] = true;

  await expect(loader.loadPromise()).resolves.toBeUndefined();
});

test("loader should resolve immediately when failed loading", async () => {
  // use await/async pattern since the promise rejects without trigger
  const loader = new Loader({ apiKey: "foo" });
  loader["done"] = true;
  loader["onerrorEvent"] = document.createEvent("ErrorEvent");

  await expect(loader.loadPromise()).rejects.toBeDefined();
});

test("loader should wait if already loading", () => {
  const loader = new Loader({ apiKey: "foo" });
  loader["loading"] = true;

  loader.load();
});

test("setScript adds a nonce", () => {
  const nonce = "bar";
  const loader = new Loader({ apiKey: "foo", nonce });
  loader["setScript"]();
  const script = document.head.childNodes[0] as HTMLScriptElement;
  expect(script.nonce).toBe(nonce);
});
