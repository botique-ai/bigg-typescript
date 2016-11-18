import {join} from "path";
import {createProject} from "gulp-typescript";

export function createTsProject(overrideDefaultOptions?) {
  return createProject(join(__dirname, '../../assets/compile-tsconfig.json'), Object.assign({
    isolatedModules: true,
    noResolve: true
  }, overrideDefaultOptions)) as any;
}

export function createTsProjectFromOptions({
  tsProjectOptions = {},
  declarations = false
}) {
  return createTsProject(Object.assign(
    tsProjectOptions,
    declarations ? {
      declaration: true
    } : {
      declaration: false
    }
  ));
}