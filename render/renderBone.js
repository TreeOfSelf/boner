bones = [];


node_drawAll = function() {
    for (var k = 0; k < bones.length; k++) {
        if(bones[k].fixed) continue;
        const bone = bones[k];

        const startX = bone.x;
        const startY = bone.y;
        
        // Calculate the end point based on angle and length
        const endX = startX + bone.length * Math.cos(bone.angle);
        const endY = startY + bone.length * Math.sin(bone.angle);

        if(k==0){
            ctx_drawCircle(startX, startY, "orange", 5); // Draw circle for the starting point of the bone
        }else{
            ctx_drawCircle(endX, endY, "red", 5); // Draw circle for the ending point of other bones
        }

        ctx_drawCircle(endX, endY, "red", 5); // Draw circle for the ending point of other bones
        
    }
};

node_drawSelection = function() {

    //Rotating bone
    if(selection.type=="boneRotate"){
        let bone = selection.boneFrom;
        const dx = selection.x - bone.x;
        const dy = selection.y - bone.y;
        const newAngle = Math.atan2(dy, dx) - bone.angle;
        bone_rotateWithChildren(bone,newAngle);
        //bone.angle = newAngle;
    }

    //Creating bone
    if (selection.type == "boneCreate") {
        if(selection.bonePosition=="start"){
            ctx_drawLine(selection.boneFrom.x, selection.boneFrom.y, selection.x, selection.y, "blue", 10);
        }else{
            let bone = selection.boneFrom;
            const startX = bone.x;
            const startY = bone.y;
            
            // Calculate the end point based on angle and length
            const endX = startX + bone.length * Math.cos(bone.angle);
            const endY = startY + bone.length * Math.sin(bone.angle);
            ctx_drawLine(endX, endY, selection.x, selection.y, "blue", 10);
        }
    }

    //Setting image offset
    if (selection.type == 'imageOffset'){
        if(selection.boneSelect){
            const angle = selection.boneSelect.angle + selection.boneSelect.imageOffsetRotation;

            const mouseX = selection.x * 2;
            const mouseY = selection.y * 2;
            const boneSelectX = selection.boneSelect.x * 2;
            const boneSelectY = selection.boneSelect.y * 2;
            
            const deltaX = mouseX - boneSelectX;
            const deltaY = mouseY - boneSelectY;
            
            // Apply rotation transformation
            const adjustedImageOffsetX = deltaX * Math.cos(angle) + deltaY * Math.sin(angle);
            const adjustedImageOffsetY = -deltaX * Math.sin(angle) + deltaY * Math.cos(angle);
            
            // Set the adjusted imageOffset
            selection.boneSelect.imageOffset[0] = adjustedImageOffsetX;
            selection.boneSelect.imageOffset[1] = adjustedImageOffsetY;
        }
    }

}

bone_rotateWithChildren = function(bone,rotation,root=true){
    bone.angle += rotation;
    bone.angle = radian_clamp(bone.angle);
    if(!root && bone.position=="end"){
        bone.x = bone.parent.x + bone.parent.length * Math.cos(bone.parent.angle);
        bone.y = bone.parent.y + bone.parent.length * Math.sin(bone.parent.angle);
    }
    for(var k=0;k<bone.children.length;k++){
        if(bone.children[k].position=="end"){
            bone_rotateWithChildren(bone.children[k],rotation,false);
        }
    }
}


// Define the bone_create function
bone_create = function(from, to,parent, position, imageOffset ) {
    // Calculate the angle and length between from and to points
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = radian_clamp(Math.atan2(dy, dx)); // Calculate angle in radians
    const length = Math.sqrt(dx * dx + dy * dy); // Calculate length

    // Create a new bone object with calculated values
    const bone = {
        image: "none",
        imageOffsetRotation : 1.6,
        imageOffset : [0,0],
        flipped : false,
        angle: angle, // Store the calculated angle
        length: length, // Store the calculated length
        position: position,
        x: from.x,
        y: from.y,
        z: 0,
        fixed : false,
        parent : parent,
        children : [],
    };

    if(parent){
        parent.children.push(bone);
    }

    // Push the bone object into the bones array
    bones.push(bone);
};

bone_create({x:0,y:0},{x:0,y:-50});


bone_drawAll = function() {
    for (var k = 0; k < bones.length; k++) {

        var bone = bones[k];
        var angle = bone.angle; // Angle of the bone in radians
        var length = bone.length; // Length of the bone

        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        var toX = bone.x + length * cosAngle;
        var toY = bone.y + length * sinAngle;

        if(selection.boneSelect==bones[k] && boneDiv.style.display == "initial"){
            ctx_drawLine(bone.x, bone.y, toX, toY, "rgb(150,150,255)", 6); // Draw regular line
        }else{
            ctx_drawLine(bone.x, bone.y, toX, toY, "rgb(30,30,200)", 5); // Draw regular line
        }
        
    }
}


