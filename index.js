const WebSocket = require('ws');
const serverAddress = 'wss://servers.crosside.eu/';
const { token, path } = require('./config.json');
var connected = "false";
var fs = require('fs');
const { isUndefined } = require('util');
var fss = require('fs-slice');
const ws = new WebSocket(serverAddress, {
    headers: {
        "user-agent": "Mozilla",
        'token': `${token}`
    },
    noServer: true
});
ws.on('open', function () {
    connected = "true";
    sync()
    tickstart()
});
ws.on('close', function () {
    connected = "false";
});
ws.on('message', function(msg) {
    if (msg.includes("@ban")) {
        var bn = msg.toString('utf8').split("@ban")[1]
        fs.readFile("./data.txt", function (err, data) {
            if (data.toString("utf-8") == "false") {
                fs.writeFileSync("./data.txt", "true", function (err2) { if (err2) throw err2; });
                sync();
            } else {
                fs.readFile(path, function (err, data) {
                    if (err) throw err;
                    if (!data.toString("utf-8").includes(bn)) {
                        if (data.toString("utf-8").substring(0, data.toString("utf-8").length - 1) == "[" || data.toString("utf-8").substring(0, data.toString("utf-8").length - 1) == "{") {
                            var msg = "[" + bn + "]"
                            fs.writeFileSync(path, msg, function (err2) { if (err2) throw err2; });
                        } else {
                            var msg = data.toString("utf-8").substring(0, data.toString("utf-8").length - 1) + "," + bn + "]"
                            fs.writeFileSync(path, msg, function (err2) { if (err2) throw err2; });
                        };
                    }
                })
            }
            });
    

                
    }
});
function sync() {
        fs.readFile(path, function(err2, data2) {
            if (err2) throw err2;
            fs.readFile(path, function (err, data) {
                if (err) throw err;
                var dt = JSON.parse(data.toString("utf-8"))
                for (let element of dt) {
                    ws.send("setbans@ban" + element.name + "+!%/==/%!+" + element.identifiers + "+!%/==/%!+" + element.banner + "+!%/==/%!+" + element.reason + " From Crosside Global AntiCheat Database(CGAD)" + "+!%/==/%!+" + element.expire)
                    
                }
                })
            })
    ws.send("getbans")
    };
function tickstart() {
    setInterval(() => {
        if (connected == "true") {
            sync();
        } else { return; }
    }, 60000)}
