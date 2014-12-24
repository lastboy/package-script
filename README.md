package-script
==============

<p>Add a cross OS nodejs call to your package.json script section for spawning an external commands.
 e.g. install bower or grunt that are global packages as part of your module.</p>

<p>It's obvious that you can use this package for running multiple synchronized commands by configuration.</p>

<p>Note: In some cases, if you can somehow use global packages as a module e.g. require("bower") instead of using it globaly and avoid installing it in your package script it would be a best practice. But sometimes it's inevetable... </p>

## Blog
Some more information [NodeJS Corner](http://nodejscorner.blogspot.co.il/) blog

## How To

#### First add a script section to your package.json file (optional)

Add a script section to your package.json file.<br/>
You can set the script to run in any phase according to the package.json docs

     "scripts": {
        "install": "node installer.js"
      }

#### Then, in your javascript file:

    require('package-script').spawn([
          {
              command: "npm",
              args: ["install", "-g", "grunt-cli"]
          },
          {
              command: "npm",
              args: ["install", "-g", "bower"]
          }

      ]);

#### Or check the install/uninstall methods
    require('package-script').install([
            {
                admin:false,
                name: "q"
            }
        ], {callback: function() {
            // callback functionality in here
         });
Note: The install and uninstall methods have a validation process for checking <br/>
    if the package already installed/uninstalled


#### version 0.0.7
* depth and debug attributes were added to the optional arguments of the install/uninstall methods
* js.utils dependency upgrade (npm list info, improved)
* local Object utils removed, using js.utils instead
* MAC is now supported

#### version 0.0.5
* issue #1 fixed - Checking if packages already exist
    See install and uninstall methods, also look into js.utils package (NPM)
* Install and UnInstalled methods were added
* callback support for the global methods added

#### version 0.0.4
* issue #2 fixed - switching log off
* Initial configuration added, it can be set via the spawn method or using a separate init method


#### version 0.0.3
* An admin configuration property that enables(default)/disables the admin cli prompt
* A spawnopt configuration property that is the spawn options

#### Reference
* init(config)
    + config {Object} The initial configuration
        + log: Switching the logger off/on optional values: [true/false]

* spawn(config, init, callback)
    + config {Array} List of Objects to launch <br/>
      Launches one or more processes according to the given configuration:
        + command {String} The command to run
        + args {Array} List of string arguments
        + spawnopt {Object} The spawn options
        + admin {boolean} The boolean flag for running the command as administrator (Linux support only for now)
    + init {Object} The initial configuration
        + log: Switching the logger off/on optional values: [true/false]
    + callback {Function} The callback functionality
    <br/>

* install(config, opt)
    + config {Array} List of packages configuration to be installed<br/>
        + name {String} The package name
        + spawnopt {Object} The spawn options
        + admin {boolean} The boolean flag for running the command as administrator (Linux support only for now)
    + opt {Object} The optional configuration
        + init {Object} The initial configuration
            + log: Switching the logger off/on optional values: [true/false]
        + debug {Number}
            + 0: set debug to off (default)
            + 1: set debug to on
        + depth {String} The npm tree info dependencies hierarchy depth (see 'npm list' for more info)
        + callback {Function} The callback functionality
    <br/>

* uninstall(config, opt)
    + config {Array} List of packages configuration to be installed<br/>
        + name {String} The package name
        + spawnopt {Object} The spawn options
        + admin {boolean} The boolean flag for running the command as administrator (Linux support only for now)
    + opt {Object} The optional configuration
        + init {Object} The initial configuration
            + log: Switching the logger off/on optional values: [true/false]
        + debug {Number}
            + 0: set debug to off (default)
            + 1: set debug to on
        + depth {String} The npm tree info dependencies hierarchy depth (see 'npm list' for more info)
        + callback {Function} The callback functionality
    <br/>

See [child_process.spawn](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for more information

## Troubleshooting
#### [Npm install failed with “cannot run in wd”](http://stackoverflow.com/questions/18136746/npm-install-failed-with-cannot-run-in-wd)
