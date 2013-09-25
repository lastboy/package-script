package-script
==============

<p>Add a cross OS nodejs call to your package.json script section for spawning an external commands.
 e.g. install bower or grunt that are global packages as part of your module.</p>

<p>It's obvious that you can use this package only for spawning if you wish to run multiple synchronized commands by configuration.</p>

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

      ]);

#### version 0.0.4
* issue #2 fixed - switching log off
* Initial configuration added, it can be set via the spawn method or using a separate init method


#### Since version 0.0.3
* An admin configuration property that enables(default)/disables the admin cli prompt
* A spawnopt configuration property that is the spawn options

#### Reference
* init(config)
    + config {Object} The initial configuration
        + log: Switching the logger off/on optional values: [true/false]

* spawn(config, init)
    + config {Array} List of Objects to launch <br/>
      Launches one or more processes according to the given configuration:
        + command {String} The command to run
        + args {Array} List of string arguments
        + spawnopt {Object} The spawn options
        + admin {boolean} The boolean flag for running the command as administrator (Linux support only for now)
    + init {Object} The initial configuration
        + log: Switching the logger off/on optional values: [true/false]
    <br/>

See [child_process.spawn](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for more information

