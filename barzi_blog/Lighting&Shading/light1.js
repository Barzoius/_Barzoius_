var InitDemo = function()
{
    console.log("Works");

    var canvas = document.getElementById("game-surface");
    var gl = canvas.getContext('webgl2');

    if(!gl)
    {
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        console.log("WebGL not supported, falling back on experimental-webgl");
        alert("Your browser does not support WebGL");
        return;
    }

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


};

