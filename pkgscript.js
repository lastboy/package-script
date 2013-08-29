"use strict";

var os = require('os'),
    fs = require("fs"),
    typedas = require('typedas'),
    spawn,
    options = {
        cachePassword: true,
        prompt: 'Additional global npm(s) about to be installed, set your root password: ',
        spawnOptions: { /* other options for spawn */ }
    },
    process,
    commands = [],
    next= 0, size = commands.length;

function isLinux() {
    return (os.platform() == "linux");
}

function init() {
    var log = "Package Script installer Initialized ....";
    logall(log);

    if (isLinux()) {
        spawn = require('sudo');
    } else {
        spawn =  require('child_process').spawn;
    }

}

function log2file(data, option) {
    try {
        fs.appendFileSync("pkgscript.log", (data + "\n"), "utf8");
    } catch (e) {
        log2file("Package Script, ERROR:", e);
    }
}

function logall(msg) {
    if (msg) {
        console.log(msg);
        log2file(msg);
    }
}


function install(items) {

    var item = items[next],
        command = item.command,
        args = item.args,
        print;

    if (isLinux()) {
        args.unshift(command);
        print = args.join(" ");
        console.log("Running Installer command: " + print);
        process = spawn(args, options);

    } else {
        args.unshift(command);
        args.unshift("/c");
        command = "cmd";
        print = [command, args.join(" ")].join(" ");
        console.log("Running Installer command: " + print);
        process = spawn(command, args);

    }


    process.stdout.on('data', function (data) {
        var log = 'CAT Installer: ' + data;
        logall(log);
    });

    process.stderr.on('data', function (data) {
        log2file('Package Script : ' + data);
    });

    process.on('close', function (code) {
        log2file('Package Script Complete ' + code);
        next++;
        if (next < size) {
            install(items);
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
         *          command: 'npm',
         *          args: ["--version"]
         *      }]
         */
        spawn: function(config) {
            if (config && typedas.isArray(config)) {
                commands = commands.concat(config);
                install(commands);

            } else {
                logall("No valid configuration for 'install' function, see the docs for more information ");
            }
        }
    };

}();