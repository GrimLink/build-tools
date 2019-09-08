module.exports = grunt => {
    require("load-grunt-tasks")(grunt); // Loads all grunt pkg's

    // Get configs
    const pkg = grunt.file.readJSON("package.json");
    const webpackConfig = require("./webpack.config");

    // Set Sass builder
    const Fiber = require("fibers");
    const sass = require("sass"); // sass = dart | node-sass for node

    // Build config
    const config = {
        index: "index.html",
        proxy: "gulp.test",
        clean: ["build/css", "build/js", "build/fonts"],
        styles: {
            src: "src",
            dest: "build/css",
            watch: "src/**/*.scss"
        },
        scripts: { watch: "src/**/*.js" },
        fonts: {
            src: "src/fonts/**",
            dest: "build/fonts"
        },
        media: {
            src: "src/media/**",
            dest: "build/media"
        },
        watch: ["index.html", "src/**/*.scss", "src/**/*.js"]
    };

    grunt.initConfig({
        // Load vars
        pkg: pkg,
        config: config,
        // Styles
        sass: {
            options: {
                implementation: sass,
                fiber: Fiber,
                includePaths: ["node_modules"],
                sourceMap: true,
                outputStyle: "expanded"
            },
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: "<%= config.styles.src %>",
                        src: "*.scss",
                        dest: "<%= config.styles.dest %>",
                        ext: ".css"
                    }
                ]
            }
        },
        postcss: {
            options: {
                processors: [
                    require("postcss-preset-env")({
                        stage: 2,
                        features: { "custom-properties": false }
                    })
                ]
            },
            dev: {
                options: { map: { inline: false } },
                src: ["<%= config.styles.dest %>/*.css"]
            },
            build: {
                options: {
                    processors: [
                        require("cssnano")({
                            preset: [
                                "default",
                                { colormin: false, calc: false }
                            ]
                        })
                    ]
                },
                src: ["<%= config.styles.dest %>/*.css"]
            }
        },
        stylelint: { report: ["<%= config.styles.src %>/*.scss"] },
        // Scripts
        webpack: {
            options: {
                stats:
                    process.env.NODE_ENV === "development" ||
                    !process.env.NODE_ENV
            },
            build: webpackConfig
        },
        // Files
        copy: {
            fonts: {
                expand: true,
                flatten: true,
                filter: "isFile",
                cwd: "<%= config.fonts.src %>",
                src: "*.{woff,woff2,otf,ttf}",
                dest: "<%= config.fonts.dist %>"
            },
            media: {
                expand: true,
                flatten: true,
                filter: "isFile",
                cwd: "<%= config.media.src %>",
                src: "*.{png,jpg,jpeg,svg,webp}",
                dest: "<%= config.media.dist %>"
            }
        },
        clean: { dist: "<%= config.clean %>" },
        // Local dev env
        browserSync: {
            bsFiles: {
                src: [
                    "<%= config.index %>",
                    "<%= config.styles.watch %>",
                    "<%= config.scripts.watch %>"
                ]
            },
            options: {
                watchTask: true,
                open: false,
                proxy: "<%= config.proxy %>"
            }
        },
        watch: {
            styles: {
                files: ["<%= config.styles.watch %>"],
                tasks: ["stylelint", "sass", "postcss:dev"]
            },
            scripts: {
                files: ["<%= config.scripts.watch %>"],
                tasks: ["webpack"]
            }
        }
    });

    grunt.registerTask("styles", ["sass", "postcss:build"]);
    grunt.registerTask("scripts", ["webpack"]);

    grunt.registerTask("dev", ["browserSync", "watch"]);
    grunt.registerTask("build", ["clean", "styles", "scripts"]);
    grunt.registerTask("default", ["build"]);
};
