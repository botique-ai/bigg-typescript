import {dest, src} from "gulp";
import * as ts from "gulp-typescript";
import {CompilationStream, reporter as tsReporter} from "gulp-typescript";
import {log} from "gulp-util";
import * as sourcemaps from "gulp-sourcemaps";
import {createTsProject} from "../utils/createTsProject";
import {getCompilePaths} from "../utils/getCompilePaths";
import merge = require("merge2");

export function compile({
  tsProject = createTsProject(),
  compilePaths = getCompilePaths(),
  outputDir = '.',
  reporter = tsReporter.fullReporter(true)
}: {
  tsProject?: any;
  compilePaths?: Array<string>;
  outputDir?: string;
  reporter?: any;
}) {
  log('------------------------------------------');
  log('===> Starting typescript compilation...');
  log('------------------------------------------');
  const startTime = new Date();

  const tsResult: CompilationStream = src(compilePaths, { base: "." })
    .pipe(sourcemaps.init({
      identityMap: true
    }))
    .pipe(ts(tsProject, undefined, reporter));

  const jsFiles = tsResult.js
    .pipe(sourcemaps.write(outputDir))
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

  const dtsFiles = tsResult.dts.pipe(dest(outputDir));

  return merge([jsFiles, dtsFiles]) as any;

}