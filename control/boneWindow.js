
document.getElementById('boneDiv_x').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_y').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_z').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_fixed').addEventListener('change', updateBoneValue);
document.getElementById('boneDiv_flipped').addEventListener('change', updateBoneValue);
document.getElementById('boneDiv_angle').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_length').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_image').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_imageOffset').addEventListener('input', updateBoneValue);
document.getElementById('boneDiv_imageOffsetRotation').addEventListener('input', updateBoneValue);

imageOffsetButton = document.getElementById("boneDiv_imageOffsetButton");
imageOffsetButton.onclick = function(){
    selection.type="imageOffset";
}

function updateBoneValue() {
    if (selection.boneSelect) {
        selection.boneSelect.x = parseFloat(document.getElementById('boneDiv_x').value) || 0;
        selection.boneSelect.y = parseFloat(document.getElementById('boneDiv_y').value) || 0;
        selection.boneSelect.z = parseFloat(document.getElementById('boneDiv_z').value) || 0;
        selection.boneSelect.fixed = document.getElementById('boneDiv_fixed').checked;
        selection.boneSelect.flipped = document.getElementById('boneDiv_flipped').checked;
        let newAngle = degrees_to_radian(parseFloat(document.getElementById('boneDiv_angle').value) || 0) - selection.boneSelect.angle;
        selection.boneSelect.length = parseFloat(document.getElementById('boneDiv_length').value) || 0;
        selection.boneSelect.image = document.getElementById('boneDiv_image').value || "";
        //selection.boneSelect.imageOffset = parseFloat(document.getElementById('boneDiv_imageOffset').value) || 0;
        selection.boneSelect.imageOffsetRotation = degrees_to_radian(parseFloat(document.getElementById('boneDiv_imageOffsetRotation').value));
        bone_rotateWithChildren(selection.boneSelect,newAngle);
    }
}



function bone_drawSettings() {
    if (selection.boneSelect) {
        if(boneDiv.style.display=="none"){
            selection.boneSelect=null;
            return;
        }

        const xInput = document.getElementById('boneDiv_x');
        const yInput = document.getElementById('boneDiv_y');
        const zInput = document.getElementById('boneDiv_z');
        const fixedInput = document.getElementById('boneDiv_fixed');
        const flippedInput = document.getElementById('boneDiv_flipped');
        const angleInput = document.getElementById('boneDiv_angle');
        const lengthInput = document.getElementById('boneDiv_length');
        const imageInput = document.getElementById('boneDiv_image');
        const imageOffsetInput = document.getElementById('boneDiv_imageOffset');
        const imageOffsetRotationInput = document.getElementById('boneDiv_imageOffsetRotation');

        // Check if selection.boneSelect exists and contains the necessary values
        if (selection.boneSelect) {
            xInput.value = (selection.boneSelect.x !== undefined) ? selection.boneSelect.x : "";
            yInput.value = (selection.boneSelect.y !== undefined) ? selection.boneSelect.y : "";
            zInput.value = selection.boneSelect.z;
            fixedInput.checked = selection.boneSelect.fixed;
            flippedInput.checked = selection.boneSelect.flipped;
            angleInput.value = (selection.boneSelect.angle !== undefined) ? selection.boneSelect.angle : "";
            lengthInput.value = (selection.boneSelect.length !== undefined) ? selection.boneSelect.length : "";  
            
            let index = 1;
            for(imageName in textureCoords){
                if(imageName == selection.boneSelect.image){
                    break;
                }
                index++;
            }
            if(selection.boneSelect.image=="none") index=0;

            imageInput.selectedIndex = index;

            imageOffsetInput.value = selection.boneSelect.imageOffset[0].toFixed(0)+","+selection.boneSelect.imageOffset[1].toFixed(0);
            imageOffsetRotationInput.value = Math.round(radian_to_degrees(selection.boneSelect.imageOffsetRotation));

            xInput.value = Math.round(xInput.value);
            yInput.value = Math.round(yInput.value);
            angleInput.value = Math.round(radian_to_degrees(angleInput.value));
            lengthInput.value = Math.round(lengthInput.value);
        } else {
            // Clear the inputs if no boneSelect is available
            xInput.value = "";
            yInput.value = "";
            angleInput.value = "";
            lengthInput.value = "";
            imageInput.value = "";
            imageOffsetInput.value = "";
            imageOffsetRotationInput.value = "";
        }
    }
}