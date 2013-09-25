var _utils = require("./Utils.js"),
    _global = require("./Global.js"),
    _fs = require("fs");

module.exports = function() {

    var _stub = function(){};

    function isLog() {
        return _global.get("log");
    }

    return {

        console: (isLog() ? console : {log: _stub, error: _stub, warn: _stub} ),

        /**
         * Print the given data to a file
         *
         * @param data The data to be write
         */
        log2file: function (data) {

            if (!isLog()) {
                return undefined;
            }

            try {
                _fs.appendFileSync("pkgscript.log", (_utils.now() + "  " + data + "\n"), "utf8");

            } catch (e) {
                console.error(_utils.now + " [package-script] Package Script, ERROR:", e);
            }
        },

        /**
         * Log a message to the console and to a file.
         *
         * @param msg
         */
        logall: function (msg) {

            if (!isLog()) {
                return undefined;
            }

            if (msg) {
                console.log(_utils.now() + " " + msg);
                this.log2file(msg);
            }
        }

    };

}();