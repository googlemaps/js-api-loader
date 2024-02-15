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
/* eslint @typescript-eslint/no-explicit-any: 0 */
import { DEFAULT_ID, Loader, LoaderOptions, LoaderStatus } from ".";

jest.useFakeTimers();

afterEach(() => {
  document.getElementsByTagName("html")[0].innerHTML = "";
  delete Loader["instance"];
  if (window.google) delete window.google;
});

test.each([
  [
    {},
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&loading=async",
  ],
  [
    { apiKey: "foo" },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&loading=async&key=foo",
  ],
  [
    {
      apiKey: "foo",
      version: "weekly",
      libraries: ["marker", "places"],
      language: "language",
      region: "region",
    },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&loading=async&key=foo&libraries=marker,places&language=language&region=region&v=weekly",
  ],
  [
    { mapIds: ["foo", "bar"] },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&loading=async&map_ids=foo,bar",
  ],
  [
    { url: "https://example.com/js" },
    "https://example.com/js?callback=__googleMapsCallback&loading=async",
  ],
  [
    { client: "bar", channel: "foo" },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&loading=async&channel=foo&client=bar",
  ],
  [
    { authReferrerPolicy: "origin" },
    "https://maps.googleapis.com/maps/api/js?callback=__googleMapsCallback&loading=async&auth_referrer_policy=origin",
  ],
])("createUrl is correct", (options: LoaderOptions, expected: string) => {
  const loader = new Loader(options);
  expect(loader.createUrl()).toEqual(expected);
  expect(loader.status).toBe(LoaderStatus.INITIALIZED);
});

test("uses default id if empty string", () => {
  expect(new Loader({ apiKey: "foo", id: "" }).id).toBe(DEFAULT_ID);
});

test("setScript adds a script to head with correct attributes", async () => {
  const loader = new Loader({ apiKey: "foo" });

  loader["setScript"]();
  await 0;

  const script = document.head.childNodes[0] as HTMLScriptElement;

  expect(script.id).toEqual(loader.id);
});

test("setScript adds a script with id", async () => {
  const loader = new Loader({ apiKey: "foo", id: "bar" });
  loader["setScript"]();
  await 0;

  const script = document.head.childNodes[0] as HTMLScriptElement;
  expect(script.localName).toEqual("script");
  expect(loader.id).toEqual("bar");
  expect(script.id).toEqual("bar");
});

test("setScript does not add second script with same id", async () => {
  new Loader({ apiKey: "foo", id: "bar" })["setScript"]();
  new Loader({ apiKey: "foo", id: "bar" })["setScript"]();
  await 0;
  new Loader({ apiKey: "foo", id: "bar" })["setScript"]();
  await 0;

  expect(document.head.childNodes.length).toBe(1);
});

test("setScript adds a script to head with valid src", async () => {
  const loader = new Loader({ apiKey: "foo" });

  loader["setScript"]();
  await 0;

  const script = document.head.childNodes[0] as HTMLScriptElement;

  expect(script.src).toEqual(
    "https://maps.googleapis.com/maps/api/js?libraries=core&key=foo&callback=google.maps.__ib__"
  );
});

test("setScript adds a script to head with valid src with libraries", async () => {
  const loader = new Loader({ apiKey: "foo", libraries: ["marker", "places"] });

  loader["setScript"]();
  await 0;

  const script = document.head.childNodes[0] as HTMLScriptElement;

  expect(script.src).toEqual(
    "https://maps.googleapis.com/maps/api/js?libraries=marker%2Cplaces&key=foo&callback=google.maps.__ib__"
  );
});

test("load should return a promise that resolves even if called twice", () => {
  const loader = new Loader({ apiKey: "foo" });
  loader.importLibrary = (() => Promise.resolve()) as any;

  expect.assertions(1);
  const promise = Promise.all([loader.load(), loader.load()]).then(() => {
    expect(loader["done"]).toBeTruthy();
  });

  return promise;
});

test("loadCallback callback should fire", () => {
  const loader = new Loader({ apiKey: "foo" });
  loader.importLibrary = (() => Promise.resolve()) as any;

  expect.assertions(2);
  loader.loadCallback((e: Event) => {
    expect(loader["done"]).toBeTruthy();
    expect(e).toBeUndefined();
  });
});

test("script onerror should reject promise", async () => {
  const loader = new Loader({ apiKey: "foo", retries: 0 });

  const rejection = expect(loader.load()).rejects.toBeInstanceOf(Error);

  loader["loadErrorCallback"](
    new ErrorEvent("ErrorEvent(", { error: new Error("") })
  );

  await rejection;
  expect(loader["done"]).toBeTruthy();
  expect(loader["loading"]).toBeFalsy();
  expect(loader["errors"].length).toBe(1);
  expect(loader.status).toBe(LoaderStatus.FAILURE);
});

