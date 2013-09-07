/*
 *  Package Script Module
 *
 */

"use strict";

var objectutils = require("./utils/Object.js"),
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
    sudoarg = require('sudo');


/**
 * The default system value for the admin user is true
 *
 * @returns {boolean} The default admin value
 */
function getDefaultAdmin() {
    return true;
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
    utils.logall(log);

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
            console.log("[package-script] Running Installer command: " + print);

            sudoopt.spawnOptions = {};
            objectutils.copy(spawnopt, sudoopt.spawnOptions);
            cprocess = spawn(args, sudoopt);
        } else {
            //use child_process
            print = args.join(" ");
            console.log("[package-script] Running Installer command: " + command + " " + print);
            cprocess = spawn(command, args, spawnopt);
        }
    } else {
        args.unshift(command);
        args.unshift("/c");
        command = "cmd";
        print = [command, args.join(" ")].join(" ");
        console.log("[package-script] Running Installer command: " + print);
        cprocess = spawn(command, args, spawnopt);

    }

    // -- Spawn Listeners
    cprocess.stdout.on('data', function (data) {
        var log = 'CAT Installer: ' + data;
        utils.logall(log);
    });

    cprocess.stderr.on('data', function (data) {
        if (data && (new String(data)).indexOf("npm ERR") != -1) {
            utils.logall('Package Script : ' + data);
        } else {
            utils.log2file('Package Script : ' + data);
        }
    });

    cprocess.on('close', function (code) {
        utils.log2file('Package Script Complete ' + code);
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

// Initialization
(function() {
    init();
})();

/**
 * Executing multiple calls synchronously according to a given configuration
 *
 * @type {module.exports}
 */
module.exports = function() {

    return {

        /**
         * spawn additional command according to the config
         *
         * @param config The configuration for the install
         * e.g. [{
         *          admin: true, [optional (for now, linux support only)],
         *          spawnopt: {cwd: '.'} [optional] (see child_process spawn docs)
         *          command: 'npm',
         *          args: ["--version"]
         *      }]
         */
        spawn: function(config) {

            utils.log2file("\n\n************ Package Script  ************************************* process id: " + process.pid);

            if (config && typedas.isArray(config)) {
                commands = commands.concat(config);
                size = commands.length;
                if (size > 0) {
                    install(commands, function() {
                        utils.logall("[package-script] process completed, see pkgscript.log for more information");
                    });
                }

            } else {
                utils.logall("[package-script] No valid configuration for 'install' function, see the docs for more information ");
            }
        }
    };

}();