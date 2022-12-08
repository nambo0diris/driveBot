module.exports = {
    apps : [{
        name   : "drive_bot",
        script : "ts-node-esm index.js",
        exec_mode: "cluster",
        ignore_watch: "/root/driveBot/temp/"
    }]
}
