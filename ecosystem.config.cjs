module.exports = {
    apps : [{
        name   : "drive_bot",
        script : "./index.js",
        watch: true,
        exec_mode: "cluster"
    }]
}
