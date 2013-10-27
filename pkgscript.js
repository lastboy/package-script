/*
 *  Package Script Module
 *
 */

"use strict";

var logger = require("./utils/Logger.js"),
    globalutils = require("./utils/Global.js"),
    utils = require("./utils/Utils.js"),
    typedas = require('typedas'),
    isLinux = utils.isLinux(),
    spawn,
    sudoopt = {
        cachePassword: true,
        prompt: 'Additional global npm(s) about to be installed, set your root password: ',
        spawnOptions: { /* other options for spawn */ }
    },
    cprocess,
    commands = [],
    next= 0, size,
    cparg = require('child_process'),
    sudoarg = require('sudo'),
    jsutils = require("js.utils");



/**
 * The default system value for the admin user is true
 *
 * @returns {boolean} The default admin value
 */
function getDefaultAdmin() {
    return true;
}

function getDefaultInit() {
    return {
        log: true
    };
}

/**
 * Set the current spawn object.
 * Can be sudo for getting the admin prompt or child_process
 *
 * @param admin
 */
function setSpawnObject(admin) {
    admin = ((admin === undefined) ? getDefaultAdmin() : admin);
    if (isLinux && admin) {
        spawn = sudoarg;
    } else {
        spawn =  cparg.spawn;
    }
    return admin;
}


/**
 * Initialization functionality
 */
function init() {
    var log = "Package Script installer Initialized ....";
    logger.logall(log);

    setSpawnObject();
}

/**
 * Run a single spawn operation according to the given configuration
 *
 * @param items The passed configuration items
 * @param callback The functionality to be called on complete
 */
function install(items, callback) {

    var item = items[next],
        command = item.command,
        args = item.args,
        admin = item.admin,
        spawnopt = (item.spawnopt || {}),
        print;


    // set the spawn object according to the passed admin argument
    admin = setSpawnObject(admin);

    // run the command
    if (isLinux) {
        if (admin) {
            // use sudo
            args.unshift(command);
            print = args.join(" ");
            logger.console.log("[package-script] Running Installer command: " + print);

            sudoopt.spawnOptions = {};
            jsutils.Object.copy(spawnopt, sudoopt.spawnOptions);
            cprocess = spawn(args, sudoopt);
        } else {
            //use child_process
            print = args.join(" ");
            logger.console.log("[package-script] Running Installer command: " + command + " " + print);
            cprocess = spawn(command, args, spawnopt);
        }
    } else {
        args.unshift(command);
        args.unshift("/c");
        command = "cmd";
        print = [command, args.join(" ")].join(" ");
        logger.console.log("[package-script] Running Installer command: " + print);
        cprocess = spawn(command, args, spawnopt);

    }

    // -- Spawn Listeners
    cprocess.stdout.on('data', function (data) {
        var log = 'CAT Installer: ' + data;
        logger.logall(log);
    });

    cprocess.stderr.on('data', function (data) {
        if (data && (new String(data)).indexOf("npm ERR") != -1) {
            logger.logall('Package Script : ' + data);
        } else {
            logger.log2file('Package Script : ' + data);
        }
    });

    cprocess.on('close', function (code) {
        logger.log2file('Package Script Complete ' + code);
        next++;
        if (next < size) {
            install(items, callback);

        } else {
            // callback
            if (callback && typedas.isFunction(callback)) {
                callback.call(this, code);

            }
        }
    });
}

function initialize(config) {

    var defaults = getDefaultInit(),
        key;

    if (config) {

        for (key in defaults) {
            globalutils.set(key, ( (key in config) ? config[key] :  defaults[key] ));
            if (jsutils) {
                jsutils.init(config);
            }
        }
    }
}

// Initialization
(function() {
    init();
    initialize({});
})();


function _packageProcess(config, callback) {
    var configval = [],
        names = [],
        baseobj = {
            command: "npm",
            args: [config.action]
        },
        isinstalled = config.isinstalled,
        spawnconfig = config.config,
        isglobal = config.global,
        isDebug = ('debug' in config ? (config.debug || 0) : 0),
        depth = ('depth' in config ? (config.depth || "10") : "10"),
        entry;

    if (spawnconfig && typedas.isArray(spawnconfig)) {

        spawnconfig.forEach(function(item) {
            if (item) {
                entry = {args:[]};
                jsutils.Object.copy(baseobj, entry);
                if (isglobal) {
                    entry.args.push("-g");
                }
                if (item.args) {
                    entry.args = entry.args.concat(item.args);
                }
                if (item.name) {
                    entry.args.push(item.name);
                    entry.name = item.name;
                    names.push (item.name);
                } else {
                    logger.console.error("[package-script install] 'name' is require parameter");
                }

                entry.admin = (('admin' in item) ? item.admin : undefined);
                entry.spawnopt = (('spawnopt' in item) ? item.spawnopt : undefined);
                configval.push(entry);
            }
        });


    } else {
        logger.logall("[package-script] No valid configuration for 'install' function, see the docs for more information ");
    }

    jsutils.NPM.installed({global: isglobal, list: names, depth:depth, debug:isDebug}, function() {

        var data  = this.data,
            newarr = [];
        if (data) {
            configval.forEach(function(item){
                if (item) {
                    if (item.name) {
                        if (!isinstalled) {
                            if (!data[item.name]) {
                                newarr.push(item);
                            }
                        } else {
                            if (data[item.name]) {
                                newarr.push(item);
                            }
                        }
                    }
                }
            });
        }

        if (callback) {
            callback.call({data: newarr});
        }
    });
}

