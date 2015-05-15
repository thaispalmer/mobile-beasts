/* viewport settings */
function resizeViewport() {
    var ratio = (window.innerWidth/1280);
    if ((window.innerWidth/window.innerHeight) > (1280/720)) ratio = (window.innerHeight/720);
    document.getElementById('viewport').style.webkitTransform = 'translate(-50%,-50%) scale('+ratio+')';
}
window.addEventListener('resize',resizeViewport);
resizeViewport();


/* local player settings */
var localPlayer = {
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
    }
};


/* other players */
var remotePlayers = [
    {
        playerElement: null,
        healthElement: null,
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

    {
        playerElement: null,
        healthElement: null,
        color: '#0a0',
        position: {
            x: 400,
            y: 100,
            z: 0
        },
        health: 100,
        rotation: 90,
        state: {
            jump: false,
            leftPunch: false,
            rightPunch: false
        }
    }
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

    // check actions
    if (localPlayer.keys.up) localPlayer.position.y -= 5;
    if (localPlayer.keys.down) localPlayer.position.y += 5;
    if (localPlayer.keys.left) localPlayer.position.x -= 5;
    if (localPlayer.keys.right) localPlayer.position.x += 5;
    if (localPlayer.keys.jump && !localPlayer.state.jump) {
        localPlayer.state.jump = true;
        localPlayer.helpers.jumpDirection = 2;
        localPlayer.helpers.jumpStart = localPlayer.position.z;
    }
    if (localPlayer.keys.leftPunch) player.classList.add('leftPunch');
    else if (player.classList.contains('leftPunch')) player.classList.remove('leftPunch');
    if (localPlayer.keys.rightPunch) player.classList.add('rightPunch');
    else if (player.classList.contains('rightPunch')) player.classList.remove('rightPunch');

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
        // creating remote player elements if they doesn't exists
        if (!remotePlayers[i].playerElement) {
            var viewport = document.getElementById('viewport');

            var playerNode = document.createElement('DIV');
            playerNode.id = 'remote'+Math.floor(Math.random()*10000);
            playerNode.classList.add('player');
            viewport.appendChild(playerNode);

            var healthNode = document.createElement('DIV');
            healthNode.id = playerNode.id+'_health';
            healthNode.classList.add('health');
            healthNode.innerHTML = '<div class="amount"></div>';
            viewport.appendChild(healthNode);

            remotePlayers[i].playerElement = playerNode.id;
            remotePlayers[i].healthElement = healthNode.id;
        }

        // rendering remote player and health
        var remotePlayer = document.getElementById(remotePlayers[i].playerElement);
        remotePlayer.style.backgroundColor = remotePlayers[i].color;
        remotePlayer.style.top = remotePlayers[i].position.y + 'px';
        remotePlayer.style.left = remotePlayers[i].position.x + 'px';
        remotePlayer.style.webkitTransform = 'scale('+(1+remotePlayers[i].position.z/25)+') rotate('+remotePlayers[i].rotation+'deg)';

        var remotePlayerHealth = document.getElementById(remotePlayers[i].healthElement);
        if (remotePlayers[i].health == 100) remotePlayerHealth.style.display = 'none';
        else remotePlayerHealth.style.display = 'block';
        remotePlayerHealth.style.top = (remotePlayers[i].position.y - remotePlayers[i].position.z*1.5) + 'px';
        remotePlayerHealth.style.left = remotePlayers[i].position.x + 'px';
        remotePlayerHealth.getElementsByClassName('amount')[0].style.width = remotePlayers[i].health+'%';
    }
}