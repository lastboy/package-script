console.log("Package Script Test....");

function test() {
    require('./pkgscript.js').spawn([
        {
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