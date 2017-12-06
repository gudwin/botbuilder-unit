const gulp = require('gulp');
const tap = require('gulp-tap');
const watch = require('gulp-watch');
const cover = require('gulp-coverage');
const babel = require("gulp-babel");
const jasmineNode = require('gulp-JASMINE');
const fork = require('child_process').fork;

gulp.task("transpile.index", function () {
  return gulp.src("botbuilder-unit.js")
    .pipe(babel())
    .pipe(gulp.dest("./build/transpiled/"));
});
gulp.task("transpile.src", function () {
  return gulp.src("src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./build/transpiled/src/"));
});
gulp.task('transpile', ['transpile.index', 'transpile.src']);

gulp.task('cover', function () {
  process.env.BOTBUILDERUNIT_USE_INSTRUMENTED_SOURCE = './build/transpiled/src';
  return gulp.src(['./spec/*Spec.js'])
    .pipe(cover.instrument({
      pattern: ['build/transpiled/**/*.js'],
      debugDirectory: 'build/instrumented/'
    }))
    .pipe(jasmineNode())
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('build/report'));
});

gulp.task('tests', function () {
  let ls = null;
  let runTests = () => {
    process.env.BOTBUILDERUNIT_USE_INSTRUMENTED_SOURCE = './src';
    if (ls) {
      ls.kill();
      ls = null;
    }
    let command = `${process.env['PWD']}/testRunner.js`;
    let options = {
      cwd: process.env.PWD + '/',
      env: process.env,
      silent: false
    };
    ls = fork(command, options);
  }
  runTests();
  //Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
  return watch(['src/**/*.js', 'spec/**/*.js', 'botbuilder-unit.js', 'config/**/*.json'], function () {
    runTests();
  });
});

