const defaultConfig = require("./default.json");

let conf = {...defaultConfig};

try {
    const envConfig = require("./enviroment.json");
    conf = {
        ...conf,
        ...envConfig
    }
} catch (e){}


module.exports = conf;
