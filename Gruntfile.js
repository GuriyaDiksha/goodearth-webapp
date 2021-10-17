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
                    relativeFontPath: "../fonts",
                    template: 'fontTemplate.css',
                    templateOptions: {
                        baseClass: "icon",
	                    classPrefix: "icon_"
                    },
                    types: 'eot,woff2,woff,ttf',
                    order: 'woff2,woff,ttf,eot'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-webfont');
};
