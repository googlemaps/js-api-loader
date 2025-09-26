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
    tsconfig: "./tsconfig.build.json",
    declaration: true,
    declarationDir: "dist/types",
  }),
  nodeResolve({
    mainFields: ["browser", "jsnext:main", "module", "main"],
  }),
  commonjs(),
  babel({
    extensions: [".js", ".ts"],
    babelHelpers: "bundled",
  }),
];

export default [
  // UMD and browser (iife) builds
  {
    input: "src/index.ts",
    plugins: [
      ...basePlugins,
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
    plugins: [
      typescript({
        tsconfig: "./tsconfig.build.json",
        declaration: false,
      }),
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          __DEV__: 'process.env.NODE_ENV !== "production"',
        },
      }),
    ],
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
      exports: "named",
    },
  },
  // types
  {
    input: "./dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
