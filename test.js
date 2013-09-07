console.log("Package Script Test....");

function test() {
    require('./pkgscript.js').spawn([
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

test();