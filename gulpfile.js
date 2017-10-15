const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cache = require('gulp-cache');
const cssnano = require('gulp-csso');
const del = require('del');
const gif = require('gulp-if');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const inlineSource = require('gulp-inline-source');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const runSequence = require('run-sequence');
const reload = browserSync.reload;
const wiredep = require('wiredep').stream;

gulp.task('sass', () => {
  return gulp.src('src/sass/*.sass')
    .pipe(plumber())
    .pipe(sass.sync({
      precision: 10,
      includePaths: ['.'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions', '> 1%', 'Firefox ESR'
      ]
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(reload({stream: true}));
});

gulp.task('js', () => {
  return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('assets/js'))
    .pipe(reload({stream: true}));
});

gulp.task('html', () => {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(useref({searchPath: ['.']}))
    .pipe(gif(/\.css$/, cssnano({safe: true, autoprefixer: false})))
    .pipe(gif(/\.js$/, uglify({compress: {drop_console: true}})))
    .pipe(gif(/\.html$/, htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest(''));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('assets/img'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', () => {})
    .concat('src/fonts/**/*'))
    .pipe(gulp.dest('assets/fonts'));
});

gulp.task('inlineSource', () => {
  return gulp.src('*.html')
    .pipe(inlineSource())
    .pipe(gulp.dest(''));
});

gulp.task('copy', () => {
  return gulp.src('kr.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('kr'));
});

gulp.task('delete', del.bind(null, 'kr.html'));

gulp.task('wiredep', () => {
  gulp.src('src/sass/*.sass')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('src/sass'));

  gulp.src('src/**/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest(''));
});

gulp.task('clean', del.bind(null, ['assets', 'kr']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['images', 'sass', 'js', 'fonts'], () => {
    browserSync.init({
      notify: false,
      server: {
        baseDir: ['.'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'src/**/*.html'
    ]).on('change', reload);

    gulp.watch('src/sass/*.sass', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/images/**/*', ['images']);
    gulp.watch('src/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('build', ['images', 'fonts'], () => {
  return gulp.src(['assets/**/*', '**/*.html']).pipe(size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    runSequence(['clean', 'wiredep'], ['sass', 'js'], ['html'], ['inlineSource'], ['build'], ['copy'], ['delete'], resolve);
  });
});