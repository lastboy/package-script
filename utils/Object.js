var typedas = require("typedas");

module.exports = function () {

    return {

        /**
         * Copy the source object's properties.
         * TODO TBD make it more robust, recursion and function support
         * TODO move to a common module
         *
         * @param srcobj The source object
         * @param destobj The destination object
         * @param override Override existing property [false as default]
         */
        copy: function (srcobj, destobj, override) {

            var name, obj,
                me = this,
                idx = 0, size = 0, item;

            override = (override || false);

            if (srcobj && destobj) {
                for (name in srcobj) {

                    if (srcobj.hasOwnProperty(name)) {

                        obj = destobj[name];

                        if (typedas.isObject(srcobj[name])) {
                            if (!destobj[name]) {
                                destobj[name] = {};
                            }
                            arguments.callee.call(me, srcobj[name], destobj[name], override);

                        } else if (typedas.isArray(srcobj[name])) {

                            if (!obj) {
                                destobj[name] = srcobj[name];

                            } else if (typedas.isArray(obj)) {

                                me.cleanupArray(srcobj[name]);
                                if (override) {
                                    destobj[name] = srcobj[name];

                                } else {
                                    size = destobj[name].length;
                                    for (idx = 0; idx < size; idx++) {
                                        item = obj[idx];
                                        srcobj[name] = me.removeArrayItemByValue(srcobj[name], item);
                                    }
                                    destobj[name] = destobj[name].concat(srcobj[name]);
                                }
                            } else {
                                _log.warning(_props.get("cat.utils.copy.object.array.warn").format("[utils copy object]", name, typeof(obj)));
                            }

                        } else {
                            if (override || obj === undefined) {
                                if (!destobj[name] || (destobj[name] && override)) {
                                    destobj[name] = srcobj[name];
                                }
                            }
                        }

                    }
                }
            }
        }

    };
}();