test("script onerror should reject promise with multiple loaders", async () => {
  const loader = new Loader({ apiKey: "foo", retries: 0 });
  const extraLoader = new Loader({ apiKey: "foo", retries: 0 });

  let rejection = expect(loader.load()).rejects.toBeInstanceOf(Error);
  loader["loadErrorCallback"](
    new ErrorEvent("ErrorEvent(", { error: new Error("") })
  );

  await rejection;
  expect(loader["done"]).toBeTruthy();
  expect(loader["loading"]).toBeFalsy();
  expect(loader["onerrorEvent"]).toBeInstanceOf(ErrorEvent);

  rejection = expect(extraLoader.load()).rejects.toBeInstanceOf(Error);
  loader["loadErrorCallback"](
    new ErrorEvent("ErrorEvent(", { error: new Error("") })
  );

  await rejection;
  expect(extraLoader["done"]).toBeTruthy();
  expect(extraLoader["loading"]).toBeFalsy();
});

test("script onerror should retry", async () => {
  const loader = new Loader({ apiKey: "foo", retries: 1 });
  const deleteScript = jest.spyOn(loader, "deleteScript");
  loader.importLibrary = (() => Promise.reject(new Error("fake error"))) as any;
  const rejection = expect(loader.load()).rejects.toBeInstanceOf(Error);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.error = jest.fn();

  // wait for the first failure
  await 0;
  await 0;
  expect(loader["errors"].length).toBe(1);
  // trigger the retry delay:
  jest.runAllTimers();

  await rejection;
  expect(loader["errors"].length).toBe(2);
  expect(loader["done"]).toBeTruthy();
  expect(loader["failed"]).toBeTruthy();
  expect(loader["loading"]).toBeFalsy();
  expect(deleteScript).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledTimes(loader.retries);
});

test("script onerror should reset retry mechanism with next loader", async () => {
  const loader = new Loader({ apiKey: "foo", retries: 1 });
  const deleteScript = jest.spyOn(loader, "deleteScript");
  loader.importLibrary = (() => Promise.reject(new Error("fake error"))) as any;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.error = jest.fn();

  let rejection = expect(loader.load()).rejects.toBeInstanceOf(Error);
  // wait for the first first failure
  await 0;
  await 0;
  expect(loader["errors"].length).toBe(1);
  // trigger the retry delay:
  jest.runAllTimers();
  await rejection;

  // try again...
  rejection = expect(loader.load()).rejects.toBeInstanceOf(Error);
  expect(loader["done"]).toBeFalsy();
  expect(loader["failed"]).toBeFalsy();
  expect(loader["loading"]).toBeTruthy();
  expect(loader["errors"].length).toBe(0);

  // wait for the second first failure
  await 0;
  await 0;
  expect(loader["errors"].length).toBe(1);
  // trigger the retry delay:
  jest.runAllTimers();

  await rejection;
  expect(deleteScript).toHaveBeenCalledTimes(3);
  expect(console.error).toHaveBeenCalledTimes(loader.retries * 2);
});

test("script onerror should not reset retry mechanism with parallel loaders", async () => {
  const loader = new Loader({ apiKey: "foo", retries: 1 });
  const deleteScript = jest.spyOn(loader, "deleteScript");
  loader.importLibrary = (() => Promise.reject(new Error("fake error"))) as any;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  console.error = jest.fn();

  const rejection1 = expect(loader.load()).rejects.toBeInstanceOf(Error);
  const rejection2 = expect(loader.load()).rejects.toBeInstanceOf(Error);
  // wait for the first first failure
  await 0;
  await 0;
  jest.runAllTimers();

  await Promise.all([rejection1, rejection2]);
  expect(loader["done"]).toBeTruthy();
  expect(loader["loading"]).toBeFalsy();
  expect(loader["errors"].length).toBe(2);
  expect(deleteScript).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledTimes(loader.retries);
});

test("reset should clear state", () => {
  const loader = new Loader({ apiKey: "foo", retries: 0 });
  const deleteScript = jest.spyOn(loader, "deleteScript");

  loader["done"] = true;
  loader["loading"] = false;
  loader["errors"] = [new ErrorEvent("foo")];

  loader["reset"]();

  expect(loader["done"]).toBeFalsy();
  expect(loader["loading"]).toBeFalsy();
  expect(loader["onerrorEvent"]).toBe(null);
  expect(deleteScript).toHaveBeenCalledTimes(1);
});

test("failed getter should be correct", () => {
  const loader = new Loader({ apiKey: "foo", retries: 0 });

  // initial
  expect(loader["failed"]).toBeFalsy();

  // not done
  loader["done"] = false;
  loader["loading"] = false;
  loader["errors"] = [new ErrorEvent("foo")];
  expect(loader["failed"]).toBeFalsy();

  // still loading
  loader["done"] = false;
  loader["loading"] = true;
  loader["errors"] = [new ErrorEvent("foo")];
  expect(loader["failed"]).toBeFalsy();

  // no errors
  loader["done"] = true;
  loader["loading"] = false;
  loader["errors"] = [];
  expect(loader["failed"]).toBeFalsy();

  // done with errors
  loader["done"] = true;
  loader["loading"] = false;
  loader["errors"] = [new ErrorEvent("foo")];
  expect(loader["failed"]).toBeTruthy();
});

