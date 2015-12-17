window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = document.getElementById('audio');
function initAudio() {

    var ctx = new AudioContext();
    var analyser = ctx.createAnalyser();
    var audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var canvas = document.getElementById('canvas');
    var canvasCtx = canvas.getContext('2d');
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    var oldColor = 0;
    var oldRadius = 0;
    var lastWidth = 0;
    var lastHeight = 0;
    var array = new Uint8Array(analyser.frequencyBinCount);
    function draw(color, radius) {
        //console.log(color);
        radius = radius || color;
        canvasCtx.clearRect((canvas.width - lastWidth) / 2 - 2, (canvas.height - lastHeight) / 2 - 2, lastWidth + 4, lastHeight + 4);
        canvasCtx.fillStyle = '#8080' + color.toString(16);
        canvasCtx.beginPath();
        canvasCtx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2*Math.PI);
        canvasCtx.fill();

        canvasCtx.fillStyle = '#ffffff';
        canvasCtx.font = '20px Palatino';
        canvasCtx.textAlign = 'center';
        canvasCtx.fillText(radius, canvas.width / 2, canvas.height / 2 + 7);
        lastHeight = lastWidth = radius * 2;
    }
    function renderFrame() {

        analyser.getByteFrequencyData(array);
        //console.log(array.length);
        var total = 0;
        for (var i = 0; i < array.length; i++) {
            total += array[i];
        }
        var volume_low = [].slice.call(array, 0, array.length / 2).reduce(function(a, b){return a + b}) / array.length * 2;
        var volume_high = [].slice.call(array, array.length / 2).reduce(function(a, b){return a + b}) / array.length * 2;
        if (volume_low || volume_high) {
            var color = Math.min(parseInt(volume_low * 2, 10), 255);
            var radius = Math.min(parseInt(volume_high / 100 * 255, 10), 255) + 30;
            if (Math.abs(color - oldColor) > 10 || Math.abs(radius - oldRadius) > 10) {
                draw(color, radius);
            }
            oldColor = color;
            oldRadius = radius;
        }

        requestAnimationFrame(renderFrame);
    }
    renderFrame();
    audio.play();
}

audio.addEventListener('canplay', function(){
    initAudio();
});