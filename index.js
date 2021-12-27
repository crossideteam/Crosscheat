const WebSocket = require('ws');
const serverAddress = 'wss://servers.crosside.eu/';
const { token, path } = require('./config.json');
var connected = "false";
var fs = require('fs');

const ws = new WebSocket(serverAddress, {
    headers: {
        "user-agent": "Mozilla",
        'token': `${token}`
    },
    noServer: true
});

ws.on('open', function () {
    connected = "true";
    ws.send("getbans")
});
ws.on('close', function () {
    connected = "false";
});

fs.unlink('./bans.json', function(err) {
});

ws.on('message', function(msg) {
    if (msg.includes("@ban")) {
        var bn = msg.toString('utf8').split("@ban")[1]
        fs.readFile("./bans.json", function(err , data) {
            if (err) {
                fs.writeFile("./bans.json", `[
"start"` + data.split("]//")[0].split(`//
[`)[1] + bn + "]//", function(err2) {
                    if (err2) throw err2;
                    sync();

                });
                return;
            }
            fs.writeFile("./bans.json", `//
[` + data.split("]//")[0].split(`//
[`)[1] + bn + "]//", function(err2) {
                if (err2) throw err2;
                sync();
                
            });
        });
    }
});


setInterval(() => {
    if (connected == "true") {
        ws.send("getbans")
    } else { return; }
}, 60000)


function sync() {
    const { name, identifiers, banner, reason, expire } = require('./config.json');
        fs.readFile("./bans.json", function(err2, data2) {
            if (err) return;
            var i;
            for (i = 0; i < data.length; i++)
                if (!data2.includes(name[i])) {
                    ban(name, identifiers, banner, reason, expire)
                }
            fs.readFile("./bans.json", function(err, data) {
                if (err) throw err;
                fs.writeFile(path, data, function(err3) {
                    if (err) throw err;
                })
            })

    });
}

function ban(name2, identifiers2, banner2, reason2, expire2) {
    ws.send("setbans@ban" + JSON.stringify({ name: name2, identifiers: identifiers2, banner: banner2, reason: reason2, expire: expire2 }))
};

