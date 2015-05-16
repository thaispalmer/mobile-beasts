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
        sendData(socketClient.socketId,"Connected\n");

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
        if (client.command == 'exit') { // for testing via telnet
            sendData(socketId,'Bye');
            disconnectClient(socketId);
        }
    }
}

function sendData(socketId,data) {
    chrome.socket.write(socketId,strtoab(data));
}

function disconnectClient(socketId) {
    serverLog('Client ['+socketId+'] has quit.');
    chrome.socket.disconnect(socketId);
    chrome.socket.destroy(socketId);
    delete connectedClients[socketId];
}