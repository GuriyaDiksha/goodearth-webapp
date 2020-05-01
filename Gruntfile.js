module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        webfont: {
            icons: {
                src: 'src/icons/*.svg',
                dest: 'src/fonts/',
                destScss: "src/styles/",
                options: {
                    font: "goodearth",
                    fontFilename: 'goodearth',
                    stylesheet: "scss",
                    relativeFontPath: "../fonts"
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-webfont');
};
