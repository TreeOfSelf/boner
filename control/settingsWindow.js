
document.getElementById('settings_resolution').addEventListener('input', updateSettingValue);
document.getElementById('settings_overlay_opacity').addEventListener('input', updateSettingValue);


function updateSettingValue() {
    resolution = parseFloat(document.getElementById('settings_resolution').value)/100;
    canvasUI.style.opacity = parseFloat(document.getElementById('settings_overlay_opacity').value)/100; 
    
}


