var blacklist = require("metro/src/blacklist");

var config = {
    getBlacklistRE() {
        return blacklist([
            /forExpo\/.*/,
            /ios\/.*/,
        ])
    }
}

module.exports = config;
