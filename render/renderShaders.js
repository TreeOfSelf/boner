

function initShaders() {
    const vertexShaderSource = `#version 300 es
        in vec2 a_position;
        in vec2 a_texCoord;
        in float a_rotation;
        in vec2 a_rotationOffset;
        out vec2 v_texCoord;
        uniform vec2 u_screenSize;
        uniform float u_zoom;

        mat2 rotate2D(float angle) {
            float c = cos(angle);
            float s = sin(angle);
            return mat2(c, -s, s, c);
        }


        void main() {
            v_texCoord = a_texCoord;
            
            // Apply the translation offset before rotation
            vec2 translatedPosition = a_position - a_rotationOffset;
            vec2 rotatedPosition = rotate2D(a_rotation) * translatedPosition;
            
            // Apply the offset back to the rotated position
            gl_Position = vec4((rotatedPosition + a_rotationOffset) / u_screenSize * u_zoom, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `#version 300 es
        precision mediump float;
        in vec2 v_texCoord;
        uniform sampler2D textureSampler;
        out vec4 fragColor;
        void main() {
            fragColor = texture(textureSampler, v_texCoord);

        }
    `;

    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Error linking shaders:", gl.getProgramInfoLog(shaderProgram));
        gl.deleteProgram(shaderProgram);
        return;
    }

    gl.useProgram(shaderProgram);
    let shaderInfo = {
        uniforms : {
            screenSize : gl.getUniformLocation(shaderProgram, "u_screenSize"),
            zoom : gl.getUniformLocation(shaderProgram, "u_zoom"),
        },
        attributes : {
            position : gl.getAttribLocation(shaderProgram, "a_position"),
            texCoord : gl.getAttribLocation(shaderProgram, "a_texCoord"),
            rotation : gl.getAttribLocation(shaderProgram, "a_rotation"),
            rotationOffset : gl.getAttribLocation(shaderProgram, "a_rotationOffset"),
        }
    };
    return(shaderInfo)

}