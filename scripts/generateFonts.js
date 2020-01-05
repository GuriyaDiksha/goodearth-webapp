const path = require("path");
const fs = require("fs");
const webfont = require("webfont").default;

const fontDir = path.resolve(__dirname, `../src/fonts`);
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir);
}
webfont({
  files: "src/icons/*.svg",
  fontName: "goodearth",
  templateClassName: "icon",
  templateFontPath: "../fonts",
  template: path.resolve(__dirname, "fontTemplate/scss.njk")
})
  .then(result => {
    let formats = result.config.formats;
    formats.map(extension => {
      let buffer = result[extension];
      fs.writeFileSync(
        path.resolve(__dirname, `../src/fonts/goodearth.${extension}`),
        buffer
      );
    });

    fs.writeFileSync(
      path.resolve(__dirname, `../src/styles/iconFonts.scss`),
      Buffer.from(result.template)
    );

    return result;
  })
  .catch(error => {
    throw error;
  });
