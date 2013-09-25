console.log("Package Script Test....");

function test1() {
    require('./pkgscript.js').spawn([
        {
            command: "npm",
            args: ["rm", "-g", "grunt-cli"]
        },
        {
            command: "npm",
            args: ["rm", "-g", "bower"]
        }
    ], {log: false});
}

function test2() {
    require('./pkgscript.js').spawn([
        {
            command: "npm",
            args: ["install", "-g", "grunt-cli"]
        },
        {
            command: "npm",
            args: ["install", "-g", "bower"]
        }
    ], {log: false});
}

function test3() {
    var pkgscript = require('./pkgscript.js');
    //pkgscript.init({log: false});
    pkgscript.spawn([
        {
            admin:false,
            command: "npm",
            args: ["--version"]
        },
        {
            command: "npm",
            args: ["--version"]
        }
    ]);
}

//test1();
//test2();
test3();