'use strict';

import gulp from 'gulp';
import del from 'del';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import inlineSource from 'gulp-inline-source';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import webpack from 'webpack-stream';

sass.compiler = require('node-sass');

const folder = {
  src: 'src/',
  dist: 'dist/',
  public: 'public/',
};

const paths = {
  styles: {
    src: folder.src + 'sass/**/*.sass',
    dest: folder.dist + 'css/',
  },
  scripts: {
    src: folder.src + 'js/**/*.js',
    dest: folder.dist + 'js/',
  },
  templates: {
    watch: folder.src + 'pug/**/**/*.pug',
    src: folder.src + 'pug/**/[^_]*.pug',
    dest: folder.dist,
  },
  fonts: {
    src: folder.src + 'fonts/**/*',
    dest: folder.dist + 'fonts/',
  },
  images: {
    src: folder.src + 'images/**/*',
    dest: folder.dist + 'images/',
  },
};

export const styles = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      sass
        .sync()
        .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
};

export const scripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
};

export const templates = () => {
  return gulp
    .src(paths.templates.src)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(paths.templates.dest))
    .pipe(browserSync.stream());
};

export const images = () => {
  return gulp
    .src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
};

export const fonts = () => {
  return gulp
    .src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
};

export const copy = () => {
  return gulp
    .src(folder.public + '**/*')
    .pipe(gulp.dest(folder.dist));
};

export const inline = () => {
  return gulp
    .src(paths.templates.dest + '**/*.html')
    .pipe(inlineSource())
    .pipe(gulp.dest(paths.templates.dest));
};

export const watch = () => {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.templates.watch, templates);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
};

export const serve = () => {
  return browserSync.init({
    server: {
      baseDir: './dist',
    },
    notify: false,
    open: false,
  });
};

export const clean = () => del([folder.dist]);

const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, templates),
  gulp.parallel(images, fonts),
  inline,
  copy
);

const defaultTask = gulp.parallel(
  gulp.parallel(styles, scripts, templates),
  gulp.parallel(images, fonts),
  serve,
  watch
);

gulp.task('build', build);
gulp.task('default', defaultTask);
export default defaultTask;
