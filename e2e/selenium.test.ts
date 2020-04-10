/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from "path";
import webdriver from "selenium-webdriver";

let driver: webdriver.WebDriver;

beforeAll(async () => {
  const server = `http://localhost:4444/wd/hub`;

  switch (process.env.BROWSER || "chrome") {
    case "chrome": {
      driver = new webdriver.Builder()
        .usingServer(server)
        .withCapabilities({
          browserName: "chrome",
        })
        .build();
      break;
    }
    case "firefox": {
      driver = new webdriver.Builder()
        .usingServer(server)
        .withCapabilities({
          browserName: "firefox",
        })
        .build();
      break;
    }
  }
});

afterAll(async () => {
  await driver.quit();
});

it("loader should load map and getCenter", async () => {
  jest.setTimeout(30000);
  await driver.get("file://" + path.resolve(__dirname, "index.html"));

  await expect(
    driver.executeAsyncScript((apiKey: string) => {
      // @ts-ignore-next-line
      const callback = arguments[arguments.length - 1];

      // @ts-ignore-next-line
      const { expect } = window.jestLite.core;

      const mapOptions = {
        center: {
          lat: 0,
          lng: 0,
        },
        zoom: 4,
      };

      try {
        // @ts-ignore-next-line
        const loader = new google.maps.plugins.loader.Loader({ apiKey });

        loader.load().then(() => {
          expect(loader.done).toBeTruthy();
          expect(google.maps.Map).toBeDefined();

          const map = new google.maps.Map(
            document.getElementById("map"),
            mapOptions
          );
          // use toString since serialization doesn't work in firefox
          callback(map.getCenter().toString());
        });
      } catch (e) {
        callback(e);
      }
    }, process.env.GOOGLE_MAPS_API_KEY)
  ).resolves.toEqual("(0, 0)");
});