bone_findClick = function(mouseX, mouseY) {
    const clickThreshold = 5/zoom; // Smaller value for more precise click detection
    
    for (let k = 0; k < bones.length; k++) {
        const bone = bones[k];
        
        // Calculate the endpoints of the bone segment
        const boneStartX = bone.x;
        const boneStartY = bone.y;
        const boneEndX = bone.x + bone.length * Math.cos(bone.angle);
        const boneEndY = bone.y + bone.length * Math.sin(bone.angle);
        
        // Calculate the distances from the click to the bone endpoints
        const distanceToStart = Math.sqrt(Math.pow(mouseX - boneStartX, 2) + Math.pow(mouseY - boneStartY, 2));
        const distanceToEnd = Math.sqrt(Math.pow(mouseX - boneEndX, 2) + Math.pow(mouseY - boneEndY, 2));
        
        // Calculate the distance from the click to the bone segment
        const boneVectorX = boneEndX - boneStartX;
        const boneVectorY = boneEndY - boneStartY;
        const clickVectorX = mouseX - boneStartX;
        const clickVectorY = mouseY - boneStartY;
        const projection = (clickVectorX * boneVectorX + clickVectorY * boneVectorY) / (bone.length * bone.length);
        const perpendicularDistance = Math.sqrt(Math.pow(clickVectorX - projection * boneVectorX, 2) + Math.pow(clickVectorY - projection * boneVectorY, 2));
        
        // Check if the click is close enough to the bone segment
        if (perpendicularDistance <= clickThreshold && projection >= 0 && projection <= 1) {
            return bone;
        }
    }
    
    return null; // No bone clicked
}



bone_getNodeClick = function(x,y){
    // Loop through all nodes to check for a click
    let boneClicked = null;
    let bonePosition = null;
    let boneDepth = 9999;
    for (var k = 0; k < bones.length; k++) {
        if(bones[k].fixed) continue;
        const bone = bones[k];

        const startX = bone.x;
        const startY = bone.y;
        
        // Calculate the end point based on angle and length
        const endX = startX + bone.length * Math.cos(bone.angle);
        const endY = startY + bone.length * Math.sin(bone.angle);

        // Check if the mouse click is near the starting or ending point of the bone
        const distanceToStart = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        const distanceToEnd = Math.sqrt((x - endX) ** 2 + (y - endY) ** 2);
        
        
        if (distanceToStart <= 10/zoom && bonePosition!="end" && k < boneDepth) {
            boneDepth = k;
            boneClicked = bone;
            bonePosition = "start";
        }
        
        if (distanceToEnd <= 10/zoom && k < boneDepth) {
            boneDepth = k;
            boneClicked = bone;
            bonePosition = "end";
        }
    }
    return({
        bone : boneClicked,
        position : bonePosition
    });
}

ctx_drawLine = function(x, y, xTo, yTo, color, thickness) {
    // Apply zoom transformation
    const zoomedX = x * zoom;
    const zoomedY = y * zoom;
    const zoomedXTo = xTo * zoom;
    const zoomedYTo = yTo * zoom;
    
    // Translate the coordinate system to make (0, 0) the center of the canvas
    const centerX = canvasUI.width / 2;
    const centerY = canvasUI.height / 2;
    
    // Adjust the coordinates based on the new center and zoom
    const adjustedX = centerX + zoomedX;
    const adjustedY = centerY + zoomedY; // Note the minus sign due to inverted canvas y-coordinates
    const adjustedXTo = centerX + zoomedXTo;
    const adjustedYTo = centerY + zoomedYTo;
    
    // Set line color and thickness
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    
    // Begin drawing the line
    ctx.beginPath();
    ctx.moveTo(adjustedX, adjustedY);
    ctx.lineTo(adjustedXTo, adjustedYTo);
    ctx.stroke();
}


ctx_drawCircle = function(x, y, color, radius) {
    // Apply zoom transformation
    const zoomedX = x * zoom;
    const zoomedY = y * zoom;
    
    var centerX = canvasUI.width / 2 + zoomedX;
    var centerY = canvasUI.height / 2 + zoomedY;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

//Handle wheel
canvasUI.addEventListener("wheel", function(event) {
    if(selection.type=='boneRotate'){
        selection.boneFrom.length-=event.deltaY*=0.01;
    }
});

//Handle clicks
canvasUI.addEventListener("mouseup", function(event) {
    if(event.button==0){
        if(selection.type=='boneRotate'){
            selection.type='none';
            return;
        }       
    }
});
//Handle clicks
canvasUI.addEventListener("mousedown", function(event) {
    const mouseX = (event.clientX - canvas.getBoundingClientRect().left - canvasUI.width / 2) / zoom;
    const mouseY = (event.clientY - canvas.getBoundingClientRect().top - canvasUI.height / 2) / zoom;

    //Left click
    if(event.button==0){
        if(selection.type=='boneRotate' || selection.type=='imageOffset'){
            selection.type='none';
            return;
        }
        //Check for bone rotate 
        let boneData = bone_getNodeClick(mouseX,mouseY);
        //Only works on end piece of bone
        if(boneData.bone!= null && boneData.position=="end"){
            selection.type="boneRotate";
            selection.boneFrom = boneData.bone;
            return;
        }

        //Check for selecting a bone 
        let bone = bone_findClick(mouseX,mouseY);
        console.log(bone);
        if(bone){
            selection.boneSelect = bone;
            boneDiv.style.display = "initial";
        }
    }

    //Right click
    if(event.button==2){
        //Creating a bone
        if(selection.type=='boneCreate'){
            if(selection.bonePosition=="start"){
                bone_create(selection.boneFrom,selection,selection.boneFrom,selection.bonePosition);
            }else{
                let bone = selection.boneFrom;
                const startX = bone.x;
                const startY = bone.y;
                
                // Calculate the end point based on angle and length
                const endX = startX + bone.length * Math.cos(bone.angle);
                const endY = startY + bone.length * Math.sin(bone.angle);
                bone_create({x:endX,y:endY}, selection,selection.boneFrom,selection.bonePosition);
            }
            selection.type="none";

            return;
        }
        //Click node to start creating bone
        let boneData = bone_getNodeClick(mouseX,mouseY);
        if(boneData.bone!=null){
            selection.type="boneCreate";
            selection.boneFrom = boneData.bone;
            selection.bonePosition = boneData.position;
        }      
    }
});

