/* ************** */
/* Game functions */
/* ************** */


/* local player settings */
var localPlayer = {
    id: null,
    color: '#00a',
    keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        jump: false,
        leftPunch: false,
        rightPunch: false,
        lift: false
    },
    position: {
        x: 50,
        y: 50,
        z: 0
    },
    health: 100,
    rotation: 0,
    state: {
        jump: false,
        leftPunch: false,
        rightPunch: false
    },
    helpers: {
        jumpStart: null,
        jumpDirection: null
    },
    cache: {
        remotePlayersCount: null,
        index: null
    }
};


/* other players */
var remotePlayers = [
/*
    {
        id: null,
        color: '#a00',
        position: {
            x: 200,
            y: 200,
            z: 0
        },
        health: 100,
        rotation: 180,
        state: {
            jump: false,
            leftPunch: false,
            rightPunch: false
        }
    },
*/
];


/* key press */
function checkKey(e,state) {
    e = e || window.event;
    switch (e.keyCode) {
        // arrows
        case 38:
            localPlayer.keys.up = state;
            break;
        case 40:
            localPlayer.keys.down = state;
            break;
        case 37:
            localPlayer.keys.left = state;
            break;
        case 39:
            localPlayer.keys.right = state;
            break;
        case 90:
            localPlayer.keys.leftPunch = state;
            break;
        case 88:
            localPlayer.keys.rightPunch = state;
            break;
        case 67:
            localPlayer.keys.lift = state;
            break;

        // space
        case 32:
            localPlayer.keys.jump = state;
            break;

        default:
            break;
    }
}
document.addEventListener('keydown', function(e) { checkKey(e,true) });
document.addEventListener('keyup', function(e) { checkKey(e,false) });