test("loader should not reset retry mechanism if successfully loaded", async () => {
  const loader = new Loader({ apiKey: "foo", retries: 0 });
  const deleteScript = jest.spyOn(loader, "deleteScript");
  loader.importLibrary = (() => Promise.resolve()) as any;

  await expect(loader.load()).resolves.not.toBeUndefined();

  expect(loader["done"]).toBeTruthy();
  expect(loader["loading"]).toBeFalsy();
  expect(deleteScript).toHaveBeenCalledTimes(0);
});

test("singleton should be used", () => {
  const loader = new Loader({ apiKey: "foo" });
  const extraLoader = new Loader({ apiKey: "foo" });
  expect(extraLoader).toBe(loader);

  loader["done"] = true;
  expect(extraLoader["done"]).toBe(loader["done"]);
  expect(loader.status).toBe(LoaderStatus.SUCCESS);
});

test("singleton should throw with different options", () => {
  new Loader({ apiKey: "foo" });
  expect(() => {
    new Loader({ apiKey: "bar" });
  }).toThrowError();
});

test("loader should resolve immediately when successfully loaded", async () => {
  // use await/async pattern since the promise resolves without trigger
  const loader = new Loader({ apiKey: "foo", retries: 0 });
  loader["done"] = true;
  // TODO causes warning
  window.google = { maps: { version: "3.*.*" } as any };
  await expect(loader.loadPromise()).resolves.toBeDefined();
});

test("loader should resolve immediately when failed loading", async () => {
  // use await/async pattern since the promise rejects without trigger
  const loader = new Loader({ apiKey: "foo", retries: 0 });
  loader["done"] = true;
  loader["onerrorEvent"] = new ErrorEvent("ErrorEvent(", {
    error: new Error(""),
  });

  await expect(loader.loadPromise()).rejects.toBeDefined();
});

test("loader should wait if already loading", () => {
  const loader = new Loader({ apiKey: "foo", retries: 0 });
  loader["loading"] = true;
  expect(loader.status).toBe(LoaderStatus.LOADING);
  loader.load();
});

test("setScript adds a nonce", async () => {
  const nonce = "bar";
  const loader = new Loader({ apiKey: "foo", nonce });
  loader["setScript"]();
  await 0;
  const script = document.head.childNodes[0] as HTMLScriptElement;
  expect(script.nonce).toBe(nonce);
});

test("loader should resolve immediately when google.maps defined", async () => {
  const loader = new Loader({ apiKey: "foo" });
  window.google = { maps: { version: "3.*.*" } as any };
  console.warn = jest.fn();
  await expect(loader.loadPromise()).resolves.toBeDefined();
  delete window.google;
  expect(console.warn).toHaveBeenCalledTimes(1);
});

test("loader should not warn if done and google.maps is defined", async () => {
  const loader = new Loader({ apiKey: "foo" });
  loader["done"] = true;
  window.google = { maps: { version: "3.*.*" } as any };
  console.warn = jest.fn();
  await expect(loader.loadPromise()).resolves.toBeDefined();
  delete window.google;
  expect(console.warn).toHaveBeenCalledTimes(0);
});

test("deleteScript removes script tag from head", async () => {
  const loader = new Loader({ apiKey: "foo" });
  loader["setScript"]();
  await 0;
  expect(document.head.childNodes.length).toBe(1);
  loader.deleteScript();
  expect(document.head.childNodes.length).toBe(0);
  // should work without script existing
  loader.deleteScript();
  expect(document.head.childNodes.length).toBe(0);
});

test("importLibrary resolves correctly", async () => {
  window.google = { maps: {} } as any;
  google.maps.importLibrary = async (name) => ({ [name]: "fake" }) as any;

  const loader = new Loader({ apiKey: "foo" });
  const corePromise = loader.importLibrary("core");

  const core = await corePromise;
  expect(core).toEqual({ core: "fake" });
});

test("importLibrary can also set up bootstrap libraries (if bootstrap libraries empty)", async () => {
  const loader = new Loader({ apiKey: "foo" });
  loader.importLibrary("marker");
  loader.importLibrary("places");

  await 0;

  const script = document.head.childNodes[0] as HTMLScriptElement;

  expect(script.src).toEqual(
    "https://maps.googleapis.com/maps/api/js?libraries=core%2Cmarker%2Cplaces&key=foo&callback=google.maps.__ib__"
  );
});

test("importLibrary resolves correctly even with different bootstrap libraries", async () => {
  window.google = { maps: {} } as any;
  google.maps.importLibrary = async (name) => ({ [name]: "fake" }) as any;

  const loader = new Loader({ apiKey: "foo", libraries: ["places"] });
  const corePromise = loader.importLibrary("core");

  const core = await corePromise;
  expect(core).toEqual({ core: "fake" });
  expect(await loader.importLibrary("places")).toEqual({ places: "fake" });
});
