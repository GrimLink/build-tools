module.exports = {
    plugins: [
        require("stylelint")({
            code: "src/**/*.scss",
            reporters: [
                {
                    formatter: "string",
                    save: "reports/csslint.txt",
                    console: true
                }
            ]
        }),
        require("postcss-preset-env")({
            stage: 2,
            features: { "custom-properties": false }
        }),
        require("cssnano")({
            preset: ["default", { colormin: false, calc: false }]
        })
    ]
};