/* screen touch */
function checkTouch(e,state) {
    e = e || window.event;
    switch (e.target.id) {    // arrows
        case 'btn_jump':
            localPlayer.keys.jump = state;
            break;

        case 'btn_leftPunch':
            localPlayer.keys.leftPunch = state;
            break;

        case 'btn_rightPunch':
            localPlayer.keys.rightPunch = state;
            break;

        case 'btn_directional':
            var areaWidth = (e.target.offsetWidth/3);
            var areaHeight = (e.target.offsetHeight/3);
            for (var touch = 0; touch < e.targetTouches.length; touch++) {
                var touchX = e.targetTouches[touch].clientX - e.target.parentElement.offsetLeft;
                var touchY = e.targetTouches[touch].clientY - e.target.parentElement.offsetTop;

                if ((touchX >= 0) && (touchY >= 0) && (touchX <= areaWidth) && (touchY <= areaHeight)) {
                    localPlayer.keys.up = state;
                    localPlayer.keys.left = state;
                }
                else if ((touchX > areaWidth) && (touchY >= 0) && (touchX <= areaWidth*2) && (touchY <= areaHeight)) {
                    localPlayer.keys.up = state;
                }
                else if ((touchX > areaWidth*2) && (touchY >= 0) && (touchX <= areaWidth*3) && (touchY <= areaHeight)) {
                    localPlayer.keys.up = state;
                    localPlayer.keys.right = state;
                }
                if ((touchX >= 0) && (touchY > areaHeight) && (touchX <= areaWidth) && (touchY <= areaHeight*2)) {
                    localPlayer.keys.left = state;
                }
                else if ((touchX > areaWidth*2) && (touchY > areaHeight) && (touchX <= areaWidth*3) && (touchY <= areaHeight*2)) {
                    localPlayer.keys.right = state;
                }
                if ((touchX >= 0) && (touchY > areaHeight*2) && (touchX <= areaWidth) && (touchY <= areaHeight*3)) {
                    localPlayer.keys.down = state;
                    localPlayer.keys.left = state;
                }
                else if ((touchX > areaWidth) && (touchY > areaHeight*2) && (touchX <= areaWidth*2) && (touchY <= areaHeight*3)) {
                    localPlayer.keys.down = state;
                }
                else if ((touchX > areaWidth*2) && (touchY > areaHeight*2) && (touchX <= areaWidth*3) && (touchY <= areaHeight*3)) {
                    localPlayer.keys.down = state;
                    localPlayer.keys.right = state;
                }
            }
            if (e.targetTouches.length == 0) {
                localPlayer.keys.up = false;
                localPlayer.keys.down = false;
                localPlayer.keys.left = false;
                localPlayer.keys.right = false;
            }
            break;

        default:
            break;
    }
}
function touchMove(e) {
    var areaWidth = (e.target.offsetWidth/3);
    var areaHeight = (e.target.offsetHeight/3);
    for (var touch = 0; touch < e.changedTouches.length; touch++) {
        var touchX = e.changedTouches[touch].clientX - e.target.parentElement.offsetLeft;
        var touchY = e.changedTouches[touch].clientY - e.target.parentElement.offsetTop;

        if ((touchX >= 0) && (touchY >= 0) && (touchX <= areaWidth) && (touchY <= areaHeight)) {
            localPlayer.keys.up = true;
            localPlayer.keys.down = false;
            localPlayer.keys.left = true;
            localPlayer.keys.right = false;
        }
        else if ((touchX > areaWidth) && (touchY >= 0) && (touchX <= areaWidth*2) && (touchY <= areaHeight)) {
            localPlayer.keys.up = true;
            localPlayer.keys.down = false;
            localPlayer.keys.left = false;
            localPlayer.keys.right = false;
        }
        else if ((touchX > areaWidth*2) && (touchY >= 0) && (touchX <= areaWidth*3) && (touchY <= areaHeight)) {
            localPlayer.keys.up = true;
            localPlayer.keys.down = false;
            localPlayer.keys.left = false;
            localPlayer.keys.right = true;
        }
        else if ((touchX >= 0) && (touchY > areaHeight) && (touchX <= areaWidth) && (touchY <= areaHeight*2)) {
            localPlayer.keys.up = false;
            localPlayer.keys.down = false;
            localPlayer.keys.left = true;
            localPlayer.keys.right = false;
        }
        else if ((touchX > areaWidth*2) && (touchY > areaHeight) && (touchX <= areaWidth*3) && (touchY <= areaHeight*2)) {
            localPlayer.keys.up = false;
            localPlayer.keys.down = false;
            localPlayer.keys.left = false;
            localPlayer.keys.right = true;
        }
        else if ((touchX >= 0) && (touchY > areaHeight*2) && (touchX <= areaWidth) && (touchY <= areaHeight*3)) {
            localPlayer.keys.up = false;
            localPlayer.keys.down = true;
            localPlayer.keys.left = true;
            localPlayer.keys.right = false;
        }
        else if ((touchX > areaWidth) && (touchY > areaHeight*2) && (touchX <= areaWidth*2) && (touchY <= areaHeight*3)) {
            localPlayer.keys.up = false;
            localPlayer.keys.down = true;
            localPlayer.keys.left = false;
            localPlayer.keys.right = false;
        }
        else if ((touchX > areaWidth*2) && (touchY > areaHeight*2) && (touchX <= areaWidth*3) && (touchY <= areaHeight*3)) {
            localPlayer.keys.up = false;
            localPlayer.keys.down = true;
            localPlayer.keys.left = false;
            localPlayer.keys.right = true;
        }
        else {
            localPlayer.keys.up = false;
            localPlayer.keys.down = false;
            localPlayer.keys.left = false;
            localPlayer.keys.right = false;
        }
    }
}


