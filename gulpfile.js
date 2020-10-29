const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const cleaner = require('gulp-clean');
const concat = require('gulp-concat');
const cp = require('child_process');
const fs = require('fs');
const plumber = require('gulp-plumber');
const request = require('request');
const runSequence = require('run-sequence').use(gulp);
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');  


function clean() {
  return gulp.src(['_site', '.tmp'], {read: false, allowEmpty: true})
    .pipe(cleaner());
}
exports.clean = clean;


function copyAssets() {
  /* copy from the .tmp to _site directory. */
  /* to reduce build times the assets are compiles at the same time as jekyll */
  /* renders the site. Once the rendering has finished the assets are copied. */
  return gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('_site/assets'));
}
exports.copyAssets = copyAssets;


function styles() { 
  const sassInput = 'app/assets/styles/*.scss';
  const sassOptions = {
    includePaths: ['node_modules/bootstrap/scss','node_modules/@fortawesome/fontawesome-free/scss'],
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  return gulp.src(sassInput)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('.tmp/assets/styles'));
}
exports.styles = styles;


function fontawesome() {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/**.*')
    .pipe(gulp.dest('.tmp/assets/fonts'));
}
exports.fontawesome = fontawesome;

function javascripts() {
  const javascriptPaths = [
    // the order of these matter
    "node_modules/jquery/dist/jquery.js",
    "node_modules/popper.js/dist/umd/popper.js",
    "node_modules/@fortawesome/fontawesome-free/js/all.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.js",
    "node_modules/d3/d3.min.js"
  ]
  /* https://github.com/Foundation-for-Jekyll-sites/jekyll-foundation/blob/master/gulp/tasks/javascript.js */
  return gulp.src(javascriptPaths)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('.tmp/assets/js'))  
}
exports.javascripts = javascripts;


/* Build the jekyll website. */
function jekyll(done) {
  const args = ['exec', 'jekyll', 'build'];

  switch (environment) {
    case 'development':
      args.push('--config=_config.yml,_config-dev.yml','--trace');
    break;
    case 'production':
      args.push('--config=_config.yml');
    break;
  }
  return cp.spawn('bundle', args, {stdio: 'inherit'})
    .on('close', done);
}
exports.jekyll = jekyll;


/* different build options */
/* ======================= */

function watching() {
  function browserReload(cb) { browserSync.reload(); cb(); }
  browserSync({
    server: '_site'
  });
  gulp.watch(['./app', './_config*'], gulp.series(
    jekyll, 
    gulp.parallel(styles, javascripts), 
    copyAssets, 
    browserReload));   
}
exports.serve = gulp.series(
  clean,
  jekyll, 
  gulp.parallel(styles, javascripts, fontawesome), 
  copyAssets, 
  watching);

var environment = 'development';
function setProd(cb) { environment = 'production'; cb(); }
exports.prod = gulp.series(clean, setProd, jekyll, gulp.parallel(styles, javascripts, fontawesome), copyAssets);
