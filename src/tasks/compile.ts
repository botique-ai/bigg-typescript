import {dest, src} from "gulp";
import {reporter as tsReporter} from "gulp-typescript";
import {log} from "gulp-util";
import * as sourcemaps from "gulp-sourcemaps";
import {createTsProjectFromOptions} from "../utils/createTsProject";
import {getCompilePaths} from "../utils/getCompilePaths";
import {join} from "path";
import merge = require("merge2");

export function compile({
  declarations = false,
  tsProjectOptions = {},
  tsProject,
  compilePaths = getCompilePaths(),
  outputDir = '.',
  definitionsDir = 'definitions',
  reporter = tsReporter.fullReporter(true)
}: {
  declarations?: boolean;
  tsProjectOptions?: any;
  tsProject?: any,
  compilePaths?: Array<string>;
  outputDir?: string;
  definitionsDir?: string;
  reporter?: any;
}) {
  log('------------------------------------------');
  log('===> Starting typescript compilation...');
  log('------------------------------------------');
  const startTime = new Date();
  const tsProjectToUse = tsProject || createTsProjectFromOptions({
      tsProjectOptions,
      declarations
    });

  const tsResult = src(compilePaths, {base: "."})
    .pipe(sourcemaps.init())
    .pipe(tsProjectToUse(reporter) as any);

  const jsFiles = tsResult.js
    .pipe(sourcemaps.write())
    .pipe(dest(outputDir))
    .on('error', (err) => {
      log('------------------------------------------');
      log('<=== Failed to compile sources. ' + err.stack);
      log('------------------------------------------');
    })
    .on('end', () => {
      const compilationTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000 * 100) / 100;

      log('------------------------------------------');
      log(`<=== Typescript source compiling finished in ${compilationTime} sec.`);
      log('------------------------------------------');
    });

  const dtsFiles = tsResult.dts.pipe(
    dest(join(outputDir, definitionsDir))
  );

  return merge([jsFiles, dtsFiles]) as any;
}