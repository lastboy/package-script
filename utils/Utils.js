var os = require('os'),
    fs = require("fs"),
    date = require("date-format-lite");

module.exports = function () {

    return {

        now: function() {
            return ((new Date()).format("YYYY-MM-DD hh:mm:ss.S"));
        },

        /**
         * Check if the current OS is Linux
         *
         * @returns {boolean} in case running OS is linux return true else false
         */
        isLinux: function () {
            return (os.platform() == "linux");
        },

        /**
         * Print the given data to a file
         *
         * @param data The data to be write
         */
        log2file: function (data) {
            try {
                fs.appendFileSync("pkgscript.log", (this.now() + "  " + data + "\n"), "utf8");

            } catch (e) {
                console.error(this.now + " [package-script] Package Script, ERROR:", e);
            }
        },

        /**
         * Log a message to the console and to a file.
         *
         * @param msg
         */
        logall: function (msg) {

            if (msg) {
                console.log(this.now() + " " + msg);
                this.log2file(msg);
            }
        }


    };

}();