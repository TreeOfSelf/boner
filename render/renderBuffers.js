
const buffers = {
     position : gl.createBuffer(),
     texCoord : gl.createBuffer(),
     rotation : gl.createBuffer(),
     rotationOffset : gl.createBuffer()
}

let drawLenght = 0;

initBuffers = function() {

    let combinedPosition = [];
    let combinedTexCoord = [];
    let combinedRotation = [];
    let combinedRotationOffset = [];

    // Create a separate list of bones sorted by their z-coordinate
    var sortedBones = bones.slice(); // Make a copy of the bones array
    sortedBones.sort(function(a, b) {
        return a.z - b.z; // Sort by z-coordinate
    });

    for (var k = 0; k < sortedBones.length; k++) {
        let bone = sortedBones[k];
        if (bone.image == "none") continue;
        let drawInfo = draw_sprite(bone);
        combinedPosition = combinedPosition.concat(drawInfo.position);
        combinedTexCoord = combinedTexCoord.concat(drawInfo.texCoord);
        combinedRotation = combinedRotation.concat(drawInfo.rotation);
        combinedRotationOffset = combinedRotationOffset.concat(drawInfo.rotationOffset);
    }

    drawLength = combinedPosition.length;


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(combinedPosition), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(combinedTexCoord), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(combinedRotation), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotationOffset);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(combinedRotationOffset), gl.STATIC_DRAW);

    // Set up vertex attributes for the combined data
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(shaderInfo.attributes.position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderInfo.attributes.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
    gl.vertexAttribPointer(shaderInfo.attributes.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderInfo.attributes.texCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotation);
    gl.vertexAttribPointer(shaderInfo.attributes.rotation, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderInfo.attributes.rotation);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.rotationOffset);
    gl.vertexAttribPointer(shaderInfo.attributes.rotationOffset, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderInfo.attributes.rotationOffset);
}