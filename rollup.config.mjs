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

import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const terserOptions = {
  output: { comments: "some" },
};

export default [
  // UMD and browser (iife) builds
  {
    input: "src/index.ts",
    plugins: [
      typescript({ tsconfig: "./tsconfig.build.json", declarationDir: "./" }),
      nodeResolve({
        mainFields: ["browser", "jsnext:main", "module", "main"],
      }),
      commonjs(),
      babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
      }),
    ],
    output: [
      {
        file: "dist/index.umd.js",
        format: "umd",
        name: "google.maps.plugins.loader",
        sourcemap: true,
        plugins: [terser(terserOptions)],
      },
      {
        file: "dist/index.min.js",
        format: "iife",
        name: "google.maps.plugins.loader",
        sourcemap: true,
        plugins: [terser(terserOptions)],
      },
      {
        file: "dist/index.dev.js",
        format: "iife",
        name: "google.maps.plugins.loader",
        sourcemap: true,
      },
    ],
  },

  // ESM build
  {
    input: "src/index.ts",
    plugins: [
      typescript({ tsconfig: "./tsconfig.build.json", declarationDir: "./" }),
      nodeResolve(),
      commonjs(),
    ],
    output: {
      file: "dist/index.mjs",
      format: "esm",
      sourcemap: true,
    },
  },
];
