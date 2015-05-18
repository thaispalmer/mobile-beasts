/* getting parameters */
var playerColor = getURLParameter('color');
console.log('Player color: '+playerColor);


/* server log */
function serverLog(message) {
    var logElement = document.getElementById('log');
    var node = document.createElement('LI');
    node.innerHTML = message || '&nbsp;';
    logElement.appendChild(node);
    logElement.scrollTop = logElement.scrollHeight;
}


/* server */
serverLog('Waiting device...');
var gameSettings = {
    started: false
};
var connectedClients = {};
document.addEventListener('deviceready', function() {
    var addr = '127.0.0.1';
    var port = '3500';

    // showing current adapters
    serverLog();
    serverLog('Device network adapters:');
    chrome.socket.getNetworkList(function(info) {
        if (!info) return;
        for (var i = 0; i < info.length; i++) {
            serverLog(info[i].name + ': ' + info[i].address);
        }
    });

    // socket init
    serverLog();
    serverLog('Initiating socket on '+addr+':'+port);
    chrome.socket.create('tcp', {}, function(socketServer) {

        // listening
        chrome.socket.listen(socketServer.socketId, addr, port, function(result) {
            if (result == 0) {
                serverLog('Waiting for connections');
                // prepare to accept incoming connections
                listenForConnection(socketServer.socketId);
            }
            else {
                serverLog();
                serverLog('Socket error: '+result);
            }
        });
    });

});

function listenForConnection(socketId) {
    chrome.socket.accept(socketId, function(socketClient) {
        serverLog('Connection accepted!');
        connectedClients[socketClient.socketId] = {buffer: ''};
        sendData(socketClient.socketId,"Connected");

        // prepare to receive incoming data
        receiveData(socketClient.socketId);

        // prepare to accept another incoming connections
        listenForConnection(socketId);
    });
}

function receiveData(socketId) {
    chrome.socket.read(socketId, function(readResult) {
        connectedClients[socketId].buffer += abtostr(readResult.data);

        // try to process the current buffer
        processData(socketId);

        // prepare to receive another incoming data
        receiveData(socketId);
    });
}

function processData(socketId) {
    var client = connectedClients[socketId];

    var endOfString = client.buffer.indexOf("\r\n");
    if (endOfString > -1) {
        client.command = client.buffer.substring(0,endOfString);
        client.buffer = '';
        serverLog('Received ['+socketId+']: '+client.command);

        var params = client.command.split(' ');
        if (params[0] == 'JOIN') {
            if (gameSettings.started && (params[2]+' '+params[3] != 'AND START')) {
                sendData(socketId,"GAME ALREADY STARTED");
                disconnectClient(socketId);
            }
            else {
                client.player = {
                    id: socketId,
                    color: params[1],
                    position: {
                        x: Math.floor(Math.random()*10000%1200),
                        y: Math.floor(Math.random()*10000%650),
                        z: 0
                    },
                    health: 100,
                    rotation: (180-(45*Math.floor(Math.random()*10%8))),
                    state: {
                        jump: false,
                        leftPunch: false,
                        rightPunch: false
                    }
                };
                sendData(socketId,"OK WAIT GAME START");
                updateAllPlayers();
                if (params[2]+' '+params[3] == 'AND START') {
                    broadcastData('GAME START');
                }
            }
        }
        else if (params[0] == 'UPDATE') {
            // update the current player
            client.player = JSON.parse(client.command.substr(7));
            updateAllPlayers();
        }
    }
}

function updateAllPlayers() {
    // updates every player with everyone data
    var remotePlayers = [];
    for (var index in connectedClients) {
        if (connectedClients.hasOwnProperty(index)) {
            var current = connectedClients[index];
            remotePlayers.push(current.player);
        }
    }
    broadcastData('RP '+JSON.stringify(remotePlayers));
}

function sendData(socketId,data) {
    chrome.socket.write(socketId,strtoab(data+"\r\n"));
}

function broadcastData(data) {
    data = strtoab(data+"\r\n");
    for (var socket in connectedClients) {
        if (connectedClients.hasOwnProperty(socket)) {
            chrome.socket.write(socket,data);
        }
    }
}

function disconnectClient(socketId) {
    serverLog('Client ['+socketId+'] has quit.');
    chrome.socket.disconnect(socketId);
    chrome.socket.destroy(socketId);
    delete connectedClients[socketId];
}

function startGame() {
    document.getElementById('game').src = 'game.html?ip=127.0.0.1&color='+encodeURIComponent(playerColor)+'&server=1';
}