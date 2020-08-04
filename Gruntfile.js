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
                    }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-webfont');
};
