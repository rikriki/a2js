'use strict';
 
const gulp = require('gulp');
var sass = require('gulp-sass');
const tsc = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const tsconfig = require('tsconfig-glob');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const runSequence = require('gulp-run-sequence')
gulp.task('sass', function () {
  return gulp.src('./node_modules/bootstrap-sass/assets/stylesheets/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('clean', require('del').bind(null, ['riki','rikits','dist']));

gulp.task('sass:watch', function () {
  gulp.watch('./node_modules/bootstrap-sass/assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch('app/*.ts', ['ts']);
});



gulp.task('dev',function(cb){
  runSequence('clean','copy:libs','vendor','sass','ts',cb)
})

gulp.task('default',['clean','copy:libs','vendor','sass','ts'],function(){
  // gulp.start('build')
  console.log('done Building!')
})

gulp.task('build',['sass','jshint'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
})


// Compile TypeScript to JS
gulp.task('ts',  ()=> {
  return gulp
    .src(tscConfig.filesGlob)
    .pipe(sourcemaps.init())
    .pipe(tsc(tscConfig.compilerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'));
});
gulp.task('vendor',()=>{
  return gulp.src(['node_modules/lodash/lodash.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/three/build/three.js',
    'node_modules/socket.io-client/dist/socket.io.js'])
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest('dist/lib/js'))
})


// Copy dependencies
gulp.task('copy:libs', function() {
  // gulp.src(['node_modules/rxjs/**/*'])
  //   .pipe(gulp.dest('public/lib/js/rxjs'));

  // concatenate non-angular2 libs, shims & systemjs-config
  // gulp.src([
  //   'node_modules/jquery/dist/jquery.min.js',
  //   'node_modules/bootstrap/dist/js/bootstrap.min.js',
  //   'node_modules/es6-shim/es6-shim.min.js',
  //   'node_modules/es6-promise/dist/es6-promise.min.js',
  //   'node_modules/zone.js/dist/zone.js',
  //   'node_modules/reflect-metadata/Reflect.js',
  //   // 'node_modules/systemjs/dist/system-polyfills.js',
  //   'node_modules/systemjs/dist/system.src.js',
  //   'system.config.js',
  // ])
  //   .pipe(concat('vendors.min.js'))
  //   .pipe(uglify())
  //   .pipe(gulp.dest('public/lib/js'));

  // // copy source maps
  // gulp.src([
  //   'node_modules/es6-shim/es6-shim.map',
  //   'node_modules/reflect-metadata/Reflect.js.map',
  //   'node_modules/systemjs/dist/system-polyfills.js.map'
  // ]).pipe(gulp.dest('public/lib/js'));

  // gulp.src([
  //   'node_modules/bootstrap/dist/css/bootstrap.*'
  // ]).pipe(gulp.dest('public/lib/css'));
  gulp.src(['node_modules/socket.io-client/dist/*'])
      .pipe(gulp.dest('dist/lib/js/socket'))
  gulp.src(['node_modules/three/src/**/*'])
      .pipe(gulp.dest('dist/lib/js/three'))
  return gulp.src(['node_modules/rxjs/**/*'])
    .pipe(gulp.dest('dist/lib/js/rxjs'));
});


gulp.task('copy:assets', function() {
  return gulp.src(
    [
      '*.json',
      '*.html',
      '*.css',
      '!*.ts',
      '!*.scss'
    ],
    { base : 'src/**' })
    .pipe(gulp.dest('public/dist'))
});

// gulp.task('default', function () {
//     return gulp.src('src/**/*.ts')
//         .pipe(ts({
//             noImplicitAny: true,
//             // "module": "commonjs",
//             // "moduleResolution": "node",
//             // "sourceMap": true,
//             // "emitDecoratorMetadata": true,
//             "experimentalDecorators": false,
//             target: "es5",
//             out: 'output.js'

//         }))
//         .pipe(gulp.dest('built/local'));
// });


