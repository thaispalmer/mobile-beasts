/* ***************************** */
/* Common functions for the game */
/* ***************************** */


/* get parameter from url */
function getURLParameter(param) {
    return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}


/* viewport settings */
function resizeViewport() {
    var ratio = (window.innerWidth/1280);
    if ((window.innerWidth/window.innerHeight) > (1280/720)) ratio = (window.innerHeight/720);
    document.getElementById('viewport').style.webkitTransform = 'translate(-50%,-50%) scale('+ratio+')';
}
window.addEventListener('resize',resizeViewport);
resizeViewport();