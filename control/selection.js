selection = {
    type : "none",
    x : 0,
    y : 0,
}


zoom=1;

//Track cursor
canvasUI.addEventListener("mousemove", function(event) {
    // The event parameter contains information about the click event
    const mouseX = (event.clientX - canvas.getBoundingClientRect().left - canvasUI.width/2) / zoom;
    const mouseY = (event.clientY - canvas.getBoundingClientRect().top - canvasUI.height/2) / zoom;


    selection.x = mouseX;
    selection.y = mouseY;
});

canvasUI.addEventListener("wheel", function(event) {
    if(selection.type=="none"){
        zoom -= event.deltaY*0.001;
    }
});