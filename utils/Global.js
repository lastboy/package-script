/**
 * Global variable manager
 *
 * @type {module.exports}
 */
module.exports = function() {

    // Setting global environment
    global.pkgscript = {};


    return {


        set: function(key, value) {
            global.pkgscript[key] = value;
        },

        get: function(key) {
            return global.pkgscript[key];

        }

    }

}();