/* keyframe rendering */
setInterval(renderGame,33);
function renderGame() {
    var player = document.getElementById('player');
    var playerHealth = document.getElementById('playerHealth');

    if (gameStarted) {
        var changes = false;
        // check actions
        if (localPlayer.keys.up) {
            localPlayer.position.y -= 5;
            changes = true;
        }
        if (localPlayer.keys.down) {
            localPlayer.position.y += 5;
            changes = true;
        }
        if (localPlayer.keys.left) {
            localPlayer.position.x -= 5;
            changes = true;
        }
        if (localPlayer.keys.right) {
            localPlayer.position.x += 5;
            changes = true;
        }
        if (localPlayer.keys.jump && !localPlayer.state.jump) {
            localPlayer.state.jump = true;
            localPlayer.helpers.jumpDirection = 2;
            localPlayer.helpers.jumpStart = localPlayer.position.z;
            changes = true;
        }
        if (localPlayer.keys.leftPunch) {
            localPlayer.state.leftPunch = true;
            player.classList.add('leftPunch');
            changes = true;
        }
        else if (player.classList.contains('leftPunch')) {
            localPlayer.state.leftPunch = false;
            player.classList.remove('leftPunch');
            changes = true;
        }
        if (localPlayer.keys.rightPunch) {
            localPlayer.state.rightPunch = true;
            player.classList.add('rightPunch');
            changes = true;
        }
        else if (player.classList.contains('rightPunch')) {
            localPlayer.state.rightPunch = false;
            player.classList.remove('rightPunch');
            changes = true;
        }

        // preparing jump
        if (localPlayer.state.jump) {
            player.classList.add('jump');
            if ((localPlayer.position.z == localPlayer.helpers.jumpStart) && (localPlayer.helpers.jumpDirection == -2)) {
                localPlayer.state.jump = false;
                player.classList.remove('jump');
            }
            else if (localPlayer.position.z < localPlayer.helpers.jumpStart+20) localPlayer.position.z += localPlayer.helpers.jumpDirection;
            else if (localPlayer.position.z == localPlayer.helpers.jumpStart+20) {
                localPlayer.helpers.jumpDirection = -2;
                localPlayer.position.z += localPlayer.helpers.jumpDirection;
            }
            changes = true;
        }
        // preparing rotation
        if (localPlayer.keys.up) localPlayer.rotation = -90;
        if (localPlayer.keys.down) localPlayer.rotation = 90;
        if (localPlayer.keys.left) localPlayer.rotation = 180;
        if (localPlayer.keys.right) localPlayer.rotation = 0;
        if (localPlayer.keys.right && localPlayer.keys.down) localPlayer.rotation = 45;
        if (localPlayer.keys.left && localPlayer.keys.down) localPlayer.rotation = 135;
        if (localPlayer.keys.right && localPlayer.keys.up) localPlayer.rotation = -45;
        if (localPlayer.keys.left && localPlayer.keys.up) localPlayer.rotation = -135;

        // updating player state with the server
        if (changes) sendUpdate();
    }

    // rendering player
    player.style.backgroundColor = localPlayer.color;
    player.style.top = localPlayer.position.y + 'px';
    player.style.left = localPlayer.position.x + 'px';
    player.style.webkitTransform = 'scale('+(1+localPlayer.position.z/25)+') rotate('+localPlayer.rotation+'deg)';

    // rendering player health
    if (localPlayer.health == 100) playerHealth.style.display = 'none';
    else playerHealth.style.display = 'block';
    playerHealth.style.top = (localPlayer.position.y - localPlayer.position.z*1.5) + 'px';
    playerHealth.style.left = localPlayer.position.x + 'px';
    playerHealth.getElementsByClassName('amount')[0].style.width = localPlayer.health+'%';

    // rendering remote players
    for (var i = 0;i < remotePlayers.length; i++) {
        var remotePlayer,remotePlayerHealth;
        // creating remote player elements if they doesn't exists
        if (!(remotePlayer = document.getElementById('player_'+remotePlayers[i].id))) {
            var viewport = document.getElementById('viewport');

            var playerNode = document.createElement('DIV');
            playerNode.id = 'player_'+remotePlayers[i].id;
            playerNode.classList.add('player');
            viewport.appendChild(playerNode);

            var healthNode = document.createElement('DIV');
            healthNode.id = playerNode.id+'_health';
            healthNode.classList.add('health');
            healthNode.innerHTML = '<div class="amount"></div>';
            viewport.appendChild(healthNode);
        }

        // rendering remote player and health
        remotePlayer.style.backgroundColor = remotePlayers[i].color;
        remotePlayer.style.top = remotePlayers[i].position.y + 'px';
        remotePlayer.style.left = remotePlayers[i].position.x + 'px';
        remotePlayer.style.webkitTransform = 'scale('+(1+remotePlayers[i].position.z/25)+') rotate('+remotePlayers[i].rotation+'deg)';

        if (remotePlayers[i].state.leftPunch) remotePlayer.classList.add('leftPunch');
        else if (remotePlayer.classList.contains('leftPunch')) remotePlayer.classList.remove('leftPunch');
        if (remotePlayers[i].state.rightPunch) remotePlayer.classList.add('rightPunch');
        else if (remotePlayer.classList.contains('rightPunch')) remotePlayer.classList.remove('rightPunch');
        if (remotePlayers[i].state.jump) remotePlayer.classList.add('jump');
        else if (remotePlayer.classList.contains('jump')) remotePlayer.classList.remove('jump');

        remotePlayerHealth = document.getElementById('player_'+remotePlayers[i].id+'_health');
        if (remotePlayers[i].health == 100) remotePlayerHealth.style.display = 'none';
        else remotePlayerHealth.style.display = 'block';
        remotePlayerHealth.style.top = (remotePlayers[i].position.y - remotePlayers[i].position.z*1.5) + 'px';
        remotePlayerHealth.style.left = remotePlayers[i].position.x + 'px';
        remotePlayerHealth.getElementsByClassName('amount')[0].style.width = remotePlayers[i].health+'%';
    }
}


