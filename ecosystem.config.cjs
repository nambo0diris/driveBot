module.exports = {
    apps : [{
        name   : "drive_bot",
        script : "./index.ts",
        exec_mode: "cluster",
        ignore_watch: "/root/driveBot/temp/"
    }]
}
