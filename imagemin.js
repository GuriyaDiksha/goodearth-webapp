const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const fs = require("fs");
const path = require("path");
const rootSource = "src/images";
// const rootDest = "src/images2";


async function convert(source) {
    const files = imagemin([`${source}/*.{jpg,png}`], {
        destination: source,
        plugins: [
            imageminJpegtran({progressive: true}),
            imageminOptipng({interlaced: true})
        ]
    }).catch((err) => {
        console.log(err);
    });
    // console.log(files);
    const innerFiles = fs.readdirSync(source).map(file => path.join(source, file));
    const innerFolders = innerFiles.filter(file => fs.lstatSync(file).isDirectory());
    // console.log(innerFolders);
    if(innerFolders.length > 0) {
        innerFolders.map(innerFolder => convert(innerFolder));
    }
}

(async () => {
    convert(rootSource);
})();