/* getting parameters */
console.log('IP: '+getURLParameter('ip'));
console.log('Player color: '+getURLParameter('color'));

var server = getURLParameter('server');
var addr = getURLParameter('ip');
localPlayer.color = getURLParameter('color');

var socket = {
    id: null,
    buffer: '',
    command: null
};

var gameStarted = false;


/* client connection */
document.addEventListener('deviceready', function() {
    console.log('Connecting to '+addr+':3500');
    document.getElementById('connecting').innerHTML = 'Connecting to '+addr+':3500';
    chrome.socket.create('tcp', {}, function(socketClient) {

        // connecting
        chrome.socket.connect(socketClient.socketId, addr, 3500, function(result) {
            if (result == 0) {
                console.log('Connected!');
                document.getElementById('connecting').innerHTML = 'Connected!';
                socket.id = socketClient.socketId;
                sendData(socketClient.socketId,'JOIN '+localPlayer.color+(server ? ' AND START' : ''));
                // prepare to receive data from server
                receiveData(socketClient.socketId);
            }
            else {
                console.log('Socket error: '+result);
            }
        });
    });
});

function receiveData(socketId) {
    chrome.socket.read(socketId, function(readResult) {
        socket.buffer += abtostr(readResult.data);

        // try to process the current buffer
        processData(socketId);

        // prepare to receive another incoming data
        receiveData(socketId);
    });
}

function processData(socketId) {
    var endOfString = socket.buffer.indexOf("\r\n");
    if (endOfString > -1) {
        socket.command = socket.buffer.substring(0,endOfString);
        socket.buffer = '';

        var params = socket.command.split(' ');
        if (socket.command == 'OK WAIT GAME START') {
            document.getElementById('connecting').style.display = 'none';
            document.getElementById('waiting').style.display = 'block';
            console.log('Joined successfully. Waiting the game to start');
        }
        else if (socket.command == 'GAME ALREADY STARTED') {
            document.getElementById('connecting').innerHTML = 'Connected! But the game has already begun.';
            setTimeout(function() {
                window.location.href = 'index.html';
            },3000);
            console.log('Tried to join, but the game has begun.');
        }
        else if (params[0] == 'PLAYERID') {
            localPlayer.id = params[1];
            console.log('Received id: '+localPlayer.id);
        }
        else if (socket.command == 'GAME START') {
            document.getElementById('waiting').style.display = 'none';
            document.getElementById('controls').style.display = 'block';
            gameStarted = true;
            console.log('The game has started!');
        }
        else if (params[0] == 'RP') {
            remotePlayers = JSON.parse(socket.command.substr(3));
            if (remotePlayers.length != localPlayer.cache.remotePlayersCount) {
                localPlayer.cache.remotePlayersCount = remotePlayers.length;
                var index;
                for (index = 0; index < localPlayer.cache.remotePlayersCount; index++) {
                    if (remotePlayers[index].id == localPlayer.id) break;
                }
                localPlayer.cache.index = index;
            }
            localPlayer.color = remotePlayers[localPlayer.cache.index].color;
            localPlayer.position = remotePlayers[localPlayer.cache.index].position;
            localPlayer.health = remotePlayers[localPlayer.cache.index].health;
            localPlayer.rotation = remotePlayers[localPlayer.cache.index].rotation;
            localPlayer.state = remotePlayers[localPlayer.cache.index].state;
        }
        else console.log('Received: '+socket.command);
    }
}

function sendData(socketId,data) {
    chrome.socket.write(socketId,strtoab(data+"\r\n"));
}

function sendUpdate() {
    sendData(socket.id,'UPDATE '+JSON.stringify(
        {
            color: localPlayer.color,
            position: localPlayer.position,
            health: localPlayer.health,
            rotation: localPlayer.rotation,
            state: localPlayer.state
        }
    ));
}