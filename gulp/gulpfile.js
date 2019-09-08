const { src, dest, lastRun, watch, series, parallel } = require("gulp");
const del = require("del");

const Fiber = require("fibers");
const sass = require("gulp-sass");
sass.compiler = require("sass");

const postcss = require("gulp-postcss");
const postcssPresetEnv = require("postcss-preset-env");
const cssnano = require("cssnano");
const stylelint = require("gulp-stylelint");

const webpack = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");

const browserSync = require("browser-sync").create();

// Config
const config = {
    baseDir: "build",
    index: "index.html",
    proxy: null,
    clean: ["build/css", "build/js", "build/fonts"],
    styles: {
        src: "src/main.scss",
        postSrc: "build/css/main.css",
        dest: "build/css",
        watch: "src/**/*.scss",
        env: {
            stage: 3,
            features: { "custom-properties": false }
        },
        nano: {
            preset: ["default", { colormin: false, calc: false }]
        },
        lint: {
            reporters: [
                {
                    formatter: "string",
                    save: "reports/csslint.txt",
                    console: true
                }
            ]
        }
    },
    scripts: {
        src: "src/index.js",
        dest: "build/js",
        watch: "src/**/*.js"
    },
    media: {
        src: "src/media/**/*.{png,jpg,jpeg,svg,webp}",
        dest: "build/fonts"
    },
    fonts: {
        src: "src/fonts/**/*.{woff,woff2,otf,ttf}",
        dest: "build/fonts"
    }
};

// Tasks
const styles = () => {
    return src(config.styles.src, { sourcemaps: true })
        .pipe(
            sass({
                fiber: Fiber,
                includePaths: ["node_modules"]
            }).on("error", sass.logError)
        )
        .pipe(postcss([postcssPresetEnv(config.styles.env)]))
        .pipe(dest(config.styles.dest, { sourcemaps: "." }));
};

const cssmin = () => {
    return src(config.styles.postSrc)
        .pipe(
            postcss([
                postcssPresetEnv(config.styles.env),
                cssnano(config.styles.nano)
            ])
        )
        .pipe(dest(config.styles.dest));
};

const csslint = () => {
    return src(config.styles.watch, { since: lastRun(csslint) }).pipe(
        stylelint(config.styles.lint)
    );
};

const scripts = () => {
    return src(config.scripts.src)
        .pipe(webpack(webpackConfig))
        .pipe(dest(config.scripts.dest));
};

function reload(done) {
    browserSync.reload();
    done();
}

function serve(done) {
    if (config.proxy) {
        browserSync.init({ proxy: config.proxy });
    } else {
        browserSync.init({
            server: { baseDir: config.baseDir, index: config.index }
        });
    }
    done();
}

function watcher() {
    watch(config.index, reload);
    watch(config.styles.watch, series(csslint, styles, reload));
    watch(config.scripts.watch, series(scripts, reload));
}

const fonts = done => {
    if (config.fonts.src === "") return done();
    return src(config.fonts.src, { since: lastRun(fonts) }).pipe(
        dest(config.fonts.dest)
    );
};

const media = done => {
    if (config.media.src === "") return done();
    return src(config.media.src, { since: lastRun(media) }).pipe(
        dest(config.media.dest)
    );
};

const clean = done => {
    if (config.clean === "") return done();
    return del(config.clean);
};

// Tasks
exports.css = series(styles, cssmin);
exports.js = parallel(scripts);
exports.copy = parallel(fonts, media);
exports.clean = clean;

exports.dev = series(serve, watcher);
exports.build = series(clean, parallel(fonts, media, styles, scripts), cssmin);
exports.default = exports.build;
