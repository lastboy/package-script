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
            admin:false,
            command: "npm",
            args: ["--version"]
        }
    ]);
}

function test41() {
    var pkgscript = require('./pkgscript.js');
    pkgscript.uninstall([
        {
            admin:true,
            name: "bower"
        },{
            name: "grunt-cli"
        }
    ], {init: {global:true, log:true}});
}

function test412() {
    var pkgscript = require('./pkgscript.js');
    pkgscript.install([
        {
            admin:true,
            name: "bower"
        },{
            name: "grunt-cli"
        }
    ], {init: {global:true, log:true}, callback: function() {
        console.log(" Test completed... ");
    }});
}

function test42() {
    var pkgscript = require('./pkgscript.js');
    pkgscript.install([
        {
            admin:false,
            name: "test"
        }
    ], {callback: function() {

        var pkgscript = require('./pkgscript.js');
        pkgscript.uninstall([
            {
                admin:false,
                name: "test"
            }
        ], {debug: 1, depth: "10", callback: function() {

            console.log(" Test completed... ");
        }});


    }});

}


//test1();
//test2();
//test41();
//test412();
test42();
//test3();