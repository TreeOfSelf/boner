//Handle keyboard
window.addEventListener("keydown", function(event) {
    console.log(event.key);
    switch(event.key.toLowerCase()){
        case "escape":
            if(settingsDiv.style.display!="initial"){
                settingsDiv.style.display="initial"
            }else{
                settingsDiv.style.display="none";
            }
        break;
        case "b":
            if(boneDiv.style.display!="initial" && selection.boneSelect){
                boneDiv.style.display="initial"
            }else{
                boneDiv.style.display="none";
            }
        break;
    }
});
