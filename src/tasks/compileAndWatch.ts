import {log} from "gulp-util";
import {watch, series} from "gulp";
import {compile} from "./compile";
import {createTsProject} from "../utils/createTsProject";
import {getCompilePaths} from "../utils/getCompilePaths";

export function compileAndWatch(options) {
  const boundCompile = compile.bind(Object.assign({
    tsProject: createTsProject()
  }, options));

  return series(boundCompile, () => {
    watch(getCompilePaths(options.compilePaths), {interval: 1000, usePolling: true}, boundCompile)
      .on('change', () => {
        log('=== Source change detected. Recompiling...');
      });
  })();
}