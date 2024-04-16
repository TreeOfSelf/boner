rotate=0;
resolution = 1;

draw = function() {
    canvas.style.width="100%";
    canvas.style.imageRendering="pixelated";
    canvas.width = window.innerWidth*resolution;
    canvas.height = window.innerHeight*resolution;
    canvasUI.width = window.innerWidth;
    canvasUI.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    //Main

    initBuffers();
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.7, 0.7, 1.0, 1.0);
    const screenWidth = gl.canvas.width;
    const screenHeight = gl.canvas.height;
    gl.uniform2fv(shaderInfo.uniforms.screenSize, [screenWidth,screenHeight]);
    gl.uniform1f(shaderInfo.uniforms.zoom, zoom*resolution);
	if(drawLength>0){
    gl.drawArrays(gl.TRIANGLES, 0, drawLength);
	}
    //UI
    ctx.clearRect(0, 0, canvasUI.width, canvasUI.height);
    node_drawAll();
    node_drawSelection();
    bone_drawAll();
    bone_drawSettings();
    requestAnimationFrame(draw);
    

    
}





function main() {
    shaderInfo = initShaders();
    initTexture();
    draw();
}

main();
