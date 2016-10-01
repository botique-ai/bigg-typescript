import {join} from "path";
import {createProject} from "gulp-typescript";

export function createTsProject(overrideDefaultOptions?) {
  return createProject(join(__dirname, '../../assets/compile-tsconfig.json'), Object.assign({
    typescript: require('typescript')
  }, overrideDefaultOptions)) as any;
}