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
if (document.getElementById('viewport')) {
    window.addEventListener('resize', resizeViewport);
    resizeViewport();
}


/* arraybuffer converters */
function strtoab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Int8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function abtostr(buf) {
    return String.fromCharCode.apply(null, new Int8Array(buf));
}