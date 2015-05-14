/* local player settings */
var localPlayer = {
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
    rotation: 0,
    state: {
        jump: false,
        leftPunch: false,
        rightPunch: false
    },
    helpers: {
        jumpStart: null,
        jumpDirection: null,
        leftPunchCounter: null,
        rightPunchCounter: null
    }
};


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
    
    if (localPlayer.keys.up) localPlayer.position.y -= 4;
    if (localPlayer.keys.down) localPlayer.position.y += 4;
    if (localPlayer.keys.left) localPlayer.position.x -= 4;
    if (localPlayer.keys.right) localPlayer.position.x += 4;
    if (localPlayer.keys.jump && !localPlayer.state.jump) {
        localPlayer.state.jump = true;
        localPlayer.helpers.jumpDirection = 2;
        localPlayer.helpers.jumpStart = localPlayer.position.z;
    }
    if (localPlayer.keys.leftPunch) player.classList.add('leftPunch');
    else player.classList.remove('leftPunch');
    if (localPlayer.keys.rightPunch) player.classList.add('rightPunch');
    else player.classList.remove('rightPunch');
    /*if (localPlayer.keys.leftPunch && !localPlayer.state.leftPunch) {
        localPlayer.state.leftPunch = true;
        localPlayer.helpers.leftPunchCounter = 0;
    }*/

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
    /*if (localPlayer.state.leftPunch) {
        console.log(localPlayer.helpers.leftPunchCounter);
        player.classList.add('leftPunch');
        if (localPlayer.helpers.leftPunchCounter < 5) localPlayer.helpers.leftPunchCounter += 1;
        else {
            localPlayer.state.leftPunch = false;
            player.classList.remove('leftPunch');
        }
    }*/

    if (localPlayer.keys.up) localPlayer.rotation = -90;
    if (localPlayer.keys.down) localPlayer.rotation = 90;
    if (localPlayer.keys.left) localPlayer.rotation = 180;
    if (localPlayer.keys.right) localPlayer.rotation = 0;
    if (localPlayer.keys.right && localPlayer.keys.down) localPlayer.rotation = 45;
    if (localPlayer.keys.left && localPlayer.keys.down) localPlayer.rotation = 135;
    if (localPlayer.keys.right && localPlayer.keys.up) localPlayer.rotation = -45;
    if (localPlayer.keys.left && localPlayer.keys.up) localPlayer.rotation = -135;

    player.style.top = localPlayer.position.y + 'px';
    player.style.left = localPlayer.position.x + 'px';
    player.style.webkitTransform = 'scale('+(1+localPlayer.position.z/20)+') rotate('+localPlayer.rotation+'deg)';
}