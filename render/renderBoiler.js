let gl;
let shaderProgram;

const canvas = document.getElementById("canvas");
gl = canvas.getContext("webgl2",{
    premultipliedAlpha: false,
    alpha: false,
    antialias: true,
});
const canvasUI = document.getElementById("canvasUI");
ctx = canvasUI.getContext("2d");

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

textureCoords = {}; 
textureSize = [];

async function initTexture() {
    const texture = gl.createTexture();
    const image = new Image();
    
    // Replace 'your_texture.png' with the path to your texture image.
    image.src = './texture/spritesheet.png';
    const jsonData = loadJSONFileSync('./texture/spritesheet.json');

    for(frame in jsonData.frames){
        textureCoords[jsonData.frames[frame].filename.replace(".png","")] = jsonData.frames[frame].frame;
    }

    //Set image options
    let imageSelection = document.getElementById('boneDiv_image');
    let opt = document.createElement("option");
    opt.innerHTML = "none";
    opt.value = "none";
    imageSelection.appendChild(opt);

    for(imageName in textureCoords){
        let opt = document.createElement("option");
        opt.innerHTML = imageName;
        opt.value = imageName;
        imageSelection.appendChild(opt);
    }

    await new Promise(resolve => {
        image.onload = resolve;
    });
    
    textureSize = [ image.width, image.height];

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // Disable mipmap generation for pixel-perfect rendering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    // Use CLAMP_TO_EDGE to prevent bleeding at texture edges
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

