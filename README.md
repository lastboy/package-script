package-script
==============

Add a nodejs call to your package.json script section for spawning an external commands.
 e.g. install bower or grunt that are global packages as part of your module.


## How To

#### First add script section to your package.json file

Add a script section to your package.json file.
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
