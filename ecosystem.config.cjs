module.exports = {
    apps : [{
        name   : "drive_bot",
        script : "./index.js",
        exec_mode: "cluster",
        ignore_watch: "/root/driveBot/temp/"
    }]
}