/**
 * Executing multiple calls synchronously according to a given configuration
 *
 * @type {module.exports}
 */
module.exports = function() {

    return {

        /**
         * Initialization Settings
         *
         * @param config The initialization configuration
         * e.g. {
         *      log: false
         * }
         */
        init: function(config) {
            return initialize(config)
        },

        /**
         * spawn additional command according to the config
         *
         * @param config The configuration for the spawn
         * e.g. [{
         *          admin: true, [optional (for now, linux support only)],
         *          spawnopt: {cwd: '.'} [optional] (see child_process spawn docs)
         *          command: 'npm',
         *          args: ["--version"]
         *      }]
         *
         * @param init The initial configuration, can be set in separate method (see 'init')
         * @param callback The callback functionality
         */
        spawn: function(config, init, callback) {

            var me = this;

            // first initialize
            if (init) {
                this.init(init);
            }

            logger.log2file("\n\n************ Package Script  ************************************* process id: " + process.pid);

            if (config && typedas.isArray(config)) {
                commands = commands.concat(config);
                size = commands.length;
                if (size > 0) {
                    install(commands, function() {
                        logger.logall("[package-script] process completed, see pkgscript.log for more information");
                        if (callback) {
                            callback.call(me);
                        }
                    });
                }

            } else {
                logger.logall("[package-script] No valid configuration for 'install' function, see the docs for more information ");
            }
        },

        // TODO unify to generic - the configuration passed to the install/uninstall

        /**
         * Install packages
         *
         * @param config {Array} The configuration for the install
         *      name        {String}    The package name
         *      admin       {Boolean}   Get admin prompt (default to true)
         *      spawnopt    {Object}    {cwd: '.'} [optional] (see child_process spawn docs)
         *
         * e.g. [{
         *          admin: false,
         *          name: "test"
         *      }]
         *
         * @param opt The optional configuration
         *      init The initial settings
         *          global  {Boolean} specify if the given packages are global or not
         *          log     {Boolean} specify if to set the log to off or on optional values [true/false]
         *
         *      callback The callback functionality
         */
        install: function(config, opt) {

            var me = this,
                configvar = {},
                callback,
                init;

            if (opt) {
                init = (opt.init || undefined);
                callback = (opt.callback || undefined);
            } else {
                opt = {};
            }

            configvar.action = "install";
            configvar.isinstalled = false;
            configvar.config = config,
            configvar.global = ((init && 'global' in init) ? init.global : false);
            configvar.debug = opt.debug;
            configvar.depth = opt.depth;

            if (init) {
                this.init(init);
            }

            _packageProcess(configvar, function() {
                if (this.data && typedas.isArray(this.data) && this.data.length > 0) {
                    me.spawn(this.data, init, function(){
                        if (callback) {
                            callback.call(me);
                        }
                    });
                } else {
                    if (callback) {
                        callback.call(me);
                    }

                }
            });
        },

        /**
         * UnInstall packages
         *
         * @param config {Array} The configuration for the uninstall
         *      name        {String}    The package name
         *      admin       {Boolean}   Get admin prompt (default to true)
         *      spawnopt    {Object}    {cwd: '.'} [optional] (see child_process spawn docs)
         *
         * e.g. [{
         *          admin: false,
         *          name: "test"
         *      }]
         *
         * @param opt The optional configuration
         *      init The initial settings
         *          global  {Boolean} specify if the given packages are global or not
         *          log     {Boolean} specify if to set the log to off or on optional values [true/false]
         *
         *      callback The callback functionality
         */
        uninstall: function(config, opt) {

            var me = this,
                configvar = {},
                callback,
                init;

            if (opt) {
                init = (opt.init || undefined);
                callback = (opt.callback || undefined);
            } else {
                opt = {};
            }

            configvar.action = "rm";
            configvar.isinstalled = true;
            configvar.config = config,
            configvar.global = ((init && 'global' in init) ? init.global : false);
            configvar.debug = opt.debug;
            configvar.depth = opt.depth;

            if (init) {
                this.init(init);
            }

            _packageProcess(configvar, function() {
                if (this.data) {
                    me.spawn(this.data, init, function() {
                        if (callback) {
                            callback.call(me);
                        }
                    });
                }
            });
        }
    };

}();