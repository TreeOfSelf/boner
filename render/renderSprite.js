sprites = [];

function sprite_create(referenceName,imageName,drawOrder){
    sprites[referenceName] = {
        image : imageName,
        drawOrder : drawOrder,
        offsetX : 0,
        offsetY : 0,
        rotation : 0,
        rotationOffset : [0,0]
    }
}

//sprite_create("hooyeahbaby","head",0);

function draw_sprite(bone){
    let info = {...textureCoords[bone.image]};
    let offsetX = bone.imageOffset[0]+bone.x*2;
    let offsetY = -bone.imageOffset[1]-bone.y*2;

    let flip = 1;
    if(bone.flipped) flip=-1;
    const position = [
        // First triangle: Top-left, Top-right, Bottom-left
        flip * -info.w + offsetX,  info.h + offsetY,        // Top-left
        flip * info.w + offsetX,  info.h + offsetY,   // Top-right
        flip * -info.w + offsetX, -info.h + offsetY,              // Bottom-left
    
        // Second triangle: Top-right, Bottom-right, Bottom-left
        flip * info.w + offsetX,  info.h + offsetY,   // Top-right
        flip * info.w + offsetX, -info.h + offsetY,       // Bottom-right
        flip * -info.w + offsetX, -info.h + offsetY            // Bottom-left
    ];
    
    let bottomWidth = (info.x) / textureSize[0];
    let maxWidth = (info.x + info.w) / textureSize[0];
    let bottomHeight = (info.y) / textureSize[1];
    let maxHeight = (info.y + info.h) / textureSize[1];
    
    const texCoord = [
        bottomWidth, bottomHeight,  // Top-left
        maxWidth, bottomHeight,     // Top-right
        bottomWidth, maxHeight,     // Bottom-left
    
        maxWidth, bottomHeight,     // Top-right
        maxWidth, maxHeight,        // Bottom-right
        bottomWidth, maxHeight      // Bottom-left
    ];

    let rads = bone.angle + bone.imageOffsetRotation;
    const rotation = [
        rads,
        rads,
        rads,
        rads,
        rads,
        rads,
    ];

    const rotationOffset = [
        bone.x*2,-bone.y*2,
        bone.x*2,-bone.y*2,
        bone.x*2,-bone.y*2,
        bone.x*2,-bone.y*2,
        bone.x*2,-bone.y*2,
        bone.x*2,-bone.y*2,
    ];


    return({
        position : position,
        texCoord : texCoord,
        rotation : rotation,
        rotationOffset : rotationOffset,
    });
    
}
