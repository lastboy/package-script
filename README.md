package-script
==============

<p>Add a cross OS nodejs call to your package.json script section for spawning an external commands.
 e.g. install bower or grunt that are global packages as part of your module.</p>

<p>It's obvious that you can use this package only for spawning if you wish to run multiple synchronized commands by configuration.</p>

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

#### Since version 0.0.3
* An admin configuration property that enables(default)/disables the admin cli prompt
* An spawnopt configuration property that is the spawn options

#### Reference

* spawn(config)
    + config {Array} List of Objects to launch <br/>
      Launches one or more processes according to the given configuration:
        + command {String} The command to run
        + args {Array} List of string arguments
        + spawnopt {Object} The spawn options
        + admin {boolean} The boolean flag for running the command as administrator (Linux support only for now)

See [child_process.spawn](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for more information

