'use strict';

module.exports = function (gulp) {
  const path = require('path');
  const install = require('gulp-install');
  const ts = require('gulp-typescript');
  const merge = require('merge2');
  const nodemon = require('gulp-nodemon');
  const http = require('http');
  const gulpFilter = require('gulp-filter');
  const mocha = require('gulp-mocha');
  const sourcemaps = require('gulp-sourcemaps');
  const jeditor = require("gulp-json-editor");

  const tsProject = ts.createProject(path.join(__dirname, 'tsconfig.json'), {
    typescript: require('typescript')
  });

  gulp.task('install', () => {
    return gulp.src('package.json')
      .pipe(jeditor((json) => {
        if (json.dependencies) {
          json.dependencies['source-map-support'] = '0.4.0';
        }

        else {
          json.dependencies = {'source-map-support': '0.4.0'};
        }
        return json;
      }))
      .pipe(gulp.dest('.'))
      .pipe(install({
        args: '--progress=false'
      }));
  });

  gulp.task('compile', () => {
    const tsResult = gulp.src([
      'src/**/*.ts',
      'node_modules/angular2/typings/browser.d.ts',
      'typings/**/*.d.ts'
    ])
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
      tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
    ]);
  });

  gulp.task('test', ['compile'], () => {
    return gulp.src('./dist/js/**/*')
      .pipe(gulpFilter(['**/*.spec.js']))
      .pipe(mocha())
      .pipe(gulp.dest('../.build/coverage/reports'));
  });

  gulp.task('run-server', ['compile', 'install'], () => {
    gulp.watch(['src/**/*'], ['compile']);
    nodemon({
      script: 'dist/js/index.js',
      watch: 'dist/js',
      delay: 10,
      ext: 'js',
      env: {'NODE_ENV': 'development'}
    });
  });

  gulp.task('default', ['run-server']);
};