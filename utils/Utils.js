var os = require('os'),
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
        }

    };

}();