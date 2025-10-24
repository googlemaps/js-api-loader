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
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

const terserOptions = {
  output: { comments: "some" },
};

const basePlugins = [
  typescript({
    declaration: false,
    tsconfig: "./tsconfig.build.json",
  }),
  nodeResolve(),
  commonjs(),
];

export default [
  // CJS/UMD build
  {
    input: "src/index.ts",
    plugins: [
      ...basePlugins,
      babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
      }),
      replace({
        preventAssignment: true,
        values: {
          __DEV__: false,
        },
      }),
    ],
    output: [
      {
        file: "dist/index.cjs",
        format: "umd",
        name: "jsApiLoader",
        sourcemap: true,
        plugins: [terser(terserOptions)],
        exports: "named",
      },
    ],
  },

  // ESM build
  {
    input: "src/index.ts",
    plugins: [...basePlugins],
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
  },

  // types
